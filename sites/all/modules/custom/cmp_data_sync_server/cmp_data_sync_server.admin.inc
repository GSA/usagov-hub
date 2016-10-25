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

  $form['cdss_ajax_add_all_to_queue'] = array(
    '#type' => 'item',
    '#title' => 'Add All nodes and terms to Queue',
    '#markup' => '
    <script>
      function ajax_add_all_to_queue()
      {
        jQuery.ajax({
          url: "/admin/config/cmp-data-sync-server/add_all_to_queue",
          success:function(data) {
            jQuery("#cdss_ajax_add_all_to_queue_response").html("SUCCESS");
          },
          error:function(data) {
            jQuery("#cdss_ajax_add_all_to_queue_response").html("FAILURE");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-add-all-to-queue">
    <input type="button" onclick="ajax_add_all_to_queue();" value="Add All to Queue" class="form-submit"/></div>
    <div id="cdss_ajax_add_all_to_queue_response"></div>'
  );

  $form['cdss_ajax_process_queue'] = array(
    '#type' => 'item',
    '#title' => 'Index Everything Ajax',
    '#markup' => '
    <script>
      function ajax_process_queue()
      {
        jQuery.ajax({
          url: "/admin/config/cmp-data-sync-server/process_queue",
          success:function(data) {
            jQuery("#cdss_ajax_process_queue_response").html("SUCCESS");
          },
          error:function(data) {
            jQuery("#cdss_ajax_process_queue_response").html("FAILURE");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-process-queue">
    <input type="button" onclick="ajax_process_queue();" value="Process Queue" class="form-submit"/></div>
    <div id="cdss_ajax_process_queue_response"></div>'
  );

  return system_settings_form($form);
}
function _cdss_ajax_process_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_process_queue();
}

function _cdss_ajax_add_all_to_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
}

function _cdss_ajax_full_sync()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
  _cdss_process_queue();
}

function _cdss_finish_request()
{
  ignore_user_abort(1);
  //ob_start();
  //$contentLength = ob_get_length();
  //header("Content-Length: $contentLength");
  //header('Connection: close');
  while(@ob_get_level() > 0) { @ob_end_flush(); }
  @ob_flush();
  @flush();
  if (session_id()) session_write_close();
  fastcgi_finish_request();
  set_time_limit(360);
  ini_set('max_execution_time',360);
}
