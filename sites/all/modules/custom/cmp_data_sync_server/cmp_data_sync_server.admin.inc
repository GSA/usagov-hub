<?php

function cmp_data_sync_server_config_form()
{
  $form = array();

  $node_bundles = array();
  foreach ( _bundle_copy_bundle_info('node', TRUE) as $bundle_name => $data )
  {
      $node_bundles[$bundle_name] = $bundle_name;
  }
  $form['cdss_node_bundles'] = array(
      '#type' => 'select',
      '#title' => 'Syncable Node Types',
      '#options' => $node_bundles,
      '#size' => max(10,count($node_bundles)),
      '#multiple' => true,
      '#default_value' => variable_get('cdss_node_bundles', array()),
  );

  $term_bundles = array();
  foreach ( _bundle_copy_bundle_info('taxonomy_term', TRUE) as $bundle_name => $data )
  {
      $term_bundles[$bundle_name] = $bundle_name;
  }
  $form['cdss_term_bundles'] = array(
      '#type' => 'select',
      '#title' => 'Syncable Taxonomy Vocabularies',
      '#options' => $term_bundles,
      '#size' => max(5,count($term_bundles)),
      '#multiple' => true,
      '#default_value' => variable_get('cdss_term_bundles', array()),
  );

  $form['cdss_elasticsearch_server'] = array(
      '#type' => 'textfield',
      '#title' => 'Elasticsearch Server',
      '#default_value' => variable_get('cdss_elasticsearch_server', ''),
      '#size' => '75',
      '#description' => 'Include schema and port ex. <i>http://elasticsearch_server:9200</i>'
  );

  /// these belong in seperate tab

  $queue = $queue = DrupalQueue::get('cmp_data_sync');
  $queued_item_count = $queue->numberOfItems();
  /// should link to admin/config/system/queue-ui
  /// should ajax update the count
  $form['cdss_queue_status'] = array(
      '#type' => 'item',
      '#title' => 'Items remaining in queue',
      '#markup' => $queued_item_count
  );

  // $form['cdss_index_all_nodes'] = array(
  //     '#type'   => 'submit',
  //     '#value'  => 'Index Content',
  //     '#prefix' => '<div class="form-item form-type-button form-item-cdsc-index-all-nodes">',
  //     '#suffix' => '</div>',
  //     '#description' => 'Send all node content to elasticsearch'
  // );
  //
  // $form['cdss_index_all_terms'] = array(
  //     '#type'   => 'submit',
  //     '#value'  => 'Index Taxonomies',
  //     '#prefix' => '<div class="form-item form-type-button form-item-cdsc-index-all-terms">',
  //     '#suffix' => '</div>',
  //     '#description' => 'Send all taxnomy terms to elasticsearch'
  // );
  //
  // $form['actions']['cdss_index_everything'] = array(
  //     '#type'   => 'submit',
  //     '#value'  => 'Index Everything',
  //     '#prefix' => '<div class="form-item form-type-button form-item-cdsc-index-everything">',
  //     '#suffix' => '<div id="cdss-index-everything-ajax-response"></div></div>',
  //     '#description' => 'Send all nodes and taxnomy terms to elasticsearch',
  //     '#submit' => array('_cdss_other_callback')
  // );

  return system_settings_form($form);
}

// function _cdss_finish_request($message="")
// {
//     if ( function_exists('fastcgi_finish_request') )
//     {
//         if ( !empty($message) ) { drupal_set_message($message, 'warning'); }
//         $url = url(current_path(), array('query'=>drupal_get_query_parameters(),'absolute'=>TRUE, 'external'=>FALSE));
//         drupal_goto($url);
//         session_write_close();
//         while ( @ob_get_length() ) { @ob_end_clean(); }
//         flush();
//         fastcgi_finish_request();
//         set_time_limit(0);
//         ini_set('max_execution_time',0);
//     }
// }
