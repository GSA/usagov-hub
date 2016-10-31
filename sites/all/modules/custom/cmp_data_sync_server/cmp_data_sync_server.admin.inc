<?php

function cmp_data_sync_server_config_form()
{
  $form = array();

  $form['cdss_syncing_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => 'Syncing Enabled',
    '#default_value' => variable_get('cdss_syncing_enabled',false)
  );

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

  $queue = DrupalQueue::get('cmp_data_sync');
  $queued_item_count = (int)$queue->numberOfItems();
  $form['cdss_ajax_check_queue_status'] = array(
    '#type' => 'item',
    '#title' => 'Queue Status',
    '#markup' => '
    <script>
      function ajax_check_queue_status()
      {
        jQuery("#cdss_ajax_check_queue_status_response").html("LOADING");
        jQuery.ajax({
          url: "/admin/config/cmp-data-sync-server/check_queue_status",
          success:function(data) {
            jQuery("#cdss_ajax_check_queue_status_response").html("Items:"+data.queued_item_count);
          },
          error:function(data) {
            jQuery("#cdss_ajax_check_queue_status_response").html("ajax failure");
          }
        });
      }
    </script>
    <div class="form-item form-type-button form-item-cdsc-ajax-check-queue-status">
    <input type="button" onclick="ajax_check_queue_status();" value="Check Queue Status" class="form-submit"/>
    <div id="cdss_ajax_check_queue_status_response" style="display:inline;">Items:'.$queued_item_count.'</div></div>'
  );

  $form['cdss_ajax_add_all_to_queue'] = array(
    '#type' => 'item',
    '#title' => 'Add All nodes and terms to Queue',
    '#markup' => '
    <script>
      function ajax_add_all_to_queue()
      {
        jQuery("#cdss_ajax_add_all_to_queue_response").html("LOADING");
        jQuery.ajax({
          url: "/admin/config/cmp-data-sync-server/add_all_to_queue",
          success:function(data) {
            jQuery("#cdss_ajax_add_all_to_queue_response").html("queueing");
          },
          error:function(data) {
            jQuery("#cdss_ajax_add_all_to_queue_response").html("failure");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-add-all-to-queue">
    <input type="button" onclick="ajax_add_all_to_queue();" value="Add All to Queue" class="form-submit"/>
    <div id="cdss_ajax_add_all_to_queue_response" style="display:inline;"></div></div>'
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
            jQuery("#cdss_ajax_process_queue_response").html("processing");
          },
          error:function(data) {
            jQuery("#cdss_ajax_process_queue_response").html("failure");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-process-queue">
    <input type="button" onclick="ajax_process_queue();" value="Process Queue" class="form-submit"/>
    <div id="cdss_ajax_process_queue_response" style="display:inline;"></div></div>'
  );

  return system_settings_form($form);
}

function _cdss_ajax_check_queue_status()
{
  $queue = DrupalQueue::get('cmp_data_sync');
  $queued_item_count = (int)$queue->numberOfItems();
  drupal_json_output(['called'=>__FUNCTION__,'queued_item_count'=>$queued_item_count]);
}

function _cdss_ajax_process_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_process_queue();
  exit;
}

function _cdss_ajax_add_all_to_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
  exit;
}

function _cdss_ajax_full_sync()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
  _cdss_process_queue();
  exit;
}

function _cdss_finish_request()
{
  ignore_user_abort(1);
  while(@ob_get_level() > 0) { @ob_end_flush(); }
  @ob_flush();
  @flush();
  if (session_id()) session_write_close();
  fastcgi_finish_request();
  set_time_limit(600);
  ini_set('max_execution_time',600);
}
