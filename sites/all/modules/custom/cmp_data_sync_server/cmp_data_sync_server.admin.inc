<?php

function cmp_data_sync_server_admin()
{
  $form = array();

  $node_bundles = array();
  foreach ( _bundle_copy_bundle_info('node', TRUE) as $bundle_name => $data )
  {
      $node_bundles[$bundle_name] = $bundle_name;
  }
  $form['cdss_node_bundles'] = array(
      '#type' => 'select',
      '#title' => 'Node Types to sync',
      '#options' => $node_bundles,
      '#size' => max(10,count($node_bundles)),
      '#multiple' => true,
      '#default_value' => variable_get('cdss_node_bundles', ''),
  );

  $term_bundles = array();
  foreach ( _bundle_copy_bundle_info('taxonomy_term', TRUE) as $bundle_name => $data )
  {
      $term_bundles[$bundle_name] = $bundle_name;
  }
  $form['cdss_term_bundles'] = array(
      '#type' => 'select',
      '#title' => 'Taxonomy Vocabularies to sync',
      '#options' => $term_bundles,
      '#size' => max(5,count($term_bundles)),
      '#multiple' => true,
      '#default_value' => variable_get('cdss_term_bundles', ''),
  );

  $form['cdss_elasticsearch_server'] = array(
      '#type' => 'textfield',
      '#title' => 'Elasticsearch Server:',
      '#default_value' => variable_get('cdss_elasticsearch_server', ''),
      '#size' => '75',
      '#description' => 'Include schema and port ex. <i>http://elasticsearch_server:9200</i>'
  );


  return system_settings_form($form);
}
