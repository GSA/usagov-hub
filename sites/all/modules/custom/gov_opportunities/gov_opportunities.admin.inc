<?php

function gov_opportunities_config_form()
{
  $form = array();

  $form['fbofeed'] = array(
    '#type' => 'fieldset',
    '#title' => t('FBO Feeds'),
    '#collapsible' => TRUE,
    '#collapsed'   => FALSE,
  );

  // $daily = new FBOXMLImport();
  // $files = $daily->listFBODailyFiles();
  //   '#options' => $files,
  //   '#default_value' => reset($files)
  $form['fbofeed']['govopp_fbo_daily_feeds'] = array(
    '#type' => 'item',
    '#title' => 'Pull Opportunities from Daily Feed',
    '#markup' => '
    <script>
      function ajax_load_fbo_daily()
      {
        jQuery.ajax({
          url: "/admin/content/gov_opportunities/api/list_daily_fbo_files",
          success:function(data) {
            console.log(data);
            if ( data.success ) {
              // jQuery("#ajax_load_fbo_daily_response").html(data.message);
              if ( data.files ) {
                var s = jQuery("#edit-govopp-fbo-daily-feed");
                for ( file in data.files ) {
                  var o = new Option(file,file);
                  s.append(jQuery(o));
                }
              }
            } else if ( data.message ) {
              jQuery("#ajax_load_fbo_daily_response").html(data.message);
            } else {
              jQuery("#ajax_load_fbo_daily_response").html("failure");
            }
          },
          error:function(data) {
            if ( data.message ) {
              jQuery("#ajax_load_fbo_daily_response").html(data.message);
            } else {
              jQuery("#ajax_load_fbo_daily_response").html("error");
            }
          }
        });
      }
    </script><div class="form-item form-type-button form-item-ajax-fbo-daily-feed">
      <input type="button" onclick="ajax_load_fbo_daily();" value="Show Daily Feeds" class="form-submit"/><br />
      <select id="edit-govopp-fbo-daily-feed" name="govopp_fbo_daily_feed" class="form-select"></select>
      <div id="ajax_load_fbo_daily_response" style="display:inline;"></div>
    </div>
    '
  );
  $form['fbofeed']['govopp_ajax_pull_fbo_daily'] = array(
    '#type' => 'item',
    '#markup' => '
    <script>
      function ajax_pull_fbo_daily()
      {
        var feedFile = jQuery("#edit-govopp-fbo-daily-feed").val();
        jQuery("#ajax_pull_fbo_daily_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/gov_opportunities/api/pull_fbo_daily/"+feedFile,
          success:function(data) {
            if ( data.success ) {
              jQuery("#ajax_pull_fbo_daily_response").html(data.message);
            } else if ( data.message ) {
              jQuery("#ajax_pull_fbo_daily_response").html(data.message);
            } else {
              jQuery("#ajax_pull_fbo_daily_response").html("failure");
            }
          },
          error:function(data) {
            if ( data.message ) {
              jQuery("#ajax_pull_fbo_daily_response").html(data.message);
            } else {
              jQuery("#ajax_pull_fbo_daily_response").html("error");
            }
          }
        });
      }
    </script><div class="form-item form-type-button form-item-ajax-pull-fbo-daily">
    <input type="button" onclick="ajax_pull_fbo_daily();" value="Import FBO Daily Feed" class="form-submit"/>
    <div id="ajax_pull_fbo_daily_response" style="display:inline;"></div></div>'
  );

  $form['fbofeed']['govopp_ajax_pull_fbo_full'] = array(
    '#type' => 'item',
    '#title' => 'Pull Opportunities from Full Feed',
    '#markup' => '
    <script>
      function ajax_pull_fbo_full()
      {
        jQuery("#ajax_pull_fbo_full_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/gov_opportunities/api/pull_fbo_full",
          success:function(data) {
            if ( data.success ) {
              jQuery("#ajax_pull_fbo_full_response").html(data.message);
            } else if ( data.message ) {
              jQuery("#ajax_pull_fbo_full_response").html(data.message);
            } else {
              jQuery("#ajax_pull_fbo_full_response").html("failure");
            }
          },
          error:function(data) {
            if ( data.message ) {
              jQuery("#ajax_pull_fbo_full_response").html(data.message);
            } else {
              jQuery("#ajax_pull_fbo_full_response").html("error");
            }
          }
        });
      }
    </script><div class="form-item form-type-button form-item-ajax-pull-fbo-full">
    <input type="button" onclick="ajax_pull_fbo_full();" value="Import FBO Full Feed" class="form-submit"/>
    <div id="ajax_pull_fbo_full_response" style="display:inline;"></div></div>'
  );
  $form['fbofeed']['govopp_ajax_remove_closed'] = array(
    '#type' => 'item',
    '#title' => 'Remove Closed Opportunities ( before today )',
    '#markup' => '
    <script>
      function ajax_remove_closed()
      {
        jQuery("#ajax_remove_closed_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/gov_opportunities/api/remove_closed",
          success:function(data) {
            if ( data.success ) {
              jQuery("#ajax_remove_closed_response").html(data.message);
            } else if ( data.message ) {
              jQuery("#ajax_remove_closed_response").html(data.message);
            } else {
              jQuery("#ajax_remove_closed_response").html("failure");
            }
          },
          error:function(data) {
            if ( data.message ) {
              jQuery("#ajax_remove_closed_response").html(data.message);
            } else {
              jQuery("#ajax_remove_closed_response").html("error");
            }
          }
        });
      }
    </script><div class="form-item form-type-button form-item-ajax-remove-closed">
    <input type="button" onclick="ajax_remove_closed();" value="Remove Closed Opportunities" class="form-submit"/>
    <div id="ajax_remove_closed_response" style="display:inline;"></div></div>'
  );

  $form['elasticsearch'] = array(
    '#type' => 'fieldset',
    '#title' => t('Elasticsearch'),
    '#collapsible' => TRUE,
    '#collapsed'   => FALSE,
  );
  $form['elasticsearch']['govopp_elasticsearch_server'] = array(
      '#type' => 'textfield',
      '#title' => 'Elasticsearch Server',
      # '#default_value' => 'http://'.variable_get('elasticsearch_server','elasticsearch_server').':'.variable_get('elasticsearch_port',9200),
      '#default_value' => variable_get('govopp_elasticsearch_server'),
      '#size' => '75',
      '#description' => 'Include schema and port ex. <i>http://elasticsearch_server:9200</i>',
      //'#attributes' => array('readonly' => 'readonly')
    );
  $form['elasticsearch']['govopp_ajax_validate_elasticsearch'] = array(
    '#type' => 'item',
    '#title' => 'Validate Elasticsearch',
    '#markup' => '
    <script>
      function ajax_validate_elasticsearch()
      {
        jQuery("#ajax_validate_elasticsearch_response").html("loading");
        jQuery.ajax({
          url: "/admin/content/gov_opportunities/api/validate_elasticsearch",
          success:function(data) {
            status  = " server:"+ (data.server?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
            status += " index:"+ (data.index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
            jQuery("#ajax_validate_elasticsearch_response").html(status);
          },
          error:function(data) {
            status  = " server:<span style=\"color:orange\">unknown</span>";
            status += " index:<span style=\"color:orange\">unknown</span>";
            jQuery("#ajax_validate_elasticsearch_response").html(status);
          }
        });
      }
    </script><div class="form-item form-type-button form-item-ajax-validate-elasticsearch">
    <input type="button" onclick="ajax_validate_elasticsearch();" value="Validate Elasticsearch" class="form-submit"/>
    <div id="ajax_validate_elasticsearch_response" style="display:inline;"></div></div>'
  );
  $form['elasticsearch']['govopp_ajax_setup_elasticsearch'] = array(
    '#type' => 'item',
    '#title' => 'Setup Elasticsearch',
    '#markup' => '
      <script>
        function ajax_setup_elasticsearch()
        {
          jQuery("#ajax_setup_elasticsearch_response").html("loading");
          jQuery.ajax({
            url: "/admin/content/gov_opportunities/api/setup_elasticsearch",
            success:function(data) {
              status  = " server:"+ (data.server?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
              status += " index:"+ (data.index?"<span style=\"color:green\">good</span>":"<span style=\"color:red\">bad</span>");
              jQuery("#ajax_setup_elasticsearch_response").html(status);
            },
            error:function(data) {
              status  = " server:<span style=\"color:orange\">unknown</span>";
              status += " index:<span style=\"color:orange\">unknown</span>";
              jQuery("#ajax_setup_elasticsearch_response").html(status);
            }
          });
        }
      </script><div class="form-item form-type-button form-item-ajax-setup-elasticsearch">
      <input type="button" onclick="ajax_setup_elasticsearch();" value="Setup Elasticsearch" class="form-submit"/>
      <div id="ajax_setup_elasticsearch_response" style="display:inline;"></div></div>'
  );

  return system_settings_form($form);
}
