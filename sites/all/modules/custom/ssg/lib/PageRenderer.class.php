<?php

namespace ctac\ssg;

use \Twig\Loader;

class PageRenderer
{
    public $ssg;

    public $templates;
    public $templateDir;
    public $templateDirCache;

    public $templateLoader;
    public $templateRenderer;

    public $renderPageOnFailure;

    public function __construct( &$ssg )
    {
        $this->ssg = &$ssg;

        $repoTemplateDir = $this->ssg->config['templateSync']['repo_template_dir'];
        $repoTemplateDir = preg_replace('(^[\.\/]|[\.\/]$)','',$repoTemplateDir);

        $this->templateDir      = $this->ssg->config['permDir'].'/templates/twig/'.$repoTemplateDir;
        $this->templateDirCache = $this->ssg->config['permDir'].'/templates/compiled';

        $this->ssg->prepareDir($this->templateDir);
        $this->ssg->prepareDir($this->templateDirCache);

        $this->templateLoader   = new \Twig_Loader_Filesystem($this->templateDir);
        $this->templateRenderer = new \Twig_Environment($this->templateLoader, array(
            'cache' => $this->templateDirCache,
            'auto_reload' => 1
        ));

        $this->addFilters();

        $this->loadTwigTemplates();

        $this->renderPageOnFailure = true;
    }

    public function addFilters()
    {
        $ssg =& $this->ssg;

        /*
        * These filteres are written in a style as close to javascript as I can 
        * because these may need to be translated into js filters for the JS Twig
        * to use in Fractal
        */

        $this->templateRenderer->addFilter(new \Twig_Filter('headerSwap', function ($html)
        {
            $html = preg_replace("/<h3>/i",   "<header><h2>",   $html);
            $html = preg_replace("/<h3 /i",   "<header><h2 ",   $html);
            $html = preg_replace("/<\/h3>/i", "</h2></header>", $html);

            $html = preg_replace("/<h4>/i",   "<h3>",  $html);
            $html = preg_replace("/<h4 /i",   "<h3 ",  $html);
            $html = preg_replace("/<\/h4>/i", "</h3>", $html);

            // $html = str_ireplace("<h3>",  "<header><h2>",   $html);
            // $html = str_ireplace("<h3 ",  "<header><h2 ",   $html);
            // $html = str_ireplace("</h3>", "</h2></header>", $html);

            // $html = str_ireplace("<h4>",  "<h3>",  $html);
            // $html = str_ireplace("<h4 ",  "<h3 ",  $html);
            // $html = str_ireplace("</h4>", "</h3>", $html);
            return $html;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('friendly_url', function ($string) use ($ssg)
        {
            return $ssg->sanitizeForUrl($string);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sanitizeForUrl', function ($string) use ($ssg)
        {
            return $ssg->sanitizeForUrl($string);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('onlyFeatures', function ($entities) use ($ssg)
        {
            $features = [];
            foreach ( $entities as $entity ) {
                if ( $ssg->isFeature($entity) ) {
                    $features[$entity['uuid']] = $entity; 
                }
            }
            return $features;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sharesTopicWith', function ($entities,$uuid) use ($ssg)
        {
            return $ssg->sharesTopicWith($entities,$uuid);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sortBy', function ($entities,$key)
        {
            usort($entities,function($a,$b) use ($key) 
            {
                if ( !array_key_exists($key,$a) 
                  || !array_key_exists($key,$b) 
                  || trim($a[$key]) == trim($b[$key]) )
                {
                    return 0;
                }
                return ( trim($a[$key]) < trim($b[$key]) ) ? -1 : 1;
             });
            return $entities;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('is_array', function ($value)
        {
            return is_array($value);
        }));
    }

  	public function renderPage( &$page )
  	{
          $paths = [];
          /// PATH
          $url = $this->getPageUrl($page);
          if ( empty($url) )
          {
              /// not renderable
              $this->ssg->log("UnRenderable: no url for {$page['name']} {$page['friendly_url']}\n");
              return null;
          }
          if ( empty($page['pageType']) )
          {
            $this->ssg->log("UnRenderable: no type for $url ({$page['pageType']}) \"{$page['name']}\"\n");
              return null;
          }
          //$this->ssg->log("Page: $url   name:\"{$page['name']}\" type:{$page['pageType']} \n");
          $path = trim($url,'/ ');

          $fileDir = $this->ssg->siteDir.'/'.$path;
          $file = $fileDir.'/index.html';
          /// TEMPLATE
          $twig = $this->getTwigPageRenderer($page);
          if ( empty($twig) )
          {
            /// directory for path
            if ( !file_exists($fileDir) )
            {
                mkdir( $fileDir, 0755, true );
            }
            chmod( $fileDir, 0755 );
            $msg = "No renderer found <br />\nPath:".$path." <br />\nType: ".$page['pageType']." <br />\nName: ".$page['name'];
            if ( $this->renderPageOnFailure )
            {
                file_put_contents( $file, $msg );
            }
            $this->ssg->log(preg_replace('/(\<br \/\>|\n)/','',$msg)."\n");
            return null;
          }

          /// METADATA FOR RENDERING
          $pageData = $this->preProcessPage($page);

          /// HTML
          $html = $twig->render($pageData);
          $html = trim($html);
          if ( !empty($html) )
          {
              /// directory for path
              if ( !file_exists($fileDir) )
              {
                  mkdir( $fileDir, 0755, true );
              }
              chmod( $fileDir, 0755 );
              file_put_contents( $file, $html );
          } else {
            if ( !file_exists($fileDir) )
            {
                mkdir( $fileDir, 0755, true );
            }
            chmod( $fileDir, 0755 );
            $msg = "Render Failed<br />\nPath:".$path." <br />\nType: ".$page['pageType']." <br />\nName: ".$page['name'];
            if ( $this->renderPageOnFailure )
            {
                file_put_contents( $file, $msg );
            }
            $this->ssg->log(preg_replace('/(\<br \/\>|\n)/','',$msg)."\n");
          }

          /// some special pages generate further sub-pages
          if ( $page['pageType'] == 'AZPage' )
          {
            foreach ( $this->ssg->siteIndexAZ as $letter => $list )
            {
                $pageData['currentAZLetter'] = $letter;
                $html = $twig->render($pageData);
                if ( !empty($html) )
                {
                    /// directory for path
                    $fileDir = $this->ssg->siteDir.'/'.$path.'/'.strtolower($letter);
                    $file = $fileDir.'/'.'index.html';
                    if ( !file_exists($fileDir) )
                    {
                        mkdir( $fileDir, 0755, true );
                    }
                    chmod( $fileDir, 0755 );
                    file_put_contents( $file, $html );
                    //$this->ssg->log("Page: {$path}/".strtolower($letter)." type:".$page['pageType'] ."\n");

                } else {
                    $msg = "Render Failed<br />\nPath: /".$path.'/'.strtolower($letter)."<br />\nType: ".$page['pageType']."<br />\nName: ".$page['name'];
                    if ( $this->renderPageOnFailure )
                    {
                        file_put_contents( $file, $msg."<pre>".print_r($page,1)."</pre>" );
                    }
                    $this->ssg->log(preg_replace('/(\<br \/\>|\n)/','',$msg)."\n");
                }
            }

            if ( $page['az_index_data_source'] == 'directory-records-federal' )
            { 
                // genreate one subpage per record
                foreach ( $this->ssg->directoryRecordGroups[$this->ssg->siteName]['all']['Federal Agencies']['all'] as $agencyInfo )
                {
                    $agency = $this->ssg->source->entities[$agencyInfo['uuid']];

                    $directoryRecordPage = array_merge($page,[]);
                    $directoryRecordPage['uuid'] = $agencyInfo['uuid'];
                    $directoryRecordPage['name'] = $agency['title'];
                    $directoryRecordPage['pageType'] = 'federal-directory-record';
                    $directoryRecordPage['type_of_page_to_generate'] = 'federal-directory-record';
                    
                    $urlSafeTitle = $this->ssg->sanitizeForUrl($agency['title']);
                    $directoryRecordPage['friendly_url'] = $url.'/'.$urlSafeTitle;
                    $directoryRecordPage['asset_order_content'] = [
                        [
                            'target_id' => $agency['nid'],
                            'uuid' => $agency['uuid'],
                            'type' => 'node',
                            'bundle' => $agency['type'],
                        ]
                    ];
                    $subPaths = $this->renderPage($directoryRecordPage);
                    $paths = array_merge( $paths, $subPaths ); 

                }
            }

          } else if ( $page['pageType'] == '50StatePage' ) {

            $matches = [];
            if ( preg_match('/^autogenerate\-(.*)/',$page['usa_gov_50_state_category'],$matches) )
            {
                if ( !empty($matches[1]) )
                {
                    /// just get a copy of this array
                    $detailsPage = array_merge($page,[]);
                    $detailsType = ucfirst($matches[1]);
                    $detailsPage['pageType'] = 'StateDetails'.$detailsType;
                    $detailsPage['type_of_page_to_generate'] = 'state-details-'.strtolower($detailsType);
                    $baseUrl = $url;
                    // for each feature
                    foreach ( $this->ssg->stateAcronyms as $acronym=>$name ) 
                    {
                        if ( !empty($detailsPage['usa_gov_50_state_prefix']) )
                        {
                            $baseUrl = $detailsPage['usa_gov_50_state_prefix'];
                        }
                        $urlSafeName = $this->ssg->sanitizeForUrl($name);
                        $detailsPage['friendly_url'] = $baseUrl.'/'.$urlSafeName;
                        $detailsPage['state'] = $acronym;

                        /// lookup state Directory Record using name?
                        try {
                            if ( array_key_exists("USA.gov",$this->ssg->directoryRecordGroups) 
                              && array_key_exists($acronym,$this->ssg->directoryRecordGroups["USA.gov"])
                              && array_key_exists(0,$this->ssg->directoryRecordGroups["USA.gov"][$acronym]["State Government Agencies"]["all"]) ) 
                            {
                                $stateDirectoryRecord = $this->ssg->source->entities[
                                    $this->ssg->directoryRecordGroups["USA.gov"][$acronym]["State Government Agencies"]["all"][0]["uuid"]
                                ];
                                $detailsPage['asset_order_content'] = [
                                    [
                                        'target_id' => $stateDirectoryRecord['nid'],
                                        'uuid' => $stateDirectoryRecord['uuid'],
                                        'type' => 'node',
                                        'bundle' => $stateDirectoryRecord['type'],
                                    ]
                                ];
                            }
                        } catch(Exception $e) {}
                        $this->renderPage($detailsPage);
                    }
                }
            }

          } else if ( $page['pageType'] == 'Features' && empty($page['currentPage']) ) {
            /// feature page with an empty currentPage is seen by the system as the master page
            /// all other paginated subpages generated will have an integer currentPage
            /// and should not generate further subpages 

            if ( !empty($this->ssg->features[$this->ssg->siteName]) )
            {
                $batchSize = !empty($this->ssg->config['featuresPageBatchSize']) ? $this->ssg->config['featuresPageBatchSize'] : 5;
                $maxPage   = ceil(count($this->ssg->features[$this->ssg->siteName])/$batchSize);
                for ( $currentPage = 1; $currentPage <= $maxPage; $currentPage++ )
                {
                    $featuresPaginated = array_merge($page,[]);
                    $featuresPaginated['currentPage']  = $currentPage;
                    $featuresPaginated['friendly_url'] = $url.'/'.$currentPage;
                    $this->renderPage($featuresPaginated);
                }
            }

            $featurePage = array_merge($page,[]);
            $featurePage['pageType'] = 'Feature'; // singular
            $featurePage['type_of_page_to_generate'] = 'feature';

            // for each state
            foreach ( $this->ssg->features[$this->ssg->siteName] as $feature ) 
            {
                $urlSafeTitle = $this->ssg->sanitizeForUrl($feature['title']);
                $featurePage['friendly_url'] = $url.'/'.$urlSafeTitle;
                $featurePage['asset_order_content'] = [
                    [
                        'target_id' => $feature['nid'],
                        'uuid' => $feature['uuid'],
                        'type' => 'node',
                        'bundle' => $feature['type'],
                    ]
                ];
                $this->renderPage($featurePage);
            }

          }

          array_unshift( $paths, $path );
          return $paths;
  	}

    public function renderRedirect($redirect)
    {
        $path = trim($redirect['source_path'],'/ ');
        $base = basename($path);
        $extn = pathinfo($path, PATHINFO_EXTENSION);
        // if ( empty($extn) && !empty($path) && substr($path,-1)!=='/' ) { $path .= '/'; }

        $fileDir = dirname($this->ssg->siteDir.'/'.$path);
        //if ( $base !== 'index.html' )
        if ( empty($extn) )
        { 
            $file    = $fileDir.'/'.$path.'/index.html';
            $fileDir = $fileDir.'/'.$path;
        } else {
            $file = $fileDir.'/'.$base;
        }

        if (!( substr($redirect['target'],0,7)=='http://' 
            || substr($redirect['target'],0,8)=='https://' 
            || $redirect['target']{0} !== '/' ) )
        { 
            $redirect['target'] .= '/';
        }

        //$this->ssg->log("Redirect: {$redirect['source_path']} => {$redirect['target']} \n");

        $html = "<DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv=\"refresh\" content=\"2;url='{$redirect['target']}'\" />
                    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />
                    <script>
                        window.location.replace(\"{$redirect['target']}\");
                    </script>
                </head>
                <body>
                    <p>This page has moved. Click <a href=\"{$redirect['target']}\">{$redirect['target']}</a> to go to the new page.</p>
                </body>
            </html>";
        $html = trim($html);
        if ( !empty($html) )
        {
            /// directory for path
            if ( !file_exists($fileDir) )
            {
                mkdir( $fileDir, 0755, true );
            }
            chmod( $fileDir, 0755 );
            file_put_contents( $file, $html );
        }
        return true;
    }

    public function getPageUrl( $page )
    {
        if ( !empty($page['field_friendly_url'])
          && !empty($page['field_friendly_url']['und'])
          && !empty($page['field_friendly_url']['und'][0])
          && !empty($page['field_friendly_url']['und'][0]['value']) )
        {
            return $page['field_friendly_url']['und'][0]['value'];
        }
        if ( !empty($page['friendly_url']) )
        {
            return $page['friendly_url'];
        }
        return null;
    }

    public function preProcessPage( &$page )
    {
        $pageParams = [];
        $this->process( $page, $pageParams );
        return $pageParams;
    }

    public function loadTwigTemplates()
    {
        if ( empty($this->ssg->siteName) ) { return false; }

        if ( empty($this->templates[$this->ssg->siteName]) )
        {
            $this->templates[$this->ssg->siteName] = [];
        }
        if ( empty($this->templates[$this->ssg->siteName]['twig']) )
        {
            $this->templates[$this->ssg->siteName]['twig'] = [];
        }

        $iterator = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator(
                        $this->templateDir
                    ));
        foreach ($iterator as $file) 
        {
            if ($file->isDir()) { continue; }
            $path = $file->getPathname();
            $name = basename($path,'.twig');
            if ( 'yml' == pathinfo($path, PATHINFO_EXTENSION) )
            { 
                continue;
            }
            try {
                $this->templates[$this->ssg->siteName]['twig'][$name] = $this->templateRenderer->load($name.'.twig');
            } catch (Exception $e) { 
                $this->templates[$this->ssg->siteName]['twig'][$name] = null;
            }
        }

        return true;
    }

    public function getTwigPageRenderer( $page )
    {
        if ( empty($this->ssg->siteName) ) { return null; }

        if ( !empty($this->templates[$this->ssg->siteName]['twig'][$page['pageType']]) )
        {
            return $this->templates[$this->ssg->siteName]['twig'][$page['pageType']];
        } else {
            
            print_r([ $page['pageType'] => array_keys($this->templates[$this->ssg->siteName]['twig']) ]);die;
            
            return null;
        }
    }

    public function process( &$page, &$params )
    {
      $params = array_merge($params,$page);

      $params['config']   = $this->ssg->config;

      $params['siteName'] = $this->ssg->siteName;
      $params['siteUrl']  = $this->ssg->config['siteUrl'];

      $params['entities'] = $this->ssg->source->entities;

      // if ( child of gobiernoTopLevelTerm )
      // $params['sitePage'] = $this->ssg->source->entites[uuid_of_govierno_top_level_term];
      // $params['homePage'] = $this->ssg->source->entites[uuid_of_govierno_home_page_term];
      // else
      $params['sitePage'] = $this->ssg->sitePage;
      $params['homePage'] = $this->ssg->homePage;
  
      $params['directoryRecordGroups'] = $this->ssg->directoryRecordGroups;
      $params['siteIndexAZ'] = $this->ssg->siteIndexAZ;
      $params['currentAZLetter'] = null;
  
      $params['features']        = $this->ssg->features;
      $params['featuresByTopic'] = $this->ssg->featuresByTopic;

      if ( $page['pageType']=='Features' 
        && empty($params['currentPage']) )
      {
        $params['currentPage'] = 1;
      } else if ( !isset($params['currentPage']) ) {
        $params['currentPage'] = null;
      }

      $params['stateDetails']    = $this->ssg->stateDetails;
      $params['stateAcronyms']   = $this->ssg->stateAcronyms;

      $params['dataLayer'] = $this->getPageDataLayer($page);
    }

    public function getPageDataLayer(&$page)
    {
        /// the main metadata array in special format the USA team wants
        $dataLayer = [ 
            'pageType' => $page['type_of_page_to_generate'],
        ];

        /// tell about any assets rendered on this page
        $assetIds = [];
        foreach($page['asset_order_content'] as $contentItem ) 
        {
            $assetIds[] = $contentItem['target_id'];
        }
        if ( !empty($assetIds) )
        {
            $dataLayer['assetIDs'] = implode( ', ', $assetIds );
        }
        
        /// calculate all ancestors including the top level SiteName term
        $parents = [];
        $parent = $page;
        while( $parent )
        {
            $parents[] = $parent['name'];
            if ( !empty($parent['parent_uuid']) 
              && !empty($this->ssg->source->entities[ $parent['parent_uuid'] ]) )
            {
                $parent = $this->ssg->source->entities[ $parent['parent_uuid'] ];
            } else {
                $parent = null;
                break;
            }
        };
        $parents = array_reverse($parents);
        
        /// remove "All Topics and Services" from the second slot if it is not the last term
        /// first item in the list should be sitesname, if second item is "All Topics" remove it
        /// unless we are rendering the actual "All Topics" page, we just don't want it in the
        /// breadcrumb list of any other pages
        if ( count($parents)>2 && $parents[1]=='All Topics and Services' )
        {
            unset($parents[1]);
        }

        /// make sure we have at least X levels of Taxonomy, repeating the last entry if necessary
        $maxLevel = 6;
        $p = 0;
        foreach ( $parents as $i=>$parentName ) 
        {
            $p++; /// so we start at 1
            $dataLayer['TaxLevel'.$p] = $parentName;
        }
        for( $p=$p+1; $p<=$maxLevel; $p++ )
        {
            $dataLayer['TaxLevel'.$p] = $parentName;
        }

        return $dataLayer;
    }

}