<?php

namespace ctac\ssg;

class DrupalAPIDataSource extends DataSource
{

  public function getEntities( $since=0 )
  {
    $tunit=['sec','min','hour'];

    /// fetch from drupal api
    $batchSize = ( !empty($this->ssg->config['drupalAPI']['batchSize']) )
                    ? $this->ssg->config['drupalAPI']['batchSize'] : 100;

    $server    = ( !empty($this->ssg->config['drupalAPI']['server']) )
                    ? $this->ssg->config['drupalAPI']['server'] : 'https://usa-cmp-stg.gsa.ctacdev.com';

    $url       = ( !empty($this->ssg->config['drupalAPI']['entitiesUrl']) )
                    ? $this->ssg->config['drupalAPI']['entitiesUrl'] : '/usaapi/entities';

    $siteName = $this->ssg->siteName;
    $siteName = preg_replace("/[^\w\_\.\-]/","",$siteName);

    $sanity      = 20000;
    $resultsData = [];

    $currentPage    = 0;
    $totalPages     = 0;
    $totalCount     = 0;
    $processedCount = 0;
    $acceptedCount  = 0;

    $this->dataPullTime = time();
    while ( $sanity-- )
    {
      $loadStartTime = microtime(true);
      try
      {

        $client   = new \GuzzleHttp\Client(['base_uri' => $server, 'verify' => false]);
        $query = [
          'page_size'=>$batchSize,
          'page'=>$currentPage
        ];
        if ( !empty(intval($since)) ) {
          $this->ssg->log("\nLOADING since(".date('Y/m/d H:i:s',$since).")\n");
          $query['since'] = intval($since);
        }

        $this->ssg->log("\nLOADING batch($currentPage/$totalPages) ");
        $response = $client->post( $url, [ 'form_params'=> $query ] );
        $body = $response->getBody();
        if ( empty($body) )
        {
          continue;
        }
        $responseData = json_decode($body->getContents(),true);
        if ( $response->getStatusCode()!==200 )
        {
          break;
        }
      } catch (Exception $e) {
      }
      $loadEndTime = microtime(true);
      $loadTime = round($loadEndTime - $loadStartTime,4);
      $loadTime = ( $loadTime >= 1 ) ? @round($loadTime/pow(60,   ($i=floor(log($loadTime, 60)))),   2).' '.$tunit[$i] : "$loadTime sec";
      if ( $totalPages == null && $currentPage == 0
          && array_key_exists('metadata',$responseData) )
      {
        if ( array_key_exists('pages',$responseData['metadata']) ) 
        {
          $totalPages = $responseData['metadata']['pages'];
        } 
        if ( array_key_exists('count',$responseData['metadata']) ) 
        {
          $totalCount = $responseData['metadata']['count'];
        }
      }

      if ( !array_key_exists('result',$responseData) )
      {
        $this->ssg->log("\nDONE batch($currentPage/$totalPages) no results in response entities($acceptedCount/$processedCount/$totalCount)\n");
        break;
      }
      if ( count($responseData['result']) == 0 )
      {
        $this->ssg->log("\nDONE batch($currentPage/$totalPages) count(". count($responseData['result']) .") entities($acceptedCount/$processedCount/$totalCount)\n");
        break;
      }

      $this->ssg->log(" ... load($loadTime) results(". count($responseData['result']) .")");

      
      $processStartTime = microtime(true);
      foreach( $responseData['result'] as $result )
      {
        try
        {
          $processedCount++;    

          if ( array_key_exists('deleted',$result) && intval($result['deleted'])==1 )
          {
            if ( isset( $this->entities[$result['uuid']] ) )
            {
              unset($this->entities[$result['uuid']]);
            }
          }

          $entity = $this->cleanResult($result);
          if ( !$this->belongsToSite($siteName,$entity) )
          {
            continue;
          }

          $this->entities[$result['uuid']] = $entity;
          $this->entities[$result['uuid']]['pageType'] = $this->ssg->getPageType($entity);
          if ( !empty($result['tid']) )
          {
              $this->entitiesById['tid'][$result['tid']] =& $this->entities[$result['uuid']];
          }
          if ( !empty($result['nid']) )
          {
              $this->entitiesById['nid'][$result['nid']] =& $this->entities[$result['uuid']];
          }
          $acceptedCount++;
        } catch (Exception $e) {
            continue;
        }
      }
      $processEndTime = microtime(true);
      $processTime = round($processEndTime - $processStartTime,4);
      $processTime = ( $processTime >= 1 ) ? @round($processTime/pow(60,   ($i=floor(log($processTime, 60)))),   2).' '.$tunit[$i] : "$processTime sec";

      $this->ssg->log(" ... entities($acceptedCount/$processedCount/$totalCount) process($processTime)");
      
      $currentPage++;
      if ( $totalPages !== null && $currentPage >= $totalPages )
      {
        $this->ssg->log("\nDONE batch($currentPage/$totalPages) last page  entities($acceptedCount/$processedCount/$totalCount)\n");
        break;
      }

    }
    return ( !empty($since) || ($processedCount > 0) );
  }

  public function cleanResult( $_source )
  {
    $renamed_keys = [
      'emergency_management_agenc' => 'emergency_management_agency',
      'international_drivers_lice' => 'international_drivers_liscense',
      'for_use_by_text' => 'for_use_by'
    ];
    $removed_keys = [
      '_drafty_revision_requested',
      'promote',
      'comment',
      'data',
      'rdf_mapping',
      'workflow_notification_emai'
    ];
    /// un-drupalify the data
    $always_array = [
      'also_include_on_nav_page',
      'asset_topic_taxonomy',
      'home_howdoi_assets',
      'home_whats_new_asset',
      'asset_order_carousel',
      'asset_order_content',
      'asset_order_sidebar',
      'asset_order_bottom',
      'children',
      'synonym',
      'for_use_by',
      'child_records_en'
    ];
    /// if directory_record - give friendly url base off alpha_order_name
    /// if feature = give friendly url base off title
    if ( !is_array($_source) ) {
      return $_source;
    }
    foreach ( array_keys($_source) as $oldKey )
    {
      /// strip off 'field_' from all keys
      $key = preg_replace('/^field_/','',$oldKey);
      if ( $key !== $oldKey )
      {
        $_source[$key] = $_source[$oldKey];
        unset($_source[$oldKey]);
      }
      // ignore some fields
      if ( in_array($key,$removed_keys) )
      {
        unset($_source[$key]);
        continue;
      }
      /// get rid of intermediate 'value'
      if ( $key == 'value' && count($_source) == 1 )
      {
        $_source = $_source['value'];
        //return $_source;
        continue;
      }
      /// standardize EMPTY fields
      if ( empty($_source[$key]) )
      {
        $_source[$key] = in_array($key,$always_array) ? [] : null;
        continue;
      }
      /// remove UND
      if ( is_array($_source[$key])
        && isset($_source[$key]['und']) )
      {
        $_source[$key] = $_source[$key]['und'];
      }
      /// remove UND 0
      if ( is_array($_source[$key])
        && count(array_keys($_source[$key])) == 1 )
      {
        if ( !in_array($key,$always_array) ) {
          $_source[$key] = array_pop($_source[$key]);
        }
      }
      /// remove safe_value
      if ( is_array($_source[$key])
        && array_key_exists('value',$_source[$key])
        && array_key_exists('format',$_source[$key])
        && array_key_exists('safe_value',$_source[$key]) )
      {
        $_source[$key] = $_source[$key]['value'];
      }
      /// remove value
      if ( is_array($_source[$key])
        && array_key_exists('value',$_source[$key])
        && count(array_keys($_source[$key])) == 1 )
      {
        $_source[$key] = $_source[$key]['value'];
      }
      if ( is_array($_source[$key]) )
      {
        foreach ( array_keys($_source[$key]) as $k )
        {
          $_source[$key][$k] = $this->cleanResult($_source[$key][$k]);
        }
      }
      if ( !is_array($_source[$key]) && in_array($key,$always_array) )
      {
        $_source[$key] = [$_source[$key]];
      }
      // rename some fields
      if ( array_key_exists($key,$renamed_keys) )
      {
        $renamed_key = $renamed_keys[$key];
        $_source[ $renamed_key ] = $_source[$key];
        unset($_source[$key]);
        continue;
      }
    }
    return $_source;
  }

  public function belongsToSite( $siteName, $entity )
  {
    if ( !array_key_exists('for_use_by',$entity) )
    {
      return true;
    }
    if ( array_key_exists('status',$entity) && intval($entity['status'])!=1 )
    {
      return false;
    }
    if ( array_key_exists('deleted',$entity) && intval($entity['deleted'])==1 )
    {
      return false;
    }
    if ( array_key_exists('vocabulary_machine_name',$entity)
          && !empty($entity['for_use_by']) )
    {
      $belongsToSite = false;
      foreach ( $entity['for_use_by'] as $forUseBy )
      {
        if ( strtolower(preg_replace("/[^\w\_\.\-]/","",$forUseBy)) == strtolower($siteName) )
        {
          $belongsToSite = true;
        }
      }
      return $belongsToSite;
    }

    return true;
  }

  public function getRedirects()
  {
    // if ( $this->useLocalRedirects && file_exists(dirname(__FILE__).'/redirects.php') )
    // {
    //   include dirname(__FILE__).'/redirects.php';
    //   if ( !empty($redirects) ) 
    //   {
    //     $this->redirects = $redirects;
    //     return true;
    //   }
    // }
    /// fetch from drupal api
    $server    = ( !empty($this->ssg->config['drupalAPI']['server']) ) ? 
                    $this->ssg->config['drupalAPI']['server'] : 'https://usa-cmp-stg.gsa.ctacdev.com';

    $url       = ( !empty($this->ssg->config['drupalAPI']['redirectsUrl']) ) ? 
                    $this->ssg->config['drupalAPI']['redirectsUrl'] : '/usaapi/redirects';

    $siteName = $this->ssg->siteName;
    $siteName = preg_replace("/[^\w\_\.\-]/","",$siteName);

    $this->redirects = [];

    $client   = new \GuzzleHttp\Client(['base_uri' => $server, 'verify' => false]);
    $response = $client->post( $url );
    $body = $response->getBody();
    if ( empty($body) )
    {
      $this->ssg->log("No {$this->ssg->siteName} Redirects");
      return false;
    }
    $responseData = json_decode($body->getContents(),true);
    if ( $response->getStatusCode()!==200 )
    {
      $this->ssg->log("Error retrieving {$this->ssg->siteName} Redirects");
      return false;
    }

    foreach( $responseData['result'] as $result )
    {
      $this->redirects[$result['rid']] = $result;
    }
    return true;
  }

}
