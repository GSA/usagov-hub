<?php

namespace ctac\ssg;

use \Twig\Loader;

class PageRenderer
{
    use LoggingTrait;
    use SanitizeUrlTrait;
    use DirectoryTrait;

    public $ssg;

    public $templates;
    public $templateDir;
    // public $templateDirCache;

    public $templateLoader;
    public $templateRenderer;

    public $renderPageOnFailure;

    public function __construct(&$ssg)
    {
        $this->ssg = &$ssg;

        $this->templateDir      = $this->ssg->templates->sourceTemplateDir;
        // $this->templateDirCache = $this->ssg->config['permDir'].'/templates/compiled';

        $this->prepareDir($this->templateDir);
        // $this->prepareDir($this->templateDirCache);

        $this->templateLoader   = new \Twig_Loader_Filesystem($this->templateDir);
        $this->templateRenderer = new \Twig_Environment($this->templateLoader, array(
            // 'cache' => $this->templateDirCache,
            'cache' => false,
            'auto_reload' => 1
        ));
        $this->templateRenderer->enableAutoReload();

        $this->templates = [];

        $this->addFilters();

        // $this->loadTwigTemplates();

        $this->renderPageOnFailure = false;
    }

    public function addFilters()
    {
        $ssg =& $this->ssg;

        /*
        * These filteres are written in a style as close to javascript as I can 
        * because these may need to be translated into js filters for the JS Twig
        * to use in Fractal
        */

        $this->templateRenderer->addFilter(new \Twig_Filter('headerSwap', function ($html) {
            $html = preg_replace("/<h3>/i", "<header><h2>", $html);
            $html = preg_replace("/<h3 /i", "<header><h2 ", $html);
            $html = preg_replace("/<\/h3>/i", "</h2></header>", $html);

            $html = preg_replace("/<h4>/i", "<h3>", $html);
            $html = preg_replace("/<h4 /i", "<h3 ", $html);
            $html = preg_replace("/<\/h4>/i", "</h3>", $html);

            return $html;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('friendly_url', function ($string) use ($ssg) {
            return $this->sanitizeForUrl($string);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sanitizeForUrl', function ($string) use ($ssg) {
            return $this->sanitizeForUrl($string);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('onlyFeatures', function ($entities) use ($ssg) {
            $features = [];
            foreach ($entities as $entity) {
                if ($ssg->isFeature($entity)) {
                    $features[$entity['uuid']] = $entity;
                }
            }
            return $features;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sharesTopicWith', function ($entities, $uuid) use ($ssg) {
            return $ssg->sharesTopicWith($entities, $uuid);
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('sortBy', function ($entities, $key) {
            if (is_array($entities)) {
                usort($entities, function ($a, $b) use ($key) {
                    if (!array_key_exists($key, $a)
                    || !array_key_exists($key, $b)
                    || trim($a[$key]) == trim($b[$key]) ) {
                        return 0;
                    }
                    return ( trim($a[$key]) < trim($b[$key]) ) ? -1 : 1;
                });
            }
            return $entities;
        }));
        $this->templateRenderer->addFilter(new \Twig_Filter('is_array', function ($value) {
            return is_array($value);
        }));
    }

    public function renderPage(&$page)
    {
        /// this needs to fail better
        $paths = [];
        /// PATH
        $url = $this->getPageUrl($page);
        if (empty($url)) {
            /// not renderable
            $this->log("UnRenderable: no url for {$page['name']} {$page['friendly_url']}\n");
            return null;
        }
        if (empty($page['pageType'])) {
            $this->log("UnRenderable: no type for $url ({$page['pageType']}) \"{$page['name']}\"\n");
            return null;
        }
        $path = $this->sanitizeForUrl($url);
        $path = trim($path, '/ ');

        $fileDir = $this->ssg->siteDir.'/'.$path;
        $file = $fileDir.'/index.html';
        /// TEMPLATE

        /*
        if ($this->runtimeEnvironment() == 'standalone') {
            $_url = str_pad($path, (strlen($path)+( 25 - ( strlen($path) % 25 ) )));
            $_type = str_pad($page['pageType'], (strlen($page['pageType'])+( 25 - ( strlen($page['pageType']) % 25 ) )));
            $this->log("Path: {$_type}  {$path}\n", false);
        }
        */

        $twig = $this->getTwigPageRenderer($page);
        if (empty($twig)) {
            /// directory for path
            if (!file_exists($fileDir)) {
                @mkdir($fileDir, 0755, true);
            } elseif (!is_dir($fileDir)) {
                @unlink($fileDir);
                @mkdir($fileDir, 0755, true);
            }
            @chmod($fileDir, 0755);
            $msg = "No renderer found <br />\nPath:".$path." <br />\nType: ".$page['pageType']." <br />\nName: ".$page['name'];
            if ($this->renderPageOnFailure) {
                if (empty(file_put_contents($file, $msg))) {
                    $msg = "Write Failed\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                    $this->log($msg);
                    return false;
                } elseif ($this->runtimeEnvironment() == 'standalone') {
                    // $msg = "Write SUCCESS\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                    // $this->log($msg);                
                }    
            }
            $this->log(preg_replace('/(\<br \/\>|\n)/', '', $msg)."\n");
            return null;
        }
        /// METADATA FOR RENDERING
        $pageParams = [];
        $this->processPageParams($page, $pageParams);

        if (empty($pageParams)) {
            $this->log("UnRenderable: no params for $url ({$page['pageType']}) \"{$page['name']}\"\n");
            return null;
        }
        $html = $twig->render($pageParams);
        $html = trim($html);
        if (!empty($html)) {
            /// directory for path
            if (!file_exists($fileDir)) {
                @mkdir($fileDir, 0755, true);
            } elseif (!is_dir($fileDir)) {
                @unlink($fileDir);
                @mkdir($fileDir, 0755, true);
            }
            @chmod($fileDir, 0755);
            if (empty(file_put_contents($file, $html))) {
                $msg = "Write Failed\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                $this->log($msg);
                return false;
            } elseif ($this->runtimeEnvironment() == 'standalone') {
                // $msg = "Write SUCCESS\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                // $this->log($msg);                
            }
        } else {
            if (!file_exists($fileDir)) {
                @mkdir($fileDir, 0755, true);
            } elseif (!is_dir($fileDir)) {
                @unlink($fileDir);
                @mkdir($fileDir, 0755, true);
            }
            @chmod($fileDir, 0755);
            $msg = "Render Failed<br />\nPath:".$path." <br />\nType: ".$page['pageType']." <br />\nName: ".$page['name'];
            if ($this->renderPageOnFailure) {
                if (empty(file_put_contents($file, $msg))) {
                    $msg = "Write Failed\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                    $this->log($msg);
                    return false;
                } else {
                    // $msg = "Write SUCCESS\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                    // $this->log($msg);                
                }
            }
            $this->log(preg_replace('/(\<br \/\>|\n)/', '', $msg)."\n");
        }

        /// some special pages generate further sub-pages
        $rev = array_reverse($page['for_use_by']);
        $fub = array_pop($rev);
        if ($page['pageType'] == 'AZPage') {
          /// render one sub-page per letter
            foreach ($this->ssg->siteIndexAZ[$fub] as $letter => $azItems) {
                $subPageParams = array_merge($pageParams, []);

                $subPageParams['currentAZLetter'] = $letter;

                $html  = $twig->render($subPageParams);
                if ($this->runtimeEnvironment() == 'standalone') {
                    $_url = '/'.$path.'/'.strtolower($letter);
                    $_url = str_pad($_url, (strlen($_url)+( 25 - ( strlen($_url) % 25 ) )));
                    $_type = str_pad($page['pageType'], (strlen($page['pageType'])+( 25 - ( strlen($page['pageType']) % 25 ) )));
                    // $this->log("Path: {$_type}  {$_url}\n",false);
                }
                if (!empty($html)) {
                    /// directory for path
                    $fileDir = $this->ssg->siteDir.'/'.$path.'/'.strtolower($letter);
                    $file = $fileDir.'/'.'index.html';
                    if (!file_exists($fileDir)) {
                        @mkdir($fileDir, 0755, true);
                    } elseif (!is_dir($fileDir)) {
                        @unlink($fileDir);
                        @mkdir($fileDir, 0755, true);
                    }
                    @chmod($fileDir, 0755);
                    if (empty(file_put_contents($file, $html))) {
                        $msg = "Write Failed\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                        $this->log($msg);
                        return false;
                    } elseif ($this->runtimeEnvironment() == 'standalone') {
                        // $msg = "Write SUCCESS\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                        // $this->log($msg);                
                    }
                    array_unshift($paths, $path.'/'.strtolower($letter));
                } else {
                    $msg = "Render Failed<br />\nPath: /".$path.'/'.strtolower($letter)."<br />\nType: ".$page['pageType']."<br />\nName: ".$page['name'];
                    if (!file_exists($fileDir)) {
                        @mkdir($fileDir, 0755, true);
                    } elseif (!is_dir($fileDir)) {
                        @unlink($fileDir);
                        @mkdir($fileDir, 0755, true);
                    }
                    @chmod($fileDir, 0755);
                    if ($this->renderPageOnFailure) {
                        if (empty(file_put_contents($file, $msg))) {
                            $msg = "Write Failed\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                            $this->log($msg);
                            return false;
                        } elseif ($this->runtimeEnvironment() == 'standalone') {
                            // $msg = "Write SUCCESS\nPath:".$file." \nType: ".$page['pageType']." \nName: ".$page['name']."\n";
                            // $this->log($msg);                
                        }
                    }
                    $this->log(preg_replace('/(\<br \/\>|\n)/', '', $msg)."\n");
                }
            }
            
            /// render one sub-page per item
            if ($page['az_index_data_source'] == 'directory-records-federal') {
                foreach ($this->ssg->directoryRecordGroups[$fub]['all']['Federal Agencies']['all'] as $agencyInfo) {
                    $agency = $this->ssg->source->entities[$agencyInfo['uuid']];

                    $directoryRecordPage = array_merge($page, []);
                    $directoryRecordPage['uuid'] = $agencyInfo['uuid'];
                    $directoryRecordPage['name'] = $agency['title'];
                    $directoryRecordPage['pageType'] = 'federal-directory-record';
                    $directoryRecordPage['type_of_page_to_generate'] = 'federal-directory-record';
                        
                    $urlSafeTitle = $this->sanitizeForUrl($agency['title']);
                    $directoryRecordPage['friendly_url'] = '/'.$path.'/'.$urlSafeTitle;
                    $directoryRecordPage['asset_order_content'] = [
                    [
                        'target_id' => $agency['nid'],
                        'uuid' => $agency['uuid'],
                        'type' => 'node',
                        'bundle' => $agency['type'],
                    ]
                    ];
                    $subPaths = $this->renderPage($directoryRecordPage);
                    $paths = array_merge($paths, $subPaths);
                }
            }
        } elseif ($page['pageType'] == '50StatePage') {
            $matches = [];
            if (preg_match('/^autogenerate\-(.*)/', $page['usa_gov_50_state_category'], $matches)) {
                if (!empty($matches[1])) {
                    /// just get a copy of this array
                    $detailsPage = array_merge($page, []);
                    $detailsType = ucfirst($matches[1]);
                    $detailsPage['pageType'] = 'StateDetails'.$detailsType;
                    $detailsPage['type_of_page_to_generate'] = 'state-details-'.strtolower($detailsType);
                    if (!empty($detailsPage['usa_gov_50_state_prefix'])) {
                        $baseUrl = $detailsPage['usa_gov_50_state_prefix'];
                    } else {
                        $baseUrl = $url;
                    }
                    
                    // for each state
                    foreach ($this->ssg->stateAcronyms[$fub] as $acronym => $name) {
                        $urlSafeName = $this->sanitizeForUrl($name);
                        $detailsPage['friendly_url'] = $baseUrl.'/'.$urlSafeName;
                        $detailsPage['state'] = $acronym;

                        /// lookup state Directory Record using name?
                        if (array_key_exists($fub, $this->ssg->directoryRecordGroups)
                        && array_key_exists($acronym, $this->ssg->directoryRecordGroups[$fub])
                        && array_key_exists(0, $this->ssg->directoryRecordGroups[$fub][$acronym]["State Government Agencies"]["all"]) ) {
                            $stateDirectoryRecord = $this->ssg->source->entities[
                                $this->ssg->directoryRecordGroups[$fub][$acronym]["State Government Agencies"]["all"][0]["uuid"]
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
                        $subPaths = $this->renderPage($detailsPage);
                        $paths = array_merge($paths, $subPaths);
                    }
                }
            }
        } elseif ($page['pageType'] == 'Features' && empty($page['currentPage'])) {
            /// feature page with an empty currentPage is seen by the system as the
            /// master page or landing page for features

            /// all other paginated subpages generated will have an integer currentPage
            /// and should not generate further subpages

            /// render all the features together from all page fubs
                
            $batchSize = !empty($this->ssg->config['featuresPageBatchSize']) ? $this->ssg->config['featuresPageBatchSize'] : 5;
            // $maxPage   = ceil(count($pageParams['features'])/$batchSize);
            $maxPage   = ceil(count($this->ssg->features[$fub])/$batchSize);
            for ($currentPage = 1; $currentPage <= $maxPage; $currentPage++) {
                $featuresPaginated = array_merge($page, []);
                $featuresPaginated['currentPage']  = $currentPage;
                $featuresPaginated['friendly_url'] = $url.'/'.$currentPage;
                $subPaths = $this->renderPage($featuresPaginated);
                $paths = array_merge($paths, $subPaths);
            }

            /// also render one page for each of the features based off the main url
            $featurePage = array_merge($page, []);
            $featurePage['pageType'] = 'Feature'; // singular
            $featurePage['type_of_page_to_generate'] = 'feature';

            // foreach ( $pageParams['features'] as $feature )
            foreach ($this->ssg->features[$fub] as $feature) {
                $urlSafeTitle = $this->sanitizeForUrl($feature['title']);
                $featurePage['friendly_url'] = $url.'/'.$urlSafeTitle;
                $featurePage['asset_order_content'] = [
                    [
                        'target_id' => $feature['nid'],
                        'uuid' => $feature['uuid'],
                        'type' => 'node',
                        'bundle' => $feature['type'],
                    ]
                ];
                $subPaths = $this->renderPage($featurePage);
                $paths = array_merge($paths, $subPaths);
            }
        }
        array_unshift($paths, $path);
        return $paths;
    }

    public function renderSitemap(&$sitemap)
    {
        if ( !array_key_exists('file_media',$sitemap) || 
             !array_key_exists('uri',$sitemap['file_media']) )
        {
            return false;
        }

        $sitemap_uri = $sitemap['file_media']['uri'];
        // print_r([substr($sitemap_uri,0,2),$sitemap['file_media']]);
        if ( substr($sitemap_uri,0,2) == '//' )
        {
            $sitemap_uri = 'https:'.$sitemap_uri;
        }
        $sitemap_contents = file_get_contents($sitemap_uri);
        if ( empty($sitemap_contents) )
        {
            return false;
        }

        $fileDir = $this->ssg->siteDir;
        $path    = '/sitemap.xml';
        if ( in_array('GobiernoUSA.gov',$sitemap['for_use_by']) ) {
            $fileDir = $this->ssg->siteDir.'/espanol';
            $path    = '/espanol/sitemap.xml';
        }
        $file = $fileDir.'/sitemap.xml';

        $sitemap_contents = trim($sitemap_contents);
        if (!empty($sitemap_contents))
        {
            /// directory for path
            if (!file_exists($fileDir))
            {
                @mkdir($fileDir, 0755, true);
            } elseif (!is_dir($fileDir)) {
                @unlink($fileDir);
                @mkdir($fileDir, 0755, true);
            }
            @chmod($fileDir, 0755);
            if (empty(file_put_contents($file, $sitemap_contents)))
            {
                $msg = "Write Failed\nPath:".$file." \nType: Sitemap \n";
                $this->log($msg);
                return false;
            } elseif ($this->runtimeEnvironment() == 'standalone') {
                // $msg = "Write SUCCESS\nPath:".$file." \nType: Sitemap \n";
                // $this->log($msg);
            }
        }
        return [$path];
    }

    public function renderRedirect($redirect)
    {
        $path = trim($redirect['source_path'], '/ ');
        $path = str_replace(' ','',$path);
        $path = strtolower($path);
        $extn = pathinfo($path, PATHINFO_EXTENSION);

        if (empty($extn)) {
            $file    = $this->ssg->siteDir.'/'.$path.'/index.html';
            $fileDir = dirname($file);
        } else {
            $file = $this->ssg->siteDir.'/'.$path;
            $fileDir = dirname($file);
        }
        // if (!( substr($redirect['target'], 0, 7)=='http://'
        //     || substr($redirect['target'], 0, 8)=='https://'
        //     || $redirect['target']{0} !== '/' ) ) {
        //     $redirect['target'] .= '/';
        // }
        // $this->log("\nRedirect: \n    source:{$redirect['source_path']} \n    path:{$path}\n    extn:{$extn}\n    target:{$redirect['target']} \n    siteDir:{$this->ssg->siteDir} \n    path:{$path}\n    file:{$file}\n    fileDir:{$fileDir}");
		// JKH added utf8mb4
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
        if (!empty($html)) {
            /// directory for path
            if (!file_exists($fileDir)) {
                @mkdir($fileDir, 0755, true);
            } elseif (!is_dir($fileDir)) {
                @unlink($fileDir);
                @mkdir($fileDir, 0755, true);
            }
            @chmod($fileDir, 0755);
            if (empty(file_put_contents($file, $html))) {
                $msg = "Write Failed\nPath:".$file." \nType: Redirect \n";
                $this->log($msg);
                return false;
            } elseif ($this->runtimeEnvironment() == 'standalone') {
                // $msg = "Write SUCCESS\nPath:".$file." \nType: Redirect \n";
                // $this->log($msg);                
            }
        }
        return [$path];
    }

    public function renderFeed($feed)
    {
        //$path    = ltrim($this->sanitizeForUrl($feed['friendly_url']), '/');
        $path    = ltrim($feed['friendly_url']);
        $file    = $this->ssg->siteDir.'/'.$path;
        $fileDir = dirname($file);
        $url    = 'https://'.$this->ssg->config['siteUrl'].'/'.$path;

        switch ($feed['feed_type']) {
            case 'RSS Feed':
                $output = $feed['feed_rss_markup'];
                $this->ssg->contentTypeOverride[$path] = 'application/rss+xml; charset=utf-8';
                break;
            case 'JSON Feed':
                $output = $feed['json_feed_markup'];
                $this->ssg->contentTypeOverride[$path] = 'application/json; charset=utf-8';
                break;
            default:
                return null;
        }

        $matches = [];
        preg_match_all("/\[[^\]\s]+?\]/", $output, $matches);
        if (!empty($matches[0])) {
            foreach ($matches[0] as $match) {
                $match = trim($match);
                switch ($match) {
                    case '[request-path]':
                        $output = str_replace($match, $path, $output);
                        break;
                    case '[items]':
                        $output = str_replace($match, $this->renderFeedItems($feed), $output);
                        break;
                    case '[description]':
                        $output = str_replace($match, $feed['body'], $output);
                        break;
                    case '[callback]':
                        $output = str_replace('[callback]', 'callback', $output);
                    default:
                        $field = trim($match, '[] ');
                        if (array_key_exists($field, $feed)) {
                            $output = str_replace($match, $feed[$field], $output);
                        }
                }
            }
        }

        /// directory for path
        if (!file_exists($fileDir)) {
            @mkdir($fileDir, 0755, true);
        } elseif (!is_dir($fileDir)) {
            @unlink($fileDir);
            @mkdir($fileDir, 0755, true);
        }
        @chmod($fileDir, 0755);

        if (empty(file_put_contents($file, $output))) {
            $msg = "Write Failed Path:".$path." Type: ".$feed['feed_type']." Name: ".$feed['title']."\n";
            $this->log($msg);
            return false;
        } elseif ($this->runtimeEnvironment() == 'standalone') {
        //     $_url = str_pad($path, (strlen($path)+( 25 - ( strlen($path) % 25 ) )));
        //     $_type = str_pad($feed['feed_type'], (strlen($feed['feed_type'])+( 25 - ( strlen($feed['feed_type']) % 25 ) )));
        //     $this->log("Path: {$_type}  {$_url}\n", false);
        }
        return [$path];
    }
    public function renderFeedItems($feed)
    {
        $output = '';
        switch ($feed['feed_type']) {
            case 'RSS Feed':
                $itemMarkup = "
                <item>
                    <title>[title]</title>
                    <pubDate>[pubDate]</pubDate>
                    <link>[link]</link>
                    <description>[description]</description>
                </item>";
                $dateFormat = 'M d, Y H:i:s';
                break;
            case 'JSON Feed':
                $itemMarkup = '
                {
                    "ARTICLE": "CONTENT FLAG SET TO NO",
                    "LASTUPDATE": "[pubDate]",
                    "TITLE": "[title]",
                    "URL": "[link]"
                }';
                $dateFormat = 'm/d/Y';
                break;
            default:
                return $output;
        }

        if (!empty($feed['feed_items'])) {
            foreach ($feed['feed_items'] as $item) {
                if (!array_key_exists($item['uuid'], $this->ssg->source->entities)) {
                    continue;
                }
                $node =& $this->ssg->source->entities[$item['uuid']];

                $dt = new \DateTime(
                    $node['feed_item_pubdate']['value'],
                    new \DateTimeZone($node['feed_item_pubdate']['timezone'])
                );

                $itemOutput = $itemMarkup;
                $itemOutput = str_replace('[title]', $node['title'], $itemOutput);
                $itemOutput = str_replace('[pubDate]', $dt->format($dateFormat), $itemOutput);
                $itemOutput = str_replace('[link]', $node['feed_item_link'], $itemOutput);
                $itemOutput = str_replace('[description]', $node['body'], $itemOutput);
                if ( !empty($output) )
                {
                    $output .= ',';
                }
                $output .= $itemOutput;
            }
        }
        if (!empty($feed['feed_items_terms'])) {
            foreach ($feed['feed_items_terms'] as $item) {
                // Get the date of the last time this term was updated/changed
                $term =& $this->ssg->source->entities[$item['uuid']];
                // $dt = new \DateTime($term['changed']);
                $dt = date($dateformat, $term['changed']);

                $path    = ltrim($this->sanitizeForUrl($term['friendly_url']), '/');
                $url    = 'https://'.$this->ssg->config['siteUrl'].'/'.$path;

                $itemOutput = $itemMarkup;
                $itemOutput = str_replace('[title]', $term['page_title'], $itemOutput);
                $itemOutput = str_replace('[pubDate]', $dt, $itemOutput);
                $itemOutput = str_replace('[link]', $url, $itemOutput);
                $itemOutput = str_replace('[description]', $term['description'], $itemOutput);
                if ( !empty($output) )
                {
                    $output .= ',';
                }
                $output .= $itemOutput;
            }
        }
        return $output;
    }

    public function getPageUrl($page)
    {
        if (!empty($page['field_friendly_url'])
          && !empty($page['field_friendly_url']['und'])
          && !empty($page['field_friendly_url']['und'][0])
          && !empty($page['field_friendly_url']['und'][0]['value']) ) {
            return $page['field_friendly_url']['und'][0]['value'];
        }
        if (!empty($page['friendly_url'])) {
            return $page['friendly_url'];
        }
        return null;
    }

    public function loadTwigTemplates()
    {
        $this->prepareDir($this->templateDir);
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(
                $this->templateDir
            )
        );
        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }
            $path = $file->getPathname();
            // echo "LOADING TEMPLATE : $path\n";
            $name = basename($path, '.twig');
            if ('yml' == pathinfo($path, PATHINFO_EXTENSION)) {
                continue;
            }
            try {
                $this->templates[$name] = $this->templateRenderer->load($name.'.twig');
            } catch (\Exception $e) {
                $this->log("Templates: {$name}.twig failed to load :".$e->getMessage()."\n", false);
                $this->templates[$name] = null;
            }
        }

        return true;
    }

    public function getTwigPageRenderer($page)
    {
        if (!empty($this->templates[$page['pageType']])) {
            return $this->templates[$page['pageType']];
        } else {
            return null;
        }
    }

    public function processPageParams(&$page, &$params)
    {
        $params['config'] = $this->ssg->config;

      // changes dependant on page
        $rev = array_reverse($page['for_use_by']);
        $fub = array_pop($rev);

        if (empty($fub) || !array_key_exists($fub, $this->ssg->sitePage)) {
            return [];
        }

        $params['siteName'] = $fub;
        $params['sitePage'] = $this->ssg->sitePage;
        $params['siteUrl'] = $this->ssg->config['siteUrl'];

        $params['entities'] = $this->ssg->source->entities;
        $params['directoryRecordGroups'] = $this->ssg->directoryRecordGroups;
        $params['siteIndexAZ'] = $this->ssg->siteIndexAZ;
        $params['features'] = $this->ssg->features;

        $params['currentAZLetter'] = null;

        if ($page['pageType']=='Features'
        && empty($params['currentPage']) ) {
            $params['currentPage'] = 1;
        } elseif (!isset($params['currentPage'])) {
            $params['currentPage'] = null;
        }

        $params['stateDetails']    = $this->ssg->stateDetails;
        $params['stateAcronyms']   = $this->ssg->stateAcronyms;

        $params['dataLayer'] = $this->getPageDataLayer($page);

        $params = array_merge($params, $page);
    }

    public function getPageDataLayer(&$page)
    {
        /// the main metadata array in special format the USA team wants
        $dataLayer = [
            'pageType' => $page['type_of_page_to_generate'],
        ];

        /// tell about any assets rendered on this page
        $assetIds = [];
        foreach ($page['asset_order_content'] as $contentItem) {
            $assetIds[] = $contentItem['target_id'];
        }
        if (!empty($assetIds)) {
            $dataLayer['assetIDs'] = implode(', ', $assetIds);
        }
        
        /// calculate all ancestors including the top level SiteName term
        $parents = [];
        $parent = $page;
        while ($parent) {
            $parents[] = $parent['name'];
            if (!empty($parent['parent_uuid'])
              && !empty($this->ssg->source->entities[ $parent['parent_uuid'] ]) ) {
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
        if (count($parents)>2 && $parents[1]=='All Topics and Services') {
            unset($parents[1]);
        }

        /// make sure we have at least X levels of Taxonomy, repeating the last entry if necessary
        $maxLevel = 6;
        $p = 0;
        foreach ($parents as $i => $parentName) {
            $p++; /// so we start at 1
            $dataLayer['TaxLevel'.$p] = $parentName;
        }
        for ($p=$p+1; $p<=$maxLevel; $p++) {
            $dataLayer['TaxLevel'.$p] = $parentName;
        }

        return $dataLayer;
    }

}
