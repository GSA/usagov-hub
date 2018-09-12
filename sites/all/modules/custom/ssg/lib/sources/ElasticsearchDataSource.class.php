<?php

namespace ctac\ssg;

class ElasticsearchDataSource extends DataSource
{
  public function getEntities($since=0)
  {
      /// fetch from elasticsearch
      $elasticsearchBatchSize = ( !empty($this->ssg->config['elasticsearch']['batchSize']) ) ? $this->ssg->config['elasticsearch']['batchSize'] : 1;
      $elasticsearchServer    = ( !empty($this->ssg->config['elasticsearch']['server']) )    ? $this->ssg->config['elasticsearch']['server']    : 'http://localhost:9201';
      $elasticsearchIndex     = ( !empty($this->ssg->config['elasticsearch']['index']) )     ? $this->ssg->config['elasticsearch']['index']     : 'cmp-data-entities';

      #$siteName = $this->siteName;
      $siteName = ( !empty($this->ssg->config['elasticsearch']['siteName']) ) ? $this->ssg->config['elasticsearch']['siteName'] : 'USA.gov';
      $siteName = preg_replace("/[^\w\_\.\-]/","",$siteName);
      $siteName = json_encode($siteName);

      $esBatchSize = 100;

      $scrollId    = null;
      $sanity      = 100000;
      $resultsData = [];

      while ( $sanity-- )
      {
          try
          {
              if ( $scrollId===null )
              {
                  $_search = '';
                  $_must   = '';
                  $_should = '';
                  $since = intval($since);

                  if ( !empty($since) )
                  {
                      $_must = '{"range":{"changed":{"gte":'.$since.'}}}';
                  }

                  $_should = ['{"term":{"deleted":"1"}}'];
                  if ( !empty($siteName) )
                  {
                      $_should[] = '{"term":{"field_for_use_by.und.value":'.$siteName.'}}';
                      if ( in_array($siteName,['"USA.gov"','"GobiernoUSA.gov"']) )
                      {
                          $_should[] = '{"term":{"type":"directory_record_content_type"}}';
                      }
                  }

                  $_should[] ='{"bool": {"must_not": {"exists": {"field": "field_for_use_by"}}}}';

                  $_search = '{"query": {';

                  if ($_must !='' && $_should !='') {

                      $_search .= '"bool" : { "must" :';
                      $_search .= '['.$_must.', { "bool" : {"should":[' . join(',', $_should) . ']}}'.']';
                      $_search .= '}';
                  }
                  else { // should only
                      $_search .= '"constant_score" : {';
                      $_search .= '"filter" : { "bool" : {"should":[' . join(',', $_should) . ']}}';
                      $_search .= '}';
                  }
                  $_search .= '}}';

                  //$this->ssg->log("$elasticsearchServer/$elasticsearchIndex/_search?scroll=1m body=search-for-stuff'\n");
        					$client   = new \GuzzleHttp\Client(['base_uri' => $elasticsearchServer, 'verify' => false]);
        					$response = $client->post( $elasticsearchIndex.'/_search', ['query'=>['scroll'=>'1m'], 'body'=>$_search] );
        					$body     = $response->getBody();
        					if ( empty($body) )
        					{
        					    $this->ssg->log("continue: no body ($sanity)\n");
        						  continue;
        					}
        					$resultsData = json_decode($body->getContents(),true);
        					if ( $response->getStatusCode()!==200 || empty($resultsData['_scroll_id']) )
        					{
        						  /// we should have gotten a base64 encoded string
      					      $this->ssg->log("return: no scroll id ($sanity)\n");
        						  break;
        					}
                  $scrollId = $resultsData['_scroll_id'];
              } else {
                  //$this->ssg->log("$elasticsearchServer/_search/scroll?scroll=1m body=$scrollId'\n");
        					$client   = new \GuzzleHttp\Client(['base_uri' => $elasticsearchServer, 'verify' => false]);
        					$response = $client->post( '/_search/scroll', ['query'=>['scroll'=>'1m','scroll_id'=>$scrollId], 'body'=>$scrollId] );
        					$body     = $response->getBody();
        					if ( empty($body) )
        					{
        						  $this->ssg->log("continue: no body ($sanity)\n");
        						  continue;
        					}
        					$resultsData = json_decode($body->getContents(),true);
        					if ( $response->getStatusCode()!==200 || empty($resultsData['_scroll_id']) || $scrollId!==$resultsData['_scroll_id'] )
        					{
        						  /// something messed up - we should always get same one back
        					    $this->ssg->log("return: no scroll id ($sanity)\n");
        						  break;
        					}
              }

      				if ( !isset($resultsData['hits']) || !isset($resultsData['hits']['hits']) )
      				{
      					  //$this->ssg->log("continue: no hits ($sanity)\n");
      					  continue;
      				}

      				if ( empty($resultsData['hits']['hits']) )
      				{
      					  /// no more results in this scroll
      					  //$this->ssg->log("return: no hits ($sanity)\n");
      					  break;
      				}

          } catch (Exception $e) {

    				  if ( $scrollId===null )
    			  	{
    					    /// if we died trying to get scroll_id, we can't recover
        					$this->ssg->log("return: no scorll id ($sanity)\n");
        					break;
    				  } else {
        					/// if we died trying to json_decode this item, we can skip and move on
        					$this->ssg->log("continue: exception ".$e->getMessage()." ($sanity)\n");
        					continue;
    				  }
    			}
          foreach( $resultsData['hits']['hits'] as $result )
          {
              try
              {
                  $entity = $this->cleanResult($result['_source']);
                  $this->entities[$result['_id']] = $entity;
                  $this->entities[$result['_id']]['pageType'] = $this->ssg->getPageType($entity);
                  if ( !empty($result['_source']['tid']) )
                  {
                      $this->entitiesById['tid'][$result['_source']['tid']] =& $this->entities[$result['_id']];
                  }
                  if ( !empty($result['_source']['nid']) )
                  {
                      $this->entitiesById['nid'][$result['_source']['nid']] =& $this->entities[$result['_id']];
                  }
              } catch (Exception $e) {
                  continue;
              }
          }
      }
    }

    function cleanResult( $_source )
    {
      $renamed_keys = [
        'emergency_management_agenc' => 'emergency_management_agency',
        'international_drivers_lice' => 'international_drivers_liscense'
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
        'synonym'
      ];
      /// if directory_record - give friendly url base off alpha_order_name
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
        // ignore some fields
        if ( in_array($key,$renamed_keys) )
        {
          $renamed_key = $renamed_keys[$key];
          $_source[ $renamed_key ] = $_source[$key];
          unset($_source[$key]);
          continue;
        }
        if ( $key == 'value' && count($_source) == 1 )
        {
          $_source = $_source['value'];
          return $_source;
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
      }
      return $_source;
    }

    function attachEntityReferences()
    {
      $tt = [];
      foreach ($this->entities as $e=>&$entity )
      {
        $this->attachEntityReference($entity);
        // if ( array_key_exists('type',$entity) )
        // {
        //   $type = $entity['type'];
        //   if ( $type == 'taxonomy_term' && !empty($entity['vocabulary_machine_name']) ) { 
        //     $type .= '.'.strtolower($entity['vocabulary_machine_name']);
        //   }
        //   if ( $type == 'multimedia_content_type' && !empty($entity['media_type']) ) {
        //     $type .= '.'.strtolower($entity['media_type']);
        //   }
        //   if ( empty($tt[$type]) )
        //   {
        //     $tt[$type] = true;
        //     file_put_contents( './examples/'.$type.'.example.js', 'var '.$type .' = '. json_encode($entity,JSON_PRETTY_PRINT) );
        //   }
        // }
      }
    }

    function attachEntityReference( &$item )
    {
      if ( !is_array($item) )
      {
        return;
      }
      if ( !array_key_exists('entity',$item)
        && array_key_exists('uuid',$item)
        && array_key_exists($item['uuid'],$this->entities) 
        && $item !== $this->entities[$item['uuid']] )
      {
        $item['entity'] = $this->entities[$item['uuid']];
      }
      foreach ( array_keys($item) as $k )
      {
        if ( $k != 'entity' )
        {
          $this->attachEntityReference($item[$k]);
        }
      }
    }
}
