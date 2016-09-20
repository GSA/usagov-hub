<?php

function usa_data_migration_config_form() {

	// Handel form submission here
	if ( !empty($_REQUEST['op']) ) {
        switch ($_REQUEST['op']) {
            case 'Save':

                if ( empty($_REQUEST['udm_allow_pull']) ) { $_REQUEST['udm_allow_pull'] = 0; }
                if ( empty($_REQUEST['udm_do_pull']) ) { $_REQUEST['udm_do_pull'] = 0; }
                if ( empty($_REQUEST['udm_do_push']) ) { $_REQUEST['udm_do_push'] = 0; }
                if ( empty($_REQUEST['udm_serv_taxonomy']) ) { $_REQUEST['udm_serv_taxonomy'] = 0; }
                if ( empty($_REQUEST['udm_serv_nodes']) ) { $_REQUEST['udm_serv_nodes'] = 0; }
                if ( empty($_REQUEST['udm_tax_dofilter']) ) { $_REQUEST['udm_tax_dofilter'] = 0; }
                if ( empty($_REQUEST['udm_tax_del']) ) { $_REQUEST['udm_tax_del'] = 0; }
                if ( empty($_REQUEST['udm_friendly_alias']) ) { $_REQUEST['udm_friendly_alias'] = 0; }
                if ( empty($_REQUEST['udm_filemedia_s3translate']) ) { $_REQUEST['udm_filemedia_s3translate'] = 0; }
                if ( empty($_REQUEST['udm_tax_delbyfield']) ) { $_REQUEST['udm_tax_delbyfield'] = 0; }
                if ( empty($_REQUEST['udm_do_localpush']) ) { $_REQUEST['udm_do_localpush'] = 0; }
                if ( empty($_REQUEST['udm_do_pushoncron']) ) { $_REQUEST['udm_do_pushoncron'] = 0; }
                if ( empty($_REQUEST['data_abbr'])) {$_REQUEST['data_abbr'] = "Apt.|Apartment\nAve.|Avenue\nBldg.|Building\nBlvd.|Boulevard\nCir.|Circle\nCt.|Court\nDr.|Drive"
                    ."\nExpy.|Expressway\nJct.|Junction\nLn.|Lane\nRte.|Route\nSt.|Street\nSte.|Suite\nTpke.|Turnpike"; }


                variable_set('udm_allow_pull', $_REQUEST['udm_allow_pull']);
                variable_set('udm_pull_security_key', $_REQUEST['udm_pull_security_key']);
                variable_set('udm_do_pull', $_REQUEST['udm_do_pull']);
                variable_set('udm_pull_from_taxtarget', $_REQUEST['udm_pull_from_taxtarget']);
                variable_set('udm_pull_frequency', $_REQUEST['udm_pull_frequency']);
                variable_set('udm_do_push', $_REQUEST['udm_do_push']);
                variable_set('udm_push_targets', $_REQUEST['udm_push_targets']);
                variable_set('udm_push_security_key', $_REQUEST['udm_push_security_key']);
                variable_set('udm_pull_from_nodetarget', $_REQUEST['udm_pull_from_nodetarget']);
                variable_set('udm_serv_taxonomy', $_REQUEST['udm_serv_taxonomy']);
                variable_set('udm_serv_nodes', $_REQUEST['udm_serv_nodes']);
                variable_set('udm_tax_dofilter', $_REQUEST['udm_tax_dofilter']);
                variable_set('udm_tax_filter_names', $_REQUEST['udm_tax_filter_names']);
                variable_set('udm_node_filter_rule', $_REQUEST['udm_node_filter_rule']);
                variable_set('udm_tax_del', $_REQUEST['udm_tax_del']);
                variable_set('udm_tax_del_term', $_REQUEST['udm_tax_del_term']);
                variable_set('udm_friendly_alias', $_REQUEST['udm_friendly_alias']);
                variable_set('udm_filemedia_s3translate', $_REQUEST['udm_filemedia_s3translate']);
                variable_set('data_abbr', $_REQUEST['data_abbr']);
                variable_set('udm_tax_delbyfield', $_REQUEST['udm_tax_delbyfield']);
                variable_set('udm_tax_delbyfield_field', $_REQUEST['udm_tax_delbyfield_field']);
                variable_set('udm_tax_delbyfield_fieldval', $_REQUEST['udm_tax_delbyfield_fieldval']);
                variable_set('udm_do_localpush', $_REQUEST['udm_do_localpush']);
                variable_set('udm_do_pushoncron', $_REQUEST['udm_do_pushoncron']);


                if ( isset($_REQUEST['udm_conttypes']) ) {
                    $opts = array();
                    foreach ( $_REQUEST['udm_conttypes'] as $cType ) {
                        $opts[$cType] = $cType;
                    }
                    variable_set('udm_conttypes', $opts);
                }

                break;

            case 'Delete all taxonomy-terms':
                db_query('TRUNCATE TABLE taxonomy_term_data'); // Kill terms in base table
                cleanup_killOrphanedFieldData(); // Kill term-field data in other tables
                break;

            case 'Delete all nodes':
                db_query('TRUNCATE TABLE node'); // Kill terms in base table
                // Kill term-field data in other tables
                cleanup_killOrphanedNodeRevisions();
                cleanup_killOrphanedFieldData();
                break;

            case 'Pull nodes and terms that have changed on the CMP':
                usa_data_migration_updatePull(false, false);
                break;

            case 'Pull ALL taxonomy-entities Now':
                ini_set('error_reporting', E_ALL);
                /* Since this may be a long-running process, close the
                connection with the client and continue running */
                #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
                if ( function_exists('fastcgi_finish_request') ) {
                    drupal_set_message('usa_data_migration_synchTaxonomyFromTarget() is running.', 'status');
                    $q = !empty($_GET['force']) ? array('force'=>1) : array();
                    $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
                    session_write_close();
                    header('Location: ' . $url, TRUE, 302);
                    while ( @ob_get_length() ) { @ob_end_clean(); }
                    flush();
                    fastcgi_finish_request();
                }
                $target = variable_get('udm_pull_from_taxtarget');
                $ret = usa_data_migration_synchTaxonomyFromTarget($target, false);
                // drupal_set_message(
                //     'usa_data_migration_synchTaxonomyFromTarget() returned: ' . $ret,
                //     'status'
                // );
                break;

            case 'Pull ALL nodes-entities now':
                ini_set('error_reporting', E_ALL);
                /* Since this may be a long-running process, close the
                connection with the client and continue running */
                #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
                if ( function_exists('fastcgi_finish_request') ) {
                    drupal_set_message('usa_data_migration_synchNodesFromTarget() is running.', 'status');
                    $q = !empty($_GET['force']) ? array('force'=>1) : array();
                    $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
                    session_write_close();
                    header('Location: ' . $url, TRUE, 302);
                    while ( @ob_get_length() ) { @ob_end_clean(); }
                    flush();
                    fastcgi_finish_request();
                }
                $target = variable_get('udm_pull_from_nodetarget');
                $onlyCertainType = ( empty($_REQUEST['dopullnodetype']) ? '' : $_REQUEST['dopullnodetype'] );
                $ret = usa_data_migration_synchNodesFromTarget($target, false, 50, 0, 0, false, $onlyCertainType);
                // drupal_set_message(
                //     'usa_data_migration_synchNodesFromTarget() returned: ' . $ret,
                //     'status'
                // );
                break;

            // case 'Clear Log':
            //     variable_set('udm_log', array());
            //     drupal_set_message('Log cleared', 'status');
            //     break;

            default:
                @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
                exit('Error - Unknown operation');
                break;
        }
	}

    // When we are the taxonomy-server, inform the admin of the taxonomy-server-URL
    if ( variable_get('udm_allow_pull', false) ) {

        $serverURL = 'http://' . $_SERVER['HTTP_HOST'] . '/get-taxonomy-dump';
        if ( variable_get('udm_pull_security_key', '') !== '' ) {
            $serverURL .= '?key=' . variable_get('udm_pull_security_key');
        }
        drupal_set_message(
            "<b>Note:</b> This site is setup to server its taxonomy information from the URL: "
                ."<a target=\"_blank\" href=\"{$serverURL}\">{$serverURL}</a>",
            "status",
            false
        );

        $serverURL = 'http://' . $_SERVER['HTTP_HOST'] . '/get-node-dump';
        if ( variable_get('udm_pull_security_key', '') !== '' ) {
            $serverURL .= '?key=' . variable_get('udm_pull_security_key');
        }
        drupal_set_message(
            "<b>Note:</b> This site is setup to server its node information from the URL: "
                ."<a target=\"_blank\" href=\"{$serverURL}\">{$serverURL}</a>",
            "status",
            false
        );
    }

    // When we are pulling taxonomy-data, inform the admin of the taxonomy-pull-URL
    if ( variable_get('udm_do_pull', false) ) {

        $pushURL = 'http://' . $_SERVER['HTTP_HOST'] . '/udm-do-pull-now';
        if ( variable_get('udm_push_security_key', '') !== '' ) {
            $pushURL .= '?key=' . variable_get('udm_push_security_key');
        }
        drupal_set_message(
            "<b>FYI:</b> This site is setup to recieve a message telling it to do an update-pull. This trigger-URL is: "
                ."<a target=\"_blank\" href=\"{$pushURL}&\">{$pushURL}&</a>",
            "status",
            false
        );
    }

    $form = array();

    $form['udmmode'] = array(
        '#type' => 'fieldset',
        '#title' => 'Mode',
        '#collapsible' => false,
        '#collapsed' => false,
    );

    $form['udmmode']['udm_allow_pull'] = array(
        '#type' => 'checkbox',
        '#title' => 'Allow another site to pull taxonomy and content from this environment',
        '#default_value' => variable_get('udm_allow_pull', 0)
    );

    $form['udmmode']['udm_do_pull'] = array(
        '#type' => 'checkbox',
        '#title' => 'This site shall pull and receive taxonomy information from another site [<small>that is using this module</small>]',
        '#default_value' => variable_get('udm_do_pull', 0)
    );

    $form['actions'] = array(
        '#type' => 'fieldset',
        '#title' => 'Actions',
        '#collapsible' => true,
        '#collapsed' => true,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_do_pull"]' => array('checked' => false),
            ),
        ),
    );

    $form['actions']['dopulltax']['clear_acts'] = array(
        '#type' => 'fieldset',
        '#title' => 'Clearing Actions',
        '#collapsible' => true,
        '#collapsed' => true,
    );

    $form['actions']['dopulltax']['clear_acts']['cleartax'] = array(
        '#type' => 'submit',
        '#value' => 'Delete all taxonomy-terms',
    );

    $form['actions']['dopulltax']['clear_acts']['clearnodes'] = array(
        '#type' => 'submit',
        '#value' => 'Delete all nodes',
    );

    $form['actions']['dopulltax']['updatepull_acts'] = array(
        '#type' => 'fieldset',
        '#title' => 'Update-Pull Actions',
        '#collapsible' => false,
        '#collapsed' => false,
    );

    $form['actions']['dopulltax']['updatepull_acts']['dopulltax'] = array(
        '#type' => 'submit',
        '#value' => 'Pull nodes and terms that have changed on the CMP',
        '#suffix' => ' (since ' . date('Y-m-d h:ia', variable_get('udm_last_pull_time', 0)) . ')'
    );

    $form['actions']['dopulltax']['fullpull_acts'] = array(
        '#type' => 'fieldset',
        '#title' => 'Full-Pull Actions',
        '#collapsible' => true,
        '#collapsed' => true,
    );

    $form['actions']['dopulltax']['fullpull_acts']['dopulltax'] = array(
        '#type' => 'submit',
        '#value' => 'Pull ALL taxonomy-entities Now',
    );

    $form['actions']['dopulltax']['fullpull_acts']['dopullnodes'] = array(
        '#type' => 'submit',
        '#value' => 'Pull ALL nodes-entities now',
    );

    $form['actions']['dopulltax']['fullpull_acts']['dopullnodetype'] = array(
        '#title' => 'Pull only a certain node type:',
        '#type' => 'textfield',
    );

    // $form['actions']['log'] = array(
    //     '#type' => 'textarea',
    //     '#title' => 'Log:',
    //     '#default_value' => 'To be populated by AJAX/JavaScript, please wait...',
    //     '#size' => '75',
	// 			'#field_prefix' => '&nbsp; <button id="toggleLogsButton" type="button" onclick="return toggleLogs(this);">Start &gt;&nbsp;&nbsp;</button>'
    // );
    // $actionLogSize = ( file_exists(usa_data_migration_action_log_location()) ? filesize(usa_data_migration_action_log_location()) : 0 );
    // drupal_add_js(
    //     "
	// 						var logCheckInterval  = null;
	// 						var logCheckCountdown = null;
	// 						function toggleLogs( button )
	// 						{
	// 							if ( button.innerHTML == 'Start &gt;&nbsp;&nbsp;' )
	// 							{
	// 									startCheckingLogs();
	// 									button.innerHTML = 'Stop &gt;&nbsp;&nbsp;';
    //
	// 									clearInterval( logCheckCountdown );
	// 									logCheckCountdown = null;
	// 									var b = button;
	// 									logCheckCountdown = setInterval( function() {
	// 										if ( 				b.innerHTML == 'Stop &gt;&nbsp;&nbsp;' ) {
	// 												 				b.innerHTML =  'Stop &nbsp;&gt;&nbsp;';
	// 										} else if ( b.innerHTML == 'Stop &nbsp;&gt;&nbsp;') {
	// 											          b.innerHTML =  'Stop &nbsp;&nbsp;&gt;';
	// 										} else if ( b.innerHTML == 'Stop &nbsp;&nbsp;&gt;') {
	// 											          b.innerHTML =  'Stop &nbsp;&nbsp;&lt;';
	// 										} else if ( b.innerHTML == 'Stop &nbsp;&nbsp;&lt;') {
	// 											          b.innerHTML =  'Stop &nbsp;&lt;&nbsp;';
	// 										} else if ( b.innerHTML == 'Stop &nbsp;&lt;&nbsp;') {
	// 											          b.innerHTML =  'Stop &lt;&nbsp;&nbsp;';
	// 										} else if ( b.innerHTML == 'Stop &lt;&nbsp;&nbsp;') {
	// 											          b.innerHTML =  'Stop &gt;&nbsp;&nbsp;';
	// 										}
	// 									}, 250 );
	// 							} else {
	// 								stopCheckingLogs();
	// 								button.innerHTML = 'Start &gt;&nbsp;&nbsp;';
	// 							}
	// 							return false;
	// 						}
	// 						function startCheckingLogs()
	// 						{
	// 							if ( logCheckInterval ) { return; }
	// 							var doCheck = function ()
	// 							{
	// 									// Pull the [action] error log into the UI
	// 									jQuery.get('/udm-action-log?offset={$actionLogSize}', function (data)
	// 									{
	// 											var jqLogUi = jQuery('#edit-log');
	// 											var logUi = jQuery('#edit-log').get(0);
	// 											jqLogUi.val( jQuery.trim(data) );
	// 											logUi.scrollTop = logUi.scrollHeight;
	// 									});
	// 							}
	// 							doCheck();
	// 							logCheckInterval = setInterval( doCheck, 5000 );
	// 						}
	// 						function stopCheckingLogs()
	// 						{
	// 							clearInterval( logCheckInterval );
	// 							logCheckInterval = null;
	// 							clearInterval( logCheckCountdown );
	// 							logCheckCountdown = null;
	// 						}
    //     ",
    //     'inline'
    // );

    $form['serversettings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Taxonomy/Content Server Settings',
        '#collapsible' => true,
        '#collapsed' => false,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_allow_pull"]' => array('checked' => false),
            ),
        ),
    );

    $form['serversettings']['udm_pull_security_key'] = array(
        '#type' => 'textfield',
        '#title' => 'Require the foreign site to use this key for pull-requests',
        '#default_value' => variable_get('udm_pull_security_key', ''),
        '#size' => '75',
        '#description' => 'The URL used to pull the taxonomy information will be http://' . $_SERVER['HTTP_HOST']
        	.'/get-taxonomy-dump?key=<b>[your-key-here]</b>',
    );

    $form['serversettings']['bundlesset'] = array(
        '#type' => 'fieldset',
        '#title' => 'Serve bundles',
        '#collapsible' => true,
        '#collapsed' => true,
    );

    $form['serversettings']['bundlesset']['udm_serv_taxonomy'] = array(
        '#type' => 'checkbox',
        '#title' => 'Taxonomy terms',
        '#default_value' => variable_get('udm_serv_taxonomy', 0)
    );

    $form['serversettings']['bundlesset']['udm_serv_nodes'] = array(
        '#type' => 'checkbox',
        '#title' => 'Nodes',
        '#default_value' => variable_get('udm_serv_nodes', 0)
    );

    $opts = array();
    foreach ( _bundle_copy_bundle_info('node', TRUE) as $contentType => $data ) {
        $opts[$contentType] = $contentType;
    }
    $form['serversettings']['bundlesset']['udm_conttypes'] = array(
        '#type' => 'select',
        '#title' => 'Content Types',
        '#options' => $opts,
        '#size' => 10,
        '#multiple' => true,
        '#default_value' => variable_get('udm_conttypes', ''),
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_serv_nodes"]' => array('checked' => false),
            ),
        ),
   );

    $form['serversettings']['udm_do_push'] = array(
        '#type' => 'checkbox',
        '#title' => 'When an entity is changed in this environment, push it to [the] other site(s)',
        '#default_value' => variable_get('udm_do_push', 0)
    );

    $form['serversettings']['udm_push_targets'] = array(
        '#type' => 'textarea',
        '#title' => 'When an entity is changed in this environment, push to the following environments:',
        '#default_value' => variable_get('udm_push_targets', ''),
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_do_push"]' => array('checked' => false),
            ),
        ),
        '#description' => 'Go to the "<i>USA Taxonomy Migration</i>" module on the foreign site in order to get the '
            .'<b>push-request-URL</b> to paste here.<br/>Seperate each site-URL with a new-line.',
    );

    $form['serversettings']['udm_do_localpush'] = array(
        '#type' => 'checkbox',
        '#title' => 'Use local-push method',
        '#default_value' => variable_get('udm_do_localpush', 0),
        '#description' => 'When this mode is active, no MySQL will be given to the child-site to consume, this CMP '
            .'environment will write to a local MySQL database instead.'
    );

    $form['serversettings']['udm_do_pushoncron'] = array(
        '#type' => 'checkbox',
        '#title' => 'Push on cron',
        '#default_value' => variable_get('udm_do_pushoncron', 0),
        '#description' => 'When this checkbox is ticked, this module will pushed to all sites listed in the '
            .'textarea above on HOOK_cron().'
    );

    $form['pullsettings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Pull Settings',
        '#collapsible' => true,
        '#collapsed' => false,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_do_pull"]' => array('checked' => false),
            ),
        ),
    );

    $form['pullsettings']['udm_pull_from_taxtarget'] = array(
        '#type' => 'textfield',
        '#title' => 'Pull taxonomy information from the following URL:',
        '#default_value' => variable_get('udm_pull_from_taxtarget', ''),
        '#size' => '75',
        '#description' => 'Use the "<i>USA Data Migration</i>" module on the foreign site to botain the URL to pull taxonomy-'
            .'data from.<br/>Be sure to <b>include the security-key</b> in the value pasted here!',
    );

    $form['pullsettings']['udm_pull_from_nodetarget'] = array(
        '#type' => 'textfield',
        '#title' => 'Pull node-content from the following URL:',
        '#default_value' => variable_get('udm_pull_from_nodetarget', ''),
        '#size' => '75',
        '#description' => 'Use the "<i>USA Data Migration</i>" module on the foreign site to botain the URL to pull node-'
            .'data from.<br/>Be sure to <b>include the security-key</b> in the value pasted here!',
    );

    $form['pullsettings']['udm_pull_frequency'] = array(
        '#type' => 'textfield',
        '#title' => 'Pull taxonomy information every # minutes',
        '#default_value' => variable_get('udm_pull_frequency', '5'),
        '#size' => '5',
        '#field_suffix' => 'minutes',
        '#description' => '<b>Warning:</b> For this functionality to work, either; Drupal-Cron must fire at least this frequently, '
            .'<b>- OR -</b> Linux-Cron needs to touch (<small>i.e. curl or wget</small>) the URL: http://' . $_SERVER['HTTP_HOST']
            .'/usa-data-migration/udm-cron-task<br/>'
            .'Notice: Setting this value also means that this module will never pull <i>more frequently</i> than the given input '
            .'(<small>even if Drupal-cron were to fire every 30 seconds</small>).',
    );

    $form['pullsettings']['udm_push_security_key'] = array(
        '#type' => 'textfield',
        '#title' => 'Require a foreign site to use this key when pushing data into this environment:',
        '#default_value' => variable_get('udm_push_security_key', ''),
        '#size' => '75',
        '#description' => 'This will set the push-request-URL to http://' . $_SERVER['HTTP_HOST'] . '/set-entity-data?'
            .'key=<b>[your-key-here]</b>',
    );

    $form['pullsettings']['udm_alter_entities_settings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Entity Alteration Options',
        '#collapsible' => false,
        '#collapsed' => false,
    );

    $form['pullsettings']['udm_alter_entities_settings']['udm_friendly_alias'] = array(
        '#type' => 'checkbox',
        '#title' => 'Set the alias paths of taxonomy-terms to the value in their "Friendly URL" field',
        '#default_value' => variable_get('udm_friendly_alias', 0),
        '#description' => 'Only effects terms that have a \$term->field_friendly_url field.<br/>'
            .'If a field-value is a full/absolute URL-path, it willbe converted into a realative path.'
    );

    $form['pullsettings']['udm_alter_entities_settings']['udm_filemedia_s3translate'] = array(
        '#type' => 'checkbox',
        '#title' => 'Translate any S3 pointers in a field_file_media field to a full-URL, to '
            .'be stored in a field_file_media_url text-field.',
        '#default_value' => variable_get('udm_filemedia_s3translate', 0),
        '#description' => 'Only effects nodes which have both a field_file_media_url S3 field, and a '
            .'field_file_media_url text-field.'
    );

    $form['pullsettings']['udm_tax_dofilter'] = array(
        '#type' => 'checkbox',
        '#title' => 'Filter taxonomy terms after consumption',
        '#default_value' => variable_get('udm_tax_dofilter', 0)
    );

    $form['pullsettings']['udm_tax_filter_settings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Taxonomy filtration settings',
        '#collapsible' => true,
        '#collapsed' => false,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_tax_dofilter"]' => array('checked' => false),
            ),
        ),
    );

    $form['pullsettings']['udm_tax_filter_settings']['udm_tax_filter_names'] = array(
        '#type' => 'textfield',
        '#title' => 'Filter out taxonomy terms which do not have a top-level-parent with the name of:',
        '#default_value' => variable_get('udm_tax_filter_names', '')
    );

    $form['pullsettings']['udm_tax_filter_settings']['udm_node_filter_rule'] = array(
        '#type' => 'textfield',
        '#title' => 'Filter for nodes where field = value:',
        '#default_value' => variable_get('udm_node_filter_rule', '')
    );

    $form['pullsettings']['udm_tax_del'] = array(
        '#type' => 'checkbox',
        '#title' => 'Delete a particular taxonomy term, while maintaining its children after consumption',
        '#default_value' => variable_get('udm_tax_del', 0)
    );

    $form['pullsettings']['udm_tax_del_settings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Term deletion settings',
        '#collapsible' => true,
        '#collapsed' => false,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_tax_del"]' => array('checked' => false),
            ),
        ),
    );

    $form['pullsettings']['udm_tax_del_settings']['udm_tax_del_term'] = array(
        '#type' => 'textfield',
        '#title' => 'Term name to delete',
        '#default_value' => variable_get('udm_tax_del_term', '')
    );

    $form['pullsettings']['udm_tax_delbyfield'] = array(
        '#type' => 'checkbox',
        '#title' => 'Delete a particular taxonomy terms based on field-value',
        '#default_value' => variable_get('udm_tax_delbyfield', 0)
    );

    $form['pullsettings']['udm_tax_delbyfield_settings'] = array(
        '#type' => 'fieldset',
        '#title' => 'Term deletion settings',
        '#collapsible' => true,
        '#collapsed' => false,
        '#states' => array(
            'invisible' => array(
                ':input[name="udm_tax_delbyfield"]' => array('checked' => false),
            ),
        ),
    );

    $vocabFields = field_info_instances('taxonomy_term', 'site_strucutre_taxonomy');
    $delbyfieldFields = array();
    foreach ($vocabFields as $fieldMachineName => $fieldData) {
        $delbyfieldFields[$fieldMachineName] = $fieldData['label'] . ' (' . $fieldMachineName . ')';
    }
    $form['pullsettings']['udm_tax_delbyfield_settings']['udm_tax_delbyfield_field'] = array(
        '#type' => 'select',
        '#title' => 'Delete terms where;',
        '#options' => $delbyfieldFields,
        '#default_value' => variable_get('udm_tax_delbyfield_field', ''),
        '#field_prefix' => 'the ',
        '#field_suffix' => 'field...',
    );

    $form['pullsettings']['udm_tax_delbyfield_settings']['udm_tax_delbyfield_fieldval'] = array(
        '#type' => 'textfield',
        '#title' => '',
        '#default_value' => variable_get('udm_tax_delbyfield_fieldval', ''),
        '#field_prefix' => 'is set to the value; ',
    );

    // $logHtml = '';
    // foreach ( array_reverse( variable_get('udm_log', array()) ) as $index => $logItem ) {
    //     if ( $index !== 0 ) { $logHtml .= "\n"; }
    //     $logHtml .= date('Y-m-d g:ia', $logItem['time']) . ' - ' . $logItem['msg'];
    // }
    // $form['log'] = array(
    //     '#type' => 'fieldset',
    //     '#title' => 'Log',
    //     '#collapsible' => true,
    //     '#collapsed' => true,
    // );
    // $form['log']['clearlog'] = array(
    //     '#type' => 'submit',
    //     '#value' => 'Clear Log',
    // );
    // $form['log']['logdata'] = array(
    //     '#type' => 'item',
    //     '#title' => 'Log Data:',
    //     '#markup' => '<pre>' . $logHtml . '</pre>',
    // );

    /* Adding Data alter setting */
    $form['alterdatasetting'] = array(
        '#type' => 'fieldset',
        '#title' => 'Altering Data Setting',
        '#collapsible' => true,
        '#collapsed' => true,
    );

    $form['alterdatasetting']['data_abbr'] = array(
        '#type' => 'textarea',
        '#title' => 'Data Abbreviation:',
        '#default_value' => variable_get('data_abbr', "Apt.|Apartment\nAve.|Avenue\nBldg.|Building\nBlvd.|Boulevard\nCir.|Circle\nCt.|Court\nDr.|Drive"
            ."\nExpy.|Expressway\nJct.|Junction\nLn.|Lane\nRte.|Route\nSt.|Street\nSte.|Suite\nTpke.|Turnpike"),
    );

    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Save'),
    );

    return $form;
}
