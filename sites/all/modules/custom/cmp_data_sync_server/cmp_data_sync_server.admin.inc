<?php

function cmp_data_sync_server_config_form()
{
  $form = array();

  $form['cdss_syncing_enabled'] = array(
    '#type' => 'checkbox',
    '#title' => 'Syncing Enabled',
    '#default_value' => variable_get('cdss_syncing_enabled',false)
  );

  $form['cdss_immediate_sync'] = array(
    '#type' => 'checkbox',
    '#title' => 'Immediate Syncing',
    '#description' => 'queued items are processed in the background after page load completes',
    '#default_value' => variable_get('cdss_syncing_enabled',false)
  );

  $form['cdss_ajax_full_sync'] = array(
    '#type' => 'item',
    '#title' => 'Index schema, nodes and terms to Elasticsearch',
    '#markup' => '
    <script>
      function ajax_full_sync()
      {
        jQuery("#cdss_ajax_full_sync_response").html("LOADING");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/full_sync",
          success:function(data) {
            jQuery("#cdss_ajax_full_sync_response").html("queueing");
          },
          error:function(data) {
            jQuery("#cdss_ajax_full_sync_response").html("failure");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-full_sync">
    <input type="button" onclick="ajax_full_sync();" value="Full Sync" class="form-submit"/>
    <div id="cdss_ajax_full_sync_response" style="display:inline;"></div></div>'
  );

  $form['bundles'] = array(
    '#type' => 'fieldset',
    '#title' => t('Bundles'),
    '#collapsible' => TRUE,
    '#collapsed'   => FALSE,
  );

  $node_bundles = array();
  foreach ( _bundle_copy_bundle_info('node', TRUE) as $bundle_name => $data )
  {
      $node_bundles[$bundle_name] = $bundle_name;
  }
  $form['bundles']['cdss_node_bundles'] = array(
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
  $form['bundles']['cdss_term_bundles'] = array(
      '#type' => 'select',
      '#title' => 'Syncable Taxonomy Vocabularies',
      '#options' => $term_bundles,
      '#size' => max(5,count($term_bundles)),
      '#multiple' => true,
      '#default_value' => variable_get('cdss_term_bundles', array()),
  );

  $form['queue'] = array(
    '#type' => 'fieldset',
    '#title' => t('Queue'),
    '#collapsible' => TRUE,
    '#collapsed'   => FALSE,
  );

  $queue = DrupalQueue::get('cmp_data_sync');
  $queued_item_count = (int)$queue->numberOfItems();
  $form['queue']['cdss_ajax_check_queue_status'] = array(
    '#type' => 'item',
    '#title' => 'Queue Status',
    '#markup' => '
    <script>
      function ajax_check_queue_status()
      {
        jQuery("#cdss_ajax_check_queue_status_response").html("LOADING");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/check_queue_status",
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

  $form['queue']['cdss_ajax_add_all_to_queue'] = array(
    '#type' => 'item',
    '#title' => 'Add All nodes and terms to Queue',
    '#markup' => '
    <script>
      function ajax_add_all_to_queue()
      {
        jQuery("#cdss_ajax_add_all_to_queue_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/add_all_to_queue",
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

  $form['queue']['cdss_ajax_process_queue'] = array(
    '#type' => 'item',
    '#title' => 'Index Queue to Elasticsearch',
    '#markup' => '
    <script>
      function ajax_process_queue()
      {
        jQuery("#cdss_ajax_process_queue_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/process_queue",
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

  $form['elasticsearch'] = array(
    '#type' => 'fieldset',
    '#title' => t('Elasticsearch'),
    '#collapsible' => TRUE,
    '#collapsed'   => FALSE,
  );


  $form['elasticsearch']['cdss_elasticsearch_server'] = array(
      '#type' => 'textfield',
      '#title' => 'Elasticsearch Server',
      '#default_value' => variable_get('cdss_elasticsearch_server', ''),
      '#size' => '75',
      '#description' => 'Include schema and port ex. <i>http://elasticsearch_server:9200</i>'
  );


  $form['elasticsearch']['cdss_ajax_validate_elasticsearch'] = array(
    '#type' => 'item',
    '#title' => 'Validate Elasticsearch',
    '#markup' => '
    <script>
      function ajax_validate_elasticsearch()
      {
        jQuery("#cdss_ajax_validate_elasticsearch_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/validate_elasticsearch",
          success:function(data) {
            console.log(data);
            status  = " server:"+ (data.server?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
            status += " schema-index:"+ (data.schema_index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
            status += " content-index:"+ (data.content_index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
            jQuery("#cdss_ajax_validate_elasticsearch_response").html(status);
          },
          error:function(data) {
            status  = " server:<span style=\"color:orange\">unknown</span>";
            status += " schema-index:<span style=\"color:orange\">unknown</span>";
            status += " content-index:<span style=\"color:orange\">unknown</span>";
            jQuery("#cdss_ajax_validate_elasticsearch_response").html(status);
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-validate-elasticsearch">
    <input type="button" onclick="ajax_validate_elasticsearch();" value="Validate Elasticsearch" class="form-submit"/>
    <div id="cdss_ajax_validate_elasticsearch_response" style="display:inline;"></div></div>'
  );

  $form['elasticsearch']['cdss_ajax_setup_elasticsearch'] = array(
    '#type' => 'item',
    '#title' => 'Setup Elasticsearch',
    '#markup' => '
      <script>
        function ajax_setup_elasticsearch()
        {
          jQuery("#cdss_ajax_setup_elasticsearch_response").html("loading");
          jQuery.ajax({
            url: "/admin/content/cmp-data-sync-server/api/setup_elasticsearch",
            success:function(data) {
              status  = " server:"+ (data.server?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
              status += " schema-index:"+ (data.schema_index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
              status += " content-index:"+ (data.content_index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
              jQuery("#cdss_ajax_setup_elasticsearch_response").html(status);
            },
            error:function(data) {
              status  = " server:<span style=\"color:orange\">unknown</span>";
              status += " schema-index:<span style=\"color:orange\">unknown</span>";
              status += " content-index:<span style=\"color:orange\">unknown</span>";
              jQuery("#cdss_ajax_setup_elasticsearch_response").html(status);
            }
          });
        }
      </script><div class="form-item form-type-button form-item-cdsc-ajax-setup-elasticsearch">
      <input type="button" onclick="ajax_setup_elasticsearch();" value="Setup Elasticsearch" class="form-submit"/>
      <div id="cdss_ajax_setup_elasticsearch_response" style="display:inline;"></div></div>'
  );

  $form['elasticsearch']['cdss_ajax_sync_schema'] = array(
    '#type' => 'item',
    '#title' => 'Send Schema to Elasticsearch',
    '#markup' => '
    <script>
      function ajax_sync_schema()
      {
        jQuery("#cdss_ajax_sync_schema_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/cmp-data-sync-server/api/sync_schema",
          success:function(data) {
            jQuery("#cdss_ajax_sync_schema_response").html(data.sync);
          },
          error:function(data) {
            jQuery("#cdss_ajax_sync_schema_response").html("failure");
          }
        });
      }
    </script><div class="form-item form-type-button form-item-cdsc-ajax-sync-schema">
    <input type="button" onclick="ajax_sync_schema();" value="Sync Schema" class="form-submit"/>
    <div id="cdss_ajax_sync_schema_response" style="display:inline;"></div></div>'
  );

  return system_settings_form($form);
}

function _cdss_ajax_setup_elasticsearch()
{
  if ( _cdss_validate_elasticsearch_server() )
  {
    _cdss_setup_elasticsearch();
  }
  _cdss_ajax_validate_elasticsearch();
}
function _cdss_ajax_validate_elasticsearch()
{
  drupal_json_output([
    'called'=>__FUNCTION__,
    'server'        => _cdss_validate_elasticsearch_server(),
    'schema_index'  => _cdss_validate_elasticsearch_schema_index(),
    'content_index' => _cdss_validate_elasticsearch_content_index()
  ]);
}

function _cdss_ajax_sync_schema()
{
  drupal_json_output([
    'called'=>__FUNCTION__,
    'sync'=>_cdss_send_schema_to_elasticsearch()?"success":"failure"
  ]);
}
function _cdss_ajax_full_sync()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
  _cdss_cancel_immediate_sync();
  _cdss_process_queue();
  exit;
}

function _cdss_ajax_check_queue_status()
{
  $queue = DrupalQueue::get('cmp_data_sync');
  drupal_json_output([
    'called'=>__FUNCTION__,
    'queued_item_count'=>(int)$queue->numberOfItems()
  ]);
}
function _cdss_ajax_process_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_cancel_immediate_sync();
  _cdss_process_queue();
  exit;
}
function _cdss_ajax_add_all_to_queue()
{
  drupal_json_output(['called'=>__FUNCTION__]);
  _cdss_finish_request();
  _cdss_add_all_to_queue();
  _cdss_cancel_immediate_sync();
  exit;
}
