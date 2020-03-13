<?php

namespace ctac\ssg;

class StaticSiteGenerator
{
    use SanitizeUrlTrait;
    use LoggingTrait;
    use DirectoryTrait;

    public $uuid;
    
    public $time;

    public $siteDir;
    public $siteBaseDir;

    public $pages;
    public $pageTree;
    
    public $sitePage;

    public $pageTypes;

    public $siteIndexAZ;
    public $features;
    public $featuresByTopic;
    public $directoryRecordGroups;
    public $stateDetails;
    public $stateAcronyms;
    public $feeds;
    public $contentTypeOverride;

    public $renderer;
    public $config;
    public $s3;

    public $loadDatafromSource;

    public function __construct( $configName='USA.gov' )
    {
        $this->uuid = date('Y-m-d-H-i-s').'-'.mt_rand(10000, 99999);
        //$this->uuid = sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(10000, 99999));

        /// setup page references
        $this->pages     = [];
        $this->sitePage  = null;
        $this->pageTypes = [];

        /// setup content references
        $this->directoryRecordGroups = [];
        $this->features        = [];
        $this->featuresByTopic = [];

        $this->pagesByUrl    = [];
        $this->siteIndexAZ   = [];
        $this->stateAcronyms = [];
        $this->feeds         = [];
        $this->contentTypeOverride = [];

        $configLoader = new ConfigLoader();
        $this->config = $configLoader->loadConfig($configName);

        if ( $this->runtimeEnvironment() == 'drupal' )
        {
            if ( function_exists('_s3fs_get_config') )
            {
                $config = _s3fs_get_config();
                $config['bucket']  = $this->config['aws']['bucket'];
                $config['version'] = 'latest';
                try {
                    $this->s3 = _s3fs_get_amazons3_client($config);
                } catch (S3fsException $e) {
                    $this->log("S3Client error : ".$e->getMessage());
                }
            } else {
                $this->log("SSG error : requires S3FS Module",false);
                return;
            }
        } else if ( $this->runtimeEnvironment() == 'standalone' ) {
            if ( class_exists('\Aws\S3\S3Client') )
            {
                $this->s3 = \Aws\S3\S3Client::factory($this->config['aws']);
                // $sdk = new \Aws\Sdk($this->config['aws']);
                // $this->s3 = $sdk->createS3();
                $this->s3->registerStreamWrapper();
            } else {
                $this->log("SSG error : requires AWS SDK Library",false);
                return;
            }
        }

        if ( !$this->prepareDirs() )
        {
            /// don't bother booting the rest of the stuff if this fails
            // JKH comment out die...
            // die;
            // JKH add log of failure
            $this->log("SSG error : prepareDirs() fails",false);
            return;
        }

        $this->templates   = new TemplateSource( $this ); 
        $this->source      = new DrupalAPIDataSource( $this );
        $this->destination = new S3SiteDestination( $this );
        $this->renderer    = new PageRenderer( $this );

        $this->getDatafromSource = false;
    }

    public function prepareDirs()
    {
        if ( !$this->prepareDir($this->config['tempDir']) )
        {
            $this->log("SSG error : tempDir not available : {$this->config['tempDir']}\n");
            return false;
        }
        if ( !$this->prepareDir($this->config['permDir']) )
        {
            $this->log("SSG error : permDir not available : {$this->config['permDir']}\n");
            return false;
        }
        
        //$this->cacheDir = realpath($this->config['permDir']).'/cache';
        $this->cacheDir = $this->config['permDir'].'/cache';
        if ( !$this->prepareDir($this->cacheDir) )
        {
            $this->log("SSG error : cacheDir not available : {$this->cacheDir}\n");
            return false;
        }

        $this->siteBaseDir = $this->config['tempDir'].'/sites/'.trim(strtolower($this->config['siteName']),'/ ');
        if ( $this->runtimeEnvironment() == 'standalone' ) 
        {
            $this->siteDir = $this->siteBaseDir;
        } else {
            $this->siteDir = $this->siteBaseDir.'/'.$this->uuid;
        }
        
        if ( !$this->prepareDir($this->siteDir) )
        {
            $this->log("SSG error : siteDir not available : {$this->siteDir}\n");
            return false;
        }
        if ( !$this->validateDiskSpace() )
        {
            $this->cleanupOldSitesByNumber();
            if ( !$this->validateDiskSpace() )
            {
                $this->log("SSG error : insufficient disk space\n",false);
                return false;
            }
        }
        return true;
    }

    public function loadTemplates()
    {
        $synced = $this->templates->sync();
        if ( !$synced ) {
            $this->log("syncTemplates: syncing from source failed\n");
            return false; 
        }
        $loaded = $this->renderer->loadTwigTemplates();
        if ( !$loaded ) { 
            $this->log("syncTemplates: loading templates failed\n");
            return false; 
        }

        return true;
    }

    public function loadData()
    {
        return $this->source->loadData();
    }

    public function buildSiteTreeFromEntities()
    {
        $this->log("Site Tree building from entities ... \n");
        $treeStartTime = microtime(true);

        $this->pages           = [];
        $this->pagesByUrl      = [];
        $this->sitePage        = [];
        // $this->homePage     = null;
        // $this->topicsPage   = null;
        $this->pageTypes       = [];
        // $this->subSite         = [];
        $this->directoryRecordGroups = [];
        $this->features        = [];
        $this->featuresByTopic = [];
        $this->stateDetails    = [];
        $this->feeds           = [];
        $this->sitemaps        = [];

        $this->siteIndexAZ = [
            'all' => ['A'=>[],'B'=>[],'C'=>[],'D'=>[],'E'=>[],'F'=>[],'G'=>[],'H'=>[],'I'=>[],'J'=>[],'K'=>[],'L'=>[],'M'=>[],'N'=>[],'O'=>[],'P'=>[],'Q'=>[],'R'=>[],'S'=>[],'T'=>[],'U'=>[],'V'=>[],'W'=>[],'X'=>[],'Y'=>[],'Z'=>[]]
        ];

        foreach( $this->source->entities as $uuid=>$entity )
        {
            $fubs = !empty($entity['for_use_by']) ? $entity['for_use_by'] : $this->config['allowedForUseBy'];

            /// IF THIS IS A PAGE
            if ( isset($entity['tid']) && isset($entity['vocabulary_machine_name'])
                 && $entity['vocabulary_machine_name']=='site_strucutre_taxonomy' )
            {
                $this->pages[$uuid] =& $this->source->entities[$uuid];
                if ( !empty($entity['pageType']) 
                  && !array_key_exists($entity['pageType'],$this->pageTypes) )
                {
                    $this->pageTypes[$entity['pageType']] = $entity['pageType'];
                }                
                if ( empty($entity['parent']) && !empty($entity['for_use_by']) )
                {
                    $rev = array_reverse($entity['for_use_by']);
                    $fub = array_pop($rev);
                    $this->sitePage[$fub] =& $this->source->entities[$uuid];
                }
                if ( !empty($this->pages[$uuid]['friendly_url']) && empty($this->pagesByUrl[$this->pages[$uuid]['friendly_url']]) )
                {
                    $this->pagesByUrl[$this->pages[$uuid]['friendly_url']] =& $this->source->entities[$uuid];
                }
                if ( !empty($entity['usa_gov_50_state_category']) ) 
                {
                    $this->source->entities[$uuid]['usa_gov_50_state_category'] = preg_replace('/^field_/','',$entity['usa_gov_50_state_category']);
                }
                $i=0;
                if ( !empty($entity['browser_title']) && !empty($entity['generate_page']))// && strtolower($entity['generate_page'])=='yes' )
                {
                    $title = trim(preg_replace('/^\W+/','',$entity['browser_title']));
                    $letter = strtoupper($title{0});
                    $this->siteIndexAZ['all'][$letter][] = [ 'uuid'=>$entity['uuid'], 'title'=>$entity['browser_title'] ];
                    foreach ( $fubs as $fub )
                    {
                        if ( !array_key_exists($fub,$this->siteIndexAZ) )
                        {
                            $this->siteIndexAZ[$fub] = ['A'=>[],'B'=>[],'C'=>[],'D'=>[],'E'=>[],'F'=>[],'G'=>[],'H'=>[],'I'=>[],'J'=>[],'K'=>[],'L'=>[],'M'=>[],'N'=>[],'O'=>[],'P'=>[],'Q'=>[],'R'=>[],'S'=>[],'T'=>[],'U'=>[],'V'=>[],'W'=>[],'X'=>[],'Y'=>[],'Z'=>[]];
                        }
                        $this->siteIndexAZ[$fub][$letter][] = [ 'uuid'=>$entity['uuid'], 'title'=>$entity['browser_title'] ];
                    }
                }
                
                /// amber alert
                if ( array_key_exists('children',$this->source->entities[$uuid]) )
                {
                    $this->source->entities[$uuid]['children'] = [];
                }
                
            /// IF THIS IS A CONTENT ITEM
            } else {

                if ( $this->isFeature($entity) )
                {
                    foreach ( $fubs as $fub )
                    {
                        if ( strtolower($fub) == 'feature' )
                        {
                            continue;
                        }
                        if ( !array_key_exists($fub,$this->features) )
                        {
                            $this->features[$fub] = [];
                        }
                        $this->features[$fub][$entity['uuid']] =& $this->source->entities[$entity['uuid']];
                        if ( !array_key_exists($fub,$this->featuresByTopic) )
                        {
                            $this->featuresByTopic[$fub] = [];
                        }
                        if ( array_key_exists('asset_topic_taxonomy',$entity) )
                        {
                            foreach ( $entity['asset_topic_taxonomy'] as $asset_topic )
                            {
                                if ( !array_key_exists($asset_topic['uuid'],$this->featuresByTopic[$fub]) )
                                {
                                    $this->featuresByTopic[$fub][$asset_topic['uuid']] = [];
                                }
                                $this->featuresByTopic[$fub][$asset_topic['uuid']][$entity['uuid']] =& $this->source->entities[$entity['uuid']];
                            }
                        }
                    }
                }

                if ( $this->isSitemap($entity) )
                {
                    $this->sitemaps[$entity['uuid']] = $entity;
                }

                /// fill in any missing states from our hardcoded list
                if ( $entity['type'] == 'state_details' )
                {
                    foreach ( $fubs as $fub )
                    {
                        if ( !array_key_exists( $fub, $this->stateDetails ) )
                        {
                            $this->stateDetails[$fub] = [];
                        }
                        $this->stateDetails[$fub][] = [ 'uuid'=>$uuid, 'state_canonical_name'=>strtolower($entity['state_canonical_name']), 'title'=>$entity['title'] ];
                        
                        /// format state names
                        if ( !empty($entity['state_acronym']) && !empty($entity['state_canonical_name'] ) )
                        {
                            $this->stateAcronyms[$fub][strtolower($entity['state_acronym'])] = $this->formatStateCanonicalName( $entity['state_canonical_name'] );
                        }
                    }
                }

                if ( array_key_exists('directory_type',$entity) )
                {
                    $state      = !empty($entity['state'])    ? strtolower($entity['state']) : strtolower('None');
                    //$state_name = ( array_key_exists($state,$this->stateAcronyms) ) ? $this->stateAcronyms[$state] : 'None';
                    $group_by   = !empty($entity['group_by']) ? $entity['group_by'] : 'None';
                    $type       = $entity['directory_type'];
                    $dfubs      = $fubs;
                    $dfubs[]    = 'all';

                    /// groupings are done by these fields 
                    /// there is 'all' variation for FUB, STATE, and GROUP_BY but not TYPE
                    /// directoryRecordGroups[$fub][$state][$type][$group_by]

                    if ( empty($entity['friendly_url']) )
                    {
                        $entity['friendly_url'] = '';
                        if ( array_key_exists('title',$entity) )
                        {
                            $entity['friendly_url'] = $this->sanitizeForUrl($entity['title']);
                        }
                    }

                    foreach ( $dfubs as $fub )
                    {
                        /// start organizing array
                        if ( !array_key_exists( $fub, $this->directoryRecordGroups ) )
                        {
                            $this->directoryRecordGroups[$fub] = [ 'all'=>[], 'forms'=>[], 'none'=>[] ];
                        }
                        if ( !array_key_exists( $state, $this->directoryRecordGroups[$fub] ) )
                        {
                            $this->directoryRecordGroups[$fub][$state] = [];
                        }

                        if ( !array_key_exists( $type, $this->directoryRecordGroups[$fub]['all'] ) )
                        {
                            $this->directoryRecordGroups[$fub]['all'][$type] = [ 'all'=>[] ];
                        }
                        if ( !array_key_exists( $type, $this->directoryRecordGroups[$fub][$state] ) )
                        {
                            $this->directoryRecordGroups[$fub][$state][$type] = [ 'all'=>[] ];
                        }

                        if ( !array_key_exists( 'Federal Agencies', $this->directoryRecordGroups[$fub]['all'] ) )
                        {
                            $this->directoryRecordGroups[$fub]['all']['Federal Agencies'] = [ 'all'=>[] ];
                        }
                        if ( !array_key_exists( 'Federal Agencies', $this->directoryRecordGroups[$fub][$state] ) )
                        {
                            $this->directoryRecordGroups[$fub][$state]['Federal Agencies'] = [ 'all'=>[] ];
                        }

                        if ( !array_key_exists( $group_by, $this->directoryRecordGroups[$fub]['all'][$type] ) ) {
                            $this->directoryRecordGroups[$fub]['all'][$type][$group_by] = [];
                        }
                        if ( !array_key_exists( $group_by, $this->directoryRecordGroups[$fub][$state][$type] ) ) {
                            $this->directoryRecordGroups[$fub][$state][$type][$group_by] = [];
                        }
                        /// finish organizing array - start putting in content

                        $this->directoryRecordGroups[$fub]['all'][$type]['all'][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                        $this->directoryRecordGroups[$fub][$state][$type]['all'][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];

                        $this->directoryRecordGroups[$fub]['all'][$type][$group_by][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                        $this->directoryRecordGroups[$fub][$state][$type][$group_by][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];

                        /// AZ Index
                        if ( ( trim(strtolower($type)) == 'federal agencies' )
                           || strtolower($type) == 'state government agencies' )
                        {
                            $letter = strtoupper($entity['title']{0});

                            if ( array_key_exists('show_on_az_index',$entity)
                                && trim(strtolower($entity['show_on_az_index'])) == 'yes' )
                            {
                                $this->directoryRecordGroups[$fub]['all'][$type][$letter][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                                $this->directoryRecordGroups[$fub][$state][$type][$letter][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                            }

                            if ( strtolower($type) == 'state government agencies' )
                            {
                                $this->directoryRecordGroups[$fub]['all']['Federal Agencies']['all'][]    = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                                $this->directoryRecordGroups[$fub][$state]['Federal Agencies']['all'][]   = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];

                                $this->directoryRecordGroups[$fub]['all']['Federal Agencies'][$group_by][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                                $this->directoryRecordGroups[$fub][$state]['Federal Agencies'][$group_by][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
        
                              //  if ( array_key_exists('show_on_az_index',$entity)
                                //    && trim(strtolower($entity['show_on_az_index'])) == 'yes' )
                                //{
                                    $this->directoryRecordGroups[$fub]['all']['Federal Agencies'][$letter][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                                    $this->directoryRecordGroups[$fub][$state]['Federal Agencies'][$letter][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                                //}
                            }

                            if ( !empty($entity['synonym']) )
                            {
                                foreach ( $entity['synonym'] as $synonym )
                                {
                                    $letter = strtoupper($synonym['value']{0});

                                    $this->directoryRecordGroups[$fub]['all'][$type]['all'][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                    $this->directoryRecordGroups[$fub][$state][$type]['all'][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];

                                    $this->directoryRecordGroups[$fub]['all'][$type][$group_by][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                    $this->directoryRecordGroups[$fub][$state][$type][$group_by][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];

                                    if ( array_key_exists('show_on_az_index',$entity)
                                        && trim(strtolower($entity['show_on_az_index'])) == 'yes' )
                                    {
                                        $this->directoryRecordGroups[$fub]['all'][$type][$letter][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                        $this->directoryRecordGroups[$fub][$state][$type][$letter][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                    }

                                    if ( strtolower($type) == 'state government agencies' )
                                    {
                                        $this->directoryRecordGroups[$fub]['all']['Federal Agencies']['all'][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                        $this->directoryRecordGroups[$fub][$state]['Federal Agencies']['all'][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];

                                        $this->directoryRecordGroups[$fub]['all']['Federal Agencies'][$group_by][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                        $this->directoryRecordGroups[$fub][$state]['Federal Agencies'][$group_by][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];

                                      //  if ( array_key_exists('show_on_az_index',$entity)
                                        //    && trim(strtolower($entity['show_on_az_index'])) == 'yes' )
                                       // {
                                            $this->directoryRecordGroups[$fub]['all']['Federal Agencies'][$letter][]  = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                            $this->directoryRecordGroups[$fub][$state]['Federal Agencies'][$letter][] = [ 'uuid'=>$uuid, 'title'=>$synonym['value'] ];
                                        //}
                                    }
                                }
                            }
                        }

                        /// GOV Branches
                        if ( trim(strtolower($type)) == 'federal agencies' && !empty($entity['government_branch']) )
                        {
                            $letter = strtoupper($entity['title']{0});
                            
                            $this->directoryRecordGroups[$fub]['all'][$type][$entity['government_branch']][]  = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                            $this->directoryRecordGroups[$fub][$state][$type][$entity['government_branch']][] = [ 'uuid'=>$uuid, 'title'=>$entity['title'] ];
                        }

                        /// FORMS Index
                        if ( isset($entity['link_form_links'])
                            && array_key_exists('url',$entity['link_form_links'])
                            && array_key_exists('title',$entity['link_form_links'])
                            && !empty($entity['link_form_links']['url'])
                            && !empty($entity['link_form_links']['title']) )
                        {
                            $letter = strtoupper($entity['title']{0});
                            $this->directoryRecordGroups[$fub]['forms'][$type][$letter][] = [ 
                                'uuid'=>$uuid, 
                                'title'=>$entity['title'], 
                                'formTitle'=>$entity['link_form_links']['title']
                            ];

                            if ( !empty($entity['synonym']) )
                            {
                                foreach ( $entity['synonym'] as $synonym )
                                {
                                    $letter = strtoupper($synonym['value']{0});
                                    $this->directoryRecordGroups[$fub]['forms'][$type][$letter][] = [ 
                                        'uuid'=>$uuid, 
                                        'title'=>$synonym['value'], 
                                        'formTitle'=>$entity['link_form_links']['title']
                                    ];
                                }
                            }
                        }
                    }

                }

                /// if this is a feed
                if ( $entity['type'] == 'cmp_feed' )
                {
                    foreach ( $fubs as $fub )
                    {
                        if ( !array_key_exists($fub,$this->feeds) )
                        {
                            $this->feeds[$fub] = [];
                        }
                        $this->feeds[$fub][$entity['uuid']] =& $this->source->entities[$entity['uuid']];
                    }
                }
            }
        }

        foreach( $this->pages as $uuid=>$entity )
        {
            /// add myself to my parent
            if ( array_key_exists('parent_uuid',$this->source->entities[$uuid]) )
            {
                if ( array_key_exists($this->source->entities[$uuid]['parent_uuid'],
                                      $this->source->entities) )
                {
                    $this->source->entities[$this->source->entities[$uuid]['parent_uuid']]['children'][] = [
                        'uuid' => $uuid,
                        'tid'  => $this->source->entities[$uuid]['tid'],
                    ];
                }
            }
            /// verify all my content items are legit
            $content_regions = array('asset_order_carousel', 'asset_order_content', 'asset_order_sidebar', 'asset_order_bottom', 'field_asset_order_menu', 'field_home_alert_asset', 'field_home_howdoi_assets');
            foreach ( $content_regions as $region_field )
            {
                if ( array_key_exists($region_field,$this->source->entities[$uuid]) )
                {
                    foreach ( $this->source->entities[$uuid][$region_field] as $c=>$content )
                    {
                        if ( ( array_key_exists('uuid',$content) &&
                              !array_key_exists($content['uuid'],$this->source->entities) )
                            || $this->source->entities[$content['uuid']]['deleted']==1 )
                        {
                            //error_log("\nBAD CONTENT $c:".print_r($content,1)."\n");
                            unset($this->source->entities[$uuid][$region_field][$c]);
                        }
                    }
                }
            }
        }

        foreach( $this->source->entities as $uuid=>$entity )
        {
            /// IF THIS IS A PAGE
            $fubs = !empty($entity['for_use_by']) ? $entity['for_use_by'] : $this->config['allowedForUseBy'];

            if ( isset($entity['tid']) && isset($entity['vocabulary_machine_name'])
                 && $entity['vocabulary_machine_name']=='site_strucutre_taxonomy' )
            {
                $features = [];
                foreach ( $fubs as $fub )
                {
                    if ( array_key_exists($fub,$this->features) ) 
                    {
                        $features = array_merge($features,$this->features[$fub]);
                    }
                }
                $sharesTopic = $this->sharesTopicWith($features,$uuid);
                $sharesTopic = array_filter($sharesTopic, function($v) {
                    return isset($v['created']) && $v['created'] > time()-1209600;///two weeks ago  3600*24*7*2;
                });
                array_multisort(
                    array_column($sharesTopic,'created'), SORT_ASC,
                    array_column($sharesTopic,'changed'), SORT_ASC,
                    $sharesTopic
                );
                if ( !empty($sharesTopic) )
                {
                   $first = array_shift($sharesTopic);
                   $this->source->entities[$uuid]['whats_new'] = [ 'uuid'=>$first['uuid'], 'title'=>$first['title'] ];
                } else {
                    $this->source->entities[$uuid]['whats_new'] = null;
                }
            }
        }

        foreach ( $this->stateDetails as $fub=>&$details )
        {
            array_multisort(
                array_column($details,'state_canonical_name'),SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            $details);
        }

        foreach ( array_keys($this->features) as $fub )
        {
            array_multisort(
                array_column($this->features[$fub],'created'), SORT_ASC,
                array_column($this->features[$fub],'changed'), SORT_ASC,
            $this->features[$fub]);
        }

        /// each feature gets a list of associated features 
        /// base on it's for_use_by values
        foreach ( array_keys($this->features) as $ffub )
        {
            foreach ( $this->features[$ffub] as $uuid=>&$feature )
            {
                $feature['shares_topic'] = [];
                if ( array_key_exists('asset_topic_taxonomy',$feature) )
                {
                    foreach ( $feature['asset_topic_taxonomy'] as $asset_topic )
                    {
                        foreach ( $feature['for_use_by'] as $fub )
                        {
                            if ( array_key_exists($fub,$this->featuresByTopic) && 
                                 array_key_exists($asset_topic['uuid'],$this->featuresByTopic[$fub]) )
                            {
                                foreach ( $this->featuresByTopic[$fub][$asset_topic['uuid']] as &$sharesTopic )
                                {
                                    $feature['shares_topic'][$sharesTopic['uuid']] = [
                                        'uuid'=>$sharesTopic['uuid'],
                                        'title'=>$sharesTopic['title'],
                                        'changed'=>$sharesTopic['changed'],
                                        'created'=>$sharesTopic['created']
                                    ];
                                }
                            }
                        }
                    }
                }
                array_multisort(
                    array_column($feature['shares_topic'],'created'), SORT_ASC,
                    array_column($feature['shares_topic'],'changed'), SORT_ASC,
                $feature['shares_topic']);
            }
        }

        ksort($this->directoryRecordGroups);
        foreach ( $this->directoryRecordGroups as $fub=>&$fubList )
        {
            ksort($fubList);
            if ( array_key_exists('none',$fubList) )
            {
                $fubList = array('none'  => $fubList['none'])  + $fubList;
            }
            if ( array_key_exists('forms',$fubList) )
            {
                $fubList = array('forms' => $fubList['forms']) + $fubList;
            }
            if ( array_key_exists('all',$fubList) )
            {
                $fubList = array('all'   => $fubList['all'])   + $fubList;
            }
            foreach ( $fubList as $state=>&$stateList )
            {
                ksort($stateList);
                foreach ( $stateList as $type=>&$typeList )
                {
                    ksort($typeList);
                    if ( array_key_exists('None',$typeList) )
                    {
                        $typeList = array('None'  => $typeList['None'])  + $typeList;
                    }
                    if ( array_key_exists('all',$typeList) )
                    {
                        $typeList = array('all'   => $typeList['all'])   + $typeList;
                    }
                    foreach ( $typeList as $group=>&$groupList )
                    {
                        array_multisort(
                            array_column($groupList,'title'), SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
                        $groupList);
                    }
                }
            }
        }

        foreach ( $this->siteIndexAZ as $fub=>&$az )
        {
            ksort($az);
            foreach ( $az as &$pages )
            {
                foreach($pages as &$p) {
                    $p['sortable_title'] = $this->remove_accents($p['title']);
                }

                array_multisort(
                    array_column($pages,'sortable_title'), SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
                    array_column($pages,'uuid'),  SORT_ASC,
                    $pages);
            }
        }

        $this->buildMenus();

        /// undo all references get copies instead of references
        /// so we can save to cache

        foreach ( array_keys($this->pages) as $uuid )
        {
            $this->pages[$uuid] = $this->source->entities[$uuid];
        }
        foreach ( $this->pagesByUrl as $url=>$page )
        {
            $this->pagesByUrl[$url] = $this->source->entities[$page['uuid']];
        }
        foreach ( array_keys($this->sitePage) as $fub )
        {
            if ( !empty($this->sitePage['uuid']) )
            {
                $this->sitePage[$fub] = $this->source->entities[$this->sitePage['uuid']];
            }
        }
        // if ( !empty($this->homePage) && !empty($this->homePage['uuid']) )
        // {
        //     $this->homePage   = $this->source->entities[$this->homePage['uuid']];
        // }
        // if ( !empty($this->topicsPage) && !empty($this->topicsPage['uuid']) )
        // {
        //     $this->topicsPage = $this->source->entities[$this->topicsPage['uuid']];
        // }

        $this->log("Site Tree building from entities ... done\n");
    }

    public function formatStateCanonicalName( $stateCanonicalName )
    {
        $stateCanonicalName = str_replace('.',' ',$stateCanonicalName);
        $stateCanonicalName = preg_replace('/\s+/',' ',$stateCanonicalName);
        $stateCanonicalName = ucwords($stateCanonicalName);
        $stateCanonicalName = preg_replace('/(\b)Of(\b)/',  '$1of$2',    $stateCanonicalName);
        $stateCanonicalName = preg_replace('/(\b)The(\b)/', '$1the$2',   $stateCanonicalName);
        $stateCanonicalName = preg_replace('/(\b)De(\b)/',  '$1de$2',    $stateCanonicalName);
        $stateCanonicalName = preg_replace('/(\b)Del(\b)/', '$1del$2',   $stateCanonicalName);
        return $stateCanonicalName;
    }

    public function isSitemap($entity)
    {
        return array_key_exists('media_type',$entity)
                && in_array(strtolower($entity['media_type']),['sitemap']);
    }
    public function isFeature($entity)
    {
        return array_key_exists('type',$entity)
                && in_array($entity['type'],['text_content_type','html_content_type','multimedia_content_type'])
                && array_key_exists('for_use_by',$entity)
                && (
                    ( is_array($entity['for_use_by'])
                      && in_array('Feature',$entity['for_use_by'])
                    ) || (
                        is_string($entity['for_use_by'])
                        && 'feature' == strtolower($entity['for_use_by'])
                    )
                );
    }
    public function sharesTopicWith($entities,$uuid)
    {
        if ( !array_key_exists($uuid,$this->source->entities) )
        {
            return [];
        }
        $entity = $this->source->entities[$uuid];
        if ( !array_key_exists('asset_topic_taxonomy',$entity) )
        {
            return [];
        }
        $topics = [];
        foreach ( $entity['asset_topic_taxonomy'] as $asset_topic )
        {
            $topics[$asset_topic['uuid']] = true;
        }
        $sharesTopic = [];
        foreach ( $entities as &$test )
        {
            if ( !array_key_exists('asset_topic_taxonomy',$test) )
            {
                continue;
            }
            foreach ( $test['asset_topic_taxonomy'] as $asset_topic )
            {
                if ( isset($topics[$asset_topic['uuid']]) )
                {
                    $sharesTopic[] =& $test;
                }
            }
        }
        return $sharesTopic;
    }

    public function buildMenus()
    {
        foreach( $this->pages as $uuid=>&$page )
        {
            $rev = array_reverse($page['for_use_by']);
            $fub = array_pop($rev);

            if ( array_key_exists($fub,$this->sitePage) 
                 && $this->sitePage[$fub]['uuid']==$page['uuid'] )
            {
                $page['menu'] = $this->buildMainNavMenu($page);
            } else {
                $page['menu'] = $this->buildNavMenu($page);
            }
            $page['child_pages'] = $this->buildPageMenu($page);
        }
    }
    public function buildMainNavMenu($page) 
    {
        // menu item's must also have a css field, but that is taken care of at the template level
        $menu = [];
        //$directChildren = $this->filteredDescendantPages($page,'children',['generate_menu','generate_page']);
        $directChildren = $this->filteredDescendantPages($page,'children',['generate_menu']);
        $menu = $directChildren;
        // $alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page',['generate_menu','generate_page']);
        // $menu = array_merge($directChildren, $alsoInclude);

        array_multisort(
            array_column($menu,'weight'),SORT_ASC,
            array_column($menu,'name'),  SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($menu,'tid'),   SORT_ASC,
        $menu);

        foreach ( $menu as &$menuItem )
        {
            if ( !empty($this->source->entities[$menuItem['uuid']]) )
            {
                $menuItem['menu'] = $this->buildMainNavSubMenu($this->source->entities[$menuItem['uuid']]);
            }
        }

        return $menu;
    }
    public function buildMainNavSubMenu(&$page) 
    {
        $menu = [];

        //$directChildren = $this->filteredDescendantPages($page,'children',['generate_menu','generate_page']);
        $directChildren = $this->filteredDescendantPages($page,'children',['generate_menu']);
        array_multisort(
            array_column($directChildren,'weight'),SORT_ASC,
            array_column($directChildren,'name'),  SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($directChildren,'tid'),   SORT_ASC,
        $directChildren);

        //$alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page',['generate_menu','generate_page']);
        $alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page',['generate_menu']);
        array_multisort(
            array_column($alsoInclude,'name'),SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($alsoInclude,'tid'), SORT_ASC,
        $alsoInclude);

        $menu = array_merge($directChildren, $alsoInclude);
        return $menu;
    }
    public function buildNavMenu( &$page ) 
    {
        $menu = [];

        $directChildren = $this->filteredDescendantPages($page,'children',['generate_menu']); //['generate_menu','generate_page']
        $alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page',['generate_menu']); //['generate_menu','generate_page']

        $menu = array_merge($directChildren, $alsoInclude);

        array_multisort(
            array_column($menu,'name'),SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($menu,'tid'), SORT_ASC,
        $menu);

        return $menu;
    }
    public function buildPageMenu( &$page ) 
    {
        $menu = [];

        //$directChildren = $this->filteredDescendantPages($page,'children','generate_page');
        $directChildren = $this->filteredDescendantPages($page,'children');

        //$alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page','generate_page');
        $alsoInclude    = $this->filteredDescendantPages($page,'also_include_on_nav_page');

        $menu = array_merge($directChildren, $alsoInclude);

        array_multisort(
            array_column($menu,'name'),SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($menu,'tid'), SORT_ASC,
        $menu);

        return $menu;
    }

    public function filteredDescendantPages(&$page,$pageSourceKey='children',$generateCheckKeys=['generate_menu'],$sortByKey=false,$sortByWeight=false)
    {
        if ( empty($page[$pageSourceKey]) ) { return []; }
        if ( !is_array($generateCheckKeys) ) { $generateCheckKeys = [$generateCheckKeys]; }
        $pageList = [];
        foreach($page[$pageSourceKey] as $i=>$item)
        {
            if ( !is_array($item) || !array_key_exists('uuid',$item) || empty($item['uuid']) || empty($this->source->entities[$item['uuid']]) ) { continue; }
            $child =& $this->source->entities[$item['uuid']];
            foreach ( $generateCheckKeys as $generateCheckKey )
            {
                if ( array_key_exists($generateCheckKey,$child) && $child[$generateCheckKey]=='no' )
                {
                    continue 2; 
                }
            }
            $listItem = [
                'uuid'=>$child['uuid'],
                'name'=>$child['name'],
                'friendly_url'=>$child['friendly_url'],
                'css_class'=>$child['css_class'],
                'description_meta'=>$child['description_meta'],
                'weight'=>$child['weight'],
                'tid'=>$child['tid'],
                'generate_menu'=>$child['generate_menu'],
                'generate_page'=>$child['generate_page'],
            ];
            $pageList[$child['uuid']] = $listItem;
        }
        return $pageList;
    }

    public function validatePage( $filename, $checkHtml = true )
    {
        $fileExists = file_exists($filename);
        if ( !$fileExists ) { 
            $this->log("Validate Page: no file at $filename\n");
            return false; 
        }
        $fileFilled = ( filesize($filename) > 0 );
        if ( !$fileFilled )
        {
            $this->log("Validate Page: empty file at $filename\n");
            return false;
        }

        if ( !$checkHtml ) 
        {
            return true;
        }

        $fileHandle = fopen($filename, 'r');
        if ( !$fileHandle )
        {
            $this->log("Validate Page: unreadable file at $filename\n");
            return false;
        }

        $fileHeader = fread($fileHandle, 100);
        fclose($fileHandle);
        $fileHeader = trim($fileHeader);
        $fileIsHtml = ( $fileHeader{0} == '<');
        if ( !$fileIsHtml )
        {
            $this->log("Validate Page: non-html file at $filename: $fileHeader\n");
            return false;
        }

        return true;
    }
    /// EDNARK needs to be fixed somehow
    public function validateSite()
    {
        $validationStatus = (
            is_dir($this->siteDir)
            && file_exists($this->siteDir.'/index.html')
            && filesize($this->siteDir.'/index.html') > 0
            && is_dir($this->siteDir.'/espanol')
            && file_exists($this->siteDir.'/espanol/index.html')
            && filesize($this->siteDir.'/espanol/index.html') > 0
        );
        
        if ( empty($validationStatus) ){
            $this->log("Validate Site: Empty Site \n");
        }
        else $this->log("Validate Site: Valid\n");

        return $validationStatus;
        
        /*
        if ( empty($this->pagesByUrl) )
        {
            $this->log("Validate Site: no site found to validate\n");
            return null;
        }
        $requiredPages = 0;
        $renderedPages = 0;
        /// shouldn't be duplicating the logic here, it's too easy to break
        foreach ( $this->pagesByUrl as $url=>&$page )
        {
            /// only validate pages that should be generated
            if ( array_key_exists('generate_page',$page) && $page['generate_page']!='yes' )
            {
            continue;
        }
            $requiredPages++;
            $pageDir = rtrim( $this->siteDir.'/'.trim($url,'/'), '/' );
            $pageFile = $pageDir.'/index.html';

            if ( $this->validatePage($pageFile) )
            {
                $renderedPages++;
            } else {
                $this->log("Invalid: {$url} : {$page['uuid']}\n");
            }

            /// some special pages generate further sub-pages
            if ( $page['pageType'] == 'AZPage' )
            {
                /// add for-use-by 
                foreach ( $this->siteIndexAZ as $letter => $list )
                {
                    $requiredPages++;
                    $subUrl = $url.'/'.strtolower($letter);
                    $subPageDir = rtrim( $pageDir.'/'.trim(strtolower($letter),'/'), '/' );
                    $subPageFile = $subPageDir.'/index.html';
                    if ( $this->validatePage($subPageFile) )
                    {
                        $renderedPages++;
                    } else {
                        $this->log("Invalid: {$subUrl}\n");
                    }        
            }

                if ( isset($page['az_index_data_source']) 
                  && $page['az_index_data_source'] == 'directory-records-federal' )
                {
                    foreach ( $page['for_use_by'] as $fub )
                    {
                        if ( !array_key_exists($fub,$this->directoryRecordGroups) ) { continue; }
                        foreach ( $this->directoryRecordGroups[$fub]['all']['Federal Agencies']['all'] as $agencyInfo )
                        {
                            $requiredPages++;
                            $agency = $this->source->entities[$agencyInfo['uuid']];

                            $urlSafeTitle = $this->sanitizeForUrl($agency['title']);
                            $subUrl = $url.'/'.$urlSafeTitle;
                            $subPageDir = rtrim( $pageDir.'/'.$urlSafeTitle, '/');
                            $subPageFile = $subPageDir.'/index.html';
                            if ( $this->validatePage($subPageFile) )
                            {
                                //$this->log("**Valid: {$subUrl} // {$agency['title']}\n");
                                $renderedPages++;
                            } else {
                                $this->log("Invalid: {$subUrl} // {$agency['title']} // {$agency['uuid']}\n");
                            }        
                        }
                    }
                }
            } else if ( $page['pageType'] == '50StatePage' ) {
                if ( !empty($page['usa_gov_50_state_category']) 
                  && preg_match('/^autogenerate\-(.*)/',$page['usa_gov_50_state_category']) )
                {
                    foreach ( $this->stateAcronyms as $stateAcronym=>$stateName ) 
                    {
                        $requiredPages++;
                        $subUrl = $url.'/'.$this->sanitizeForUrl($stateName);
                        if ( !empty($page['usa_gov_50_state_prefix']) )
                        {
                            $subUrl = $page['usa_gov_50_state_prefix']
                                        .'/'.$this->sanitizeForUrl($stateName);
                        }
                        $subPageDir = rtrim( $this->siteDir.'/'.trim($subUrl,'/'), '/' );
                        $subPageFile = $subPageDir.'/index.html';
                        if ( $this->validatePage($subPageFile) )
                        {
                            $renderedPages++;
                        } else {
                            $this->log("Invalid: {$subUrl}\n");
                        }        
                    }
                }
            } else if ( $page['pageType'] == 'Features' ) {
    
                foreach ( $page['for_use_by'] as $fub )
                {
                    foreach ( $this->features[$fub] as $feature ) 
                    {
                        $requiredPages++;
                        $urlSafeTitle = $this->sanitizeForUrl($feature['title']);
                        $subUrl = $url.'/'.$urlSafeTitle;
                        $subPageDir = rtrim( $pageDir.'/'.$urlSafeTitle, '/');
                        $subPageFile = $subPageDir.'/index.html';
                        if ( $this->validatePage($subPageFile) )
                        {
                            $renderedPages++;
                        } else {
                            $this->log("Invalid: {$subUrl}\n");
                        }        
                    }
                }
            }
        }
        $this->log("Site Validation: $renderedPages of $requiredPages pages rendered to /sites/{$this->config['siteName']} \n");
        return ($requiredPages <= $renderedPages);
        */
    }

    public function cleanupSite()
    {
        if ( !empty($this->siteDir) && $this->siteDir !== '/' )
        {
            $this->rmDir($this->siteDir);
        }
    }

    public function cleanupAllSites()
    {
        if ( !empty($this->siteBaseDir) && $this->siteBaseDir !== '/' )
        {
            $this->rmDir($this->siteBaseDir);
        }
    }

    public function cleanupOldSitesByDate($howOld='-6 hours')
    {
        if ( $this->siteBaseDir == $this->siteDir )
        {
            return;
        }
        $minDirAge = strtotime($howOld);
        if ( !empty($this->siteBaseDir) && $this->siteBaseDir !== '/' )
        {
            $dirList = new RecursiveDirectoryIterator($this->siteBaseDir);
            foreach ( $dirList as $dirItem )
            {
                $dirName = $dirItem->getFileName();
                $m = [];
                if ( preg_match("/^(?<YMD>\d{4}\-\d{2}\-\d{2})\-(?<H>\d{2})\-(?<i>\d{2})\-(?<s>\d{2})/",$dirName,$m) )
                {
                    $dirTime = strtotime("{$m['YMD']} {$m['H']}:{$m['i']}:{$m['s']}");
                    if ( $dirTime < $minDirAge )
                    {
                        $this->rmDir($dirItem->getPathName());
                    }
                }
            }
        }
    }

    public function cleanupOldSitesByNumber($numberToKeep=2,$bufferSeconds=600)
    {
        if ( $this->siteBaseDir == $this->siteDir )
        {
            return;
        }
        /// keep all dirs less than Y seconds old
        /// keep X dirs more than Y seconds old
        if ( !empty($this->siteBaseDir) && $this->siteBaseDir !== '/' )
        {
            $dirList  = new \RecursiveDirectoryIterator($this->siteBaseDir,\FilesystemIterator::SKIP_DOTS);
            $sortList = [];
            foreach ( $dirList as $dirItem )
            {
                $dirName = $dirItem->getFileName();
                if ( $dirName == '.' || $dirName == '..' )
                {
                    continue;
                }
                $m = [];
                if ( preg_match("/^(?<YMD>\d{4}\-\d{2}\-\d{2})\-(?<H>\d{2})\-(?<i>\d{2})\-(?<s>\d{2})/",$dirName,$m) )
                {
                    $dirTime = strtotime("{$m['YMD']} {$m['H']}:{$m['i']}:{$m['s']}");
                    $sortList[$dirTime] = $dirItem->getPathName();
                } else {
                    $this->rmDir($dirItem->getPathName());
                }
            }
        }
        /// slice off X items, these dirs will be kept
        krsort($sortList,SORT_NUMERIC);
        $removable = array_slice($sortList,$numberToKeep,NULL,TRUE);

        $currTime = time();
        foreach ( $removable as $dirTime => $dirPath )
        {
            /// for sanity reasons, give builds time to complete
            /// remove only dirs older than Y seconds
            if ( ($currTime-$dirTime) > $bufferSeconds ) 
            {
                $this->rmDir($dirPath);
            }   
        }
    }

    public function deploySite()
    {
        return $this->destination->sync();
    }

    public function renderSite( $renderPageOnFailure=false )
    {
        if ( empty($this->sitePage) )
        {
            $this->log("Rendering Site: no sites found\n");
            return false;
        }

        /// clean out the site page
        $this->log("Rendering Site: cleanup up old site ... \n");
        $this->cleanupSite();

        /// render redirects
        $this->log("Rendering: Redirects\n");
        $redirectResult = $this->renderRedirects();

        /// render content pages
        foreach ( $this->sitePage as $siteName => $sitePage ) 
        {
            $this->log("Rendering: $siteName pages\n");
            $this->renderTree($sitePage);
            $this->log("Rendering: $siteName feeds\n");
            $this->renderFeeds($sitePage);
        }

        /// copy over static assets - to multiple locations
        // $this->log("Rendering: asset files\n");
        $assetDestBaseDirs = [
            "{$this->siteDir}",
            "{$this->siteDir}/sites/all/themes/usa"
        ];
        $assetDirs = $this->config['templateSync']['repo_asset_dirs'];
        if ( empty($assetDirs) )
        {
            $assetDirs[] = '*';
        }
        foreach ( $assetDirs as $sourceDir )
        {
            $this->log("Rendering: assets from /{$this->config['templateSync']['repo_asset_base']}/{$sourceDir}\n");
            foreach ( $assetDestBaseDirs as $destBaseDir )
            {
                if ( $sourceDir == '*' )
                {
                    $fromDir = "{$this->templates->sourceAssetDir}";
                    $intoDir = "{$destBaseDir}";
                } else {
                    $fromDir = "{$this->templates->sourceAssetDir}/{$sourceDir}";
                    $intoDir = "{$destBaseDir}/{$sourceDir}";
                }
                if ( is_dir($fromDir) )
                {
                    $this->prepareDir($intoDir);
                    $this->copyDir($fromDir,$intoDir);
                    $this->chmodDir($intoDir,0744);
                    $this->chownDir($intoDir);
                }
            }
        }

        /// copy over static files - to one location
        // $this->log("Rendering: static files\n");
        $staticDestBaseDirs = [
            "{$this->siteDir}"
        ];
        $staticDirs = $this->config['templateSync']['repo_static_dirs'];
        if ( empty($staticDirs) )
        {
            $staticDirs[] = '*';
        }
        foreach ( $staticDirs as $sourceDir )
        {
            $this->log("Rendering: static files from /{$this->config['templateSync']['repo_static_base']}/{$sourceDir}\n");
            foreach ( $staticDestBaseDirs as $destBaseDir )
            {
                if ( $sourceDir == '*' )
                {
                    $fromDir = "{$this->templates->sourceStaticDir}";
                    $intoDir   = "{$destBaseDir}";
                } else {
                    $fromDir = "{$this->templates->sourceStaticDir}/{$sourceDir}";
                    $intoDir   = "{$destBaseDir}/{$sourceDir}";
                }

                if ( is_dir($fromDir) )
                {
                    $this->prepareDir($intoDir);
                    $this->copyDir($fromDir,$intoDir);
                    $this->chmodDir($intoDir,0744);
                    $this->chownDir($intoDir);
                }
            }
        }

        /// render sitemap
        $this->log("Rendering: Sitemap\n");
        $sitemapResult = $this->renderSitemaps();

        // if ( empty($treeResult) ||  empty($redirectResult) ) {
        //     $this->log("Render Site: failed\n");
        // } else {
            $this->log("Rendering Site: done\n");
        // }
        // return $redirectResult;
        return true;
    }
    public function renderTree( $page, $renderPageOnFailure=true )
    {
        if ( empty($page) )
        {
            return null;
        }
        $paths = [];
        if ( !empty($page['generate_page']) && $page['generate_page']!='no' )
        {
            $renderResult = $this->renderer->renderPage($page,$renderPageOnFailure);
            if ( $renderResult === false )
            {
                /// there was a failure
                return false;
            } else if ( $renderResult === null ) {
                /// there was nothing to be generated
            } else {
                /// pageResult is an array of paths generated
                $paths = array_merge($paths, $renderResult);
            }
        }
        if ( array_key_exists('children',$page) )
        {
            foreach ( $page['children'] as $childPage )
            {
                if ( !empty($childPage['uuid']) )
                {
                    if ( !empty($this->source->entities[$childPage['uuid']]) )
                    {
                        $child =& $this->source->entities[$childPage['uuid']];
                        $renderResult = $this->renderTree($child);
                        if ( $renderResult === false )
                        {
                            /// there was a failure
                            return false;
                        } else if ( $renderResult === null ) {
                            /// there was no file generated
                        } else {
                            /// pageResult is an array of paths generated
                            $paths = array_merge($paths, $renderResult);
                        }            
                    }
                }
            }
        }
        return $paths;
    }

    public function renderRedirects()
    {
        foreach ( $this->source->redirects as $redirect )
        {
            $this->renderer->renderRedirect($redirect);
        }
        return true;
    }

    public function renderFeeds( $sitePage )
    {
        foreach ( $sitePage['for_use_by'] as $fub )
        {
            if ( empty($this->feeds[$fub]) ) { continue; }
            foreach ( $this->feeds[$fub] as $feed )
            {
                $this->renderer->renderFeed($feed);
            }
        }
        return true;
    }

    public function renderSitemaps()
    {
        foreach ( $this->sitemaps as $sitemap )
        {
            $this->renderer->renderSitemap($sitemap);
        }
        return true;
    }


    public function getPageType( $page )
    {
        if ( !array_key_exists('type_of_page_to_generate',$page)
            || !is_string($page['type_of_page_to_generate']) )
        {
            return null;
        }
        return $this->formatPageType($page['type_of_page_to_generate']);
    }

    public function formatPageType( $type )
    {
        $pageType = trim(strtolower($type));
        return preg_replace('/\s+/','',ucwords(str_replace(['-'],' ',$pageType)));
    }

    public function validateRuntime()
    {
        /// check that config params can be found
        /// check /temp and /perm for read-write permission
        /// check /temp and /perm have enough space for a build
    }

    public function validateDiskSpace()
    {
        $minFreeBytes = 0;
        /// check any previous builds for their actual size
        $dirList      = new \RecursiveDirectoryIterator($this->siteBaseDir, \FilesystemIterator::SKIP_DOTS);
        foreach ( $dirList as $dirItem )
        {
            $cleanPath = preg_replace("/([^\w\/\-\.])/", '\\\$1', $dirItem->getPathName() );
            $size = `du -sk {$cleanPath}`;
            $size = substr ( $size, 0, strpos ( $size, "\t" ) );
            $usedBytes = $size*1024;
            if ( $usedBytes > $minFreeBytes )
            {
                $minFreeBytes = $usedBytes;
            }
        }
        /// default to a previously known size
        if ( empty($minFreeBytes) )
        {
            $minFreeBytes = 144340000; /// ~141 M
        }
        $availableBytes = disk_free_space( $this->siteBaseDir );
        /// go ahead and make sure we have twice what we need
        
        return ( $availableBytes > ($minFreeBytes*2) );
    }

    public function validateDataSource()
    {
        /// resolve hostname
        /// check endpoint exists
        /// do a count to make sure data exist at endpoit
    }

    public function validateTemplateSource()
    {
        /// check for git
        /// check repo exists
        /// check git credentials
        /// check /source has read-write
    }

    public function validateDestination()
    {
        /// check for aws credentials
        /// check for bucket existance
        /// check for bucket list-read-write
        /// ? check cloudfront somehow
    }
}