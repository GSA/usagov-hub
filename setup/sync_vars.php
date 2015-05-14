#!/usr/bin/env php
<?php /*

    [!!] WARNING [!!]

    This script MUST exist (expects to be) in the <DrupalRoot>/setup folder
    This scrpt is written to work with the CMP repo, NOT the child-site repo

    [--] PURPOSE [--]

    This script is used to grab environmental variables and sync them into the Drupal database

*/

// If Drupal is not bootstrapped already, we must bootstrap is now
if ( !function_exists('variable_set') ) {

    // Because we Drupal is not bootstrapped, change directory to Drupal-root
    chdir( dirname(__DIR__) ); // Changes directory up one from this running script; from ~/setup into ~/
    if ( !file_exists('sites/default/settings.php') ) {
        exit('Error in sync_vars.php - Could not bootstrap Drupal');
    }
    
    define('DRUPAL_ROOT', getcwd());
    require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
    drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

}

// We shall creating a mapping of which Environmental-variables shall be taken and placed into which Drupal-variable, FOR EACH type
global $envToDrupalMap;
$envToDrupalMap = array(

    /* Add Env->Drupal vars here, to be typecast into STRINGS */
    'strings' => array( 

        /* Drupal variables, strings, used by Drupal-core */
        'CMP_DRUPAL_SITE_NAME' => 'site_name',
        'CMP_DRUPAL_SITE_MAIL' => 'site_mail', /* "E-mail address" in /admin/config/system/site-information */

        /* Drupal variables, strings, used by the cmp_misc module */
        'CMP_DRUPAL_FORWARD_SENDER_ADDRESS' => 'forward_sender_address',
        'CMP_DRUPAL_FORWARD_SENDER_ADDRESS' => 'mail_line_endings',

        /* Drupal variables, strings, used by the usa_data_migration module */
        'CMP_DRUPAL_UDM_PULL_SECURITY_KEY' => 'udm_pull_security_key',
        'CMP_DRUPAL_UDM_PULL_FROM_TAXTARGET' => 'udm_pull_from_taxtarget',
        'CMP_DRUPAL_UDM_PULL_FREQUENCY' => 'udm_pull_frequency',
        'CMP_DRUPAL_UDM_PUSH_TARGETS' => 'udm_push_targets',
        'CMP_DRUPAL_UDM_PUSH_SECURITY_KEY' => 'udm_push_security_key',
        'CMP_DRUPAL_UDM_PULL_FROM_NODETARGET' => 'udm_pull_from_nodetarget',
        'CMP_DRUPAL_UDM_TAX_FILTER_NAMES' => 'udm_tax_filter_names',
        'CMP_DRUPAL_UDM_NODE_FILTER_RULE' => 'udm_node_filter_rule',
        'CMP_DRUPAL_UDM_TAX_DEL_TERM' => 'udm_tax_del_term',
        'CMP_DRUPAL_DATA_ABBR' => 'data_abbr',
        'CMP_DRUPAL_UDM_TAX_DELBYFIELD_FIELD' => 'udm_tax_delbyfield_field',
        'CMP_DRUPAL_UDM_TAX_DELBYFIELD_FIELDVAL' => 'udm_tax_delbyfield_fieldval',

        /* Drupal variables, strings, used by the slack module */
        'CMP_DRUPAL_SLACK_WEBHOOK_URL' => 'slack_webhook_url',
        'CMP_DRUPAL_SLACK_CHANNEL' => 'slack_channel',
        'CMP_DRUPAL_SLACK_USERNAME' => 'slack_username',

        /* Drupal variables, strings, used by the s3fs module */
        'CMP_DRUPAL_AWSSDK2_ACCESS_KEY' => 'awssdk2_access_key',
        'CMP_DRUPAL_AWSSDK2_DEFAULT_CACHE_CONFIG' => 'awssdk2_default_cache_config',
        'CMP_DRUPAL_S3FS_BUCKET' => 's3fs_bucket',
        'CMP_DRUPAL_S3FS_CUSTOMHOST' => 's3fs_customhost',
        'CMP_DRUPAL_S3FS_CNAME' => 's3fs_cname',
        'CMP_DRUPAL_S3FS_USE_RELATIVE_URLS' => 's3fs_use_relative_urls',

        /* Drupal variables, strings, used by the smtp module */
        'CMP_DRUPAL_SMTP_HOST' => 'smtp_host',
        'CMP_DRUPAL_SMTP_HOSTBACKUP' => 'smtp_hostbackup',
        'CMP_DRUPAL_SMTP_PROTOCOL' => 'smtp_protocol',
        'CMP_DRUPAL_SMTP_USERNAME' => 'smtp_username',
        'CMP_DRUPAL_SMTP_PASSWORD' => 'smtp_password',
        'CMP_DRUPAL_SMTP_FROM' => 'smtp_from',
        'CMP_DRUPAL_SMTP_FROMNAME' => 'smtp_fromname',
    ),

    /* Add Env->Drupal vars here, to be typecast into INTEGERS */
    'integers' => array(

        /* Drupal variables, integers, used by the usa_data_migration module */
        'CMP_DRUPAL_UDM_DO_PULL' => 'udm_do_pull',
        'CMP_DRUPAL_UDM_DO_PUSH' => 'udm_do_push',
        'CMP_DRUPAL_UDM_ALLOW_PULL' => 'udm_allow_pull',
        'CMP_DRUPAL_UDM_SERV_TAXONOMY' => 'udm_serv_taxonomy',
        'CMP_DRUPAL_UDM_SERV_NODES' => 'udm_serv_nodes',
        'CMP_DRUPAL_UDM_TAX_DOFILTER' => 'udm_tax_dofilter',
        'CMP_DRUPAL_UDM_DO_PUSHONCRON' => 'udm_do_pushoncron',
        'CMP_DRUPAL_UDM_DO_LOCALPUSH' => 'udm_do_localpush',
        'CMP_DRUPAL_UDM_TAX_DEL' => 'udm_tax_del',
        'CMP_DRUPAL_UDM_FRIENDLY_ALIAS' => 'udm_friendly_alias',
        'CMP_DRUPAL_UDM_FILEMEDIA_S3TRANSLATE' => 'udm_filemedia_s3translate',
        'CMP_DRUPAL_UDM_TAX_DELBYFIELD' => 'udm_tax_delbyfield',

        /* Drupal variables, integers, used by the s3fs module */
        'CMP_DRUPAL_S3FS_ALLOW_RELATIVE' => 's3fs_allow_relative',

        /* Drupal variables, strings, used by the smtp module */
        'CMP_DRUPAL_SMTP_ON' => 'smtp_on',
        'CMP_DRUPAL_SMTP_QUEUE' => 'smtp_queue',
        'CMP_DRUPAL_SMTP_PORT' => 'smtp_port',
        'CMP_DRUPAL_SMTP_DEBUGGING' => 'smtp_debugging',

    ),

    'booleans' => array( /* Add Env->Drupal vars here, to be typecast into BOOLEANS */
        
    ),
);

// Now we shall run through the mapping ($envToDrupalMap) and apply environmental-variables into Drupal
foreach ($envToDrupalMap as $typecastAs => $varToVarMap) {
    foreach ($varToVarMap as $envVarName => $drupalVarName) {

        if ( !empty(getenv($envVarName)) ) {

            $envVarName = getenv($envVarName);

            switch ($typecastAs) {
                case 'strings':
                    $envVarName = strval($envVarName);
                    $envVarName = str_replace("\\r", "\r", $envVarName);
                    $envVarName = str_replace("\\n", "\n", $envVarName);
                    break;
                case 'integers':
                    $envVarName = intval($envVarName);
                    break;
                case 'booleans':
                    $envVarName = boolval($envVarName);
                    break;
            }

            variable_set($drupalVarName, $envVarName);
        }
    }
}
