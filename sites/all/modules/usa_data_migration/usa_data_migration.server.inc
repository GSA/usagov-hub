<?php

function usa_data_migration_init() {

    if ( !empty($_SESSION['udm_push_eid']) && !empty($_SESSION['udm_push_type']) ) {

        $eid = $_SESSION['udm_push_eid'];
        $etype = $_SESSION['udm_push_type'];
        drupal_add_js(
            "
                jQuery(document).ready( function () {
                    console.log('Telling the CMP {$etype} {$eid} needs to be pushed to child-sites...');
                    var pushURL = '/udm-trigger-pull-on-child-sites?eid={$eid}&etype={$etype}';
                    jQuery.get(pushURL, function (data) {
                        console.log('Push has completed, CMP end responded with:');
                        console.log(data);
                    });
                })
            ",
            "inline"
        );
    }

}

function usa_data_migration_triggerUpdatePullOnAllChildSites() {

    unset($_SESSION['udm_push_eid']);
    unset($_SESSION['udm_push_type']);
    $targets = explode("\n", variable_get('udm_push_targets', ''));
    foreach ($targets as $target) {
        file_get_contents($target);
    }

}

/*
 * Implements HOOK_taxonomy_term_update
 */
function usa_data_migration_taxonomy_term_update($term) {
    usa_data_migration_schedualTriggerChildPull($term);

    if ( !empty($term->tid) ) {
        db_query("INSERT IGNORE INTO taxonomy_dates (tid) VALUES({$term->tid})");
        $nowTime = time();
        db_query("UPDATE taxonomy_dates SET changed = {$nowTime} WHERE tid = {$term->tid}");
    }
}

/*
 * Implements HOOK_taxonomy_term_update
 */
function usa_data_migration_taxonomy_term_insert($term) {
    
    usa_data_migration_schedualTriggerChildPull($term);

    if ( !empty($term->tid) ) {
        db_query("INSERT IGNORE INTO taxonomy_dates (tid) VALUES({$term->tid})");
        $nowTime = time();
        db_query("UPDATE taxonomy_dates SET created={$nowTime}, changed={$nowTime} WHERE tid = {$term->tid}");
    }
}

/*
 * Implements HOOK_node_insert
 */
function usa_data_migration_node_insert($node) {
    usa_data_migration_schedualTriggerChildPull($node);
}

/*
 * Implements HOOK_workbench_moderation_transition
 */
function usa_data_migration_workbench_moderation_transition($entity, $fromState, $toState) {
    usa_data_migration_schedualTriggerChildPull($entity);
}

/*
 * void usa_data_migration_pushEntity(object $entity)
 *
 * Pushes a node or taxonomy-term out to child sites when nessesary
 */
function usa_data_migration_schedualTriggerChildPull($entity) {

    $thisFunct = __FUNCTION__;

    // Bail if we are not setup as the content-server
    if ( intval(variable_get('udm_do_push', false)) === 0 ) {
        return;
    }

    // Are we supposed to server this bundle-type?
    if ( $entityType === 'taxonomy term' && intval(variable_get('udm_serv_taxonomy', 0)) === 0 ) {
        usa_data_migration_error_log("Not pushing this taxonomy-term - we are not configured to push this bundle-type");
        return;
    }
    if ( $entityType === 'node' ) {
        if ( intval(variable_get('udm_serv_nodes', 0)) === 0 ) {
            usa_data_migration_error_log("Not pushing this node - we are not configured to push this bundle-type");
            return;
        } else {
            if ( !in_array($entity->type, variable_get('udm_conttypes', array())) ) {
                usa_data_migration_error_log("Not pushing this node - we are not configured to push nodes under this content-type");
                return;
            }
        }
    }           

    $eid = false;
    if ( !empty($entity->nid) ) {
        $eid = $entity->nid;
        $etype = 'node';
    }
    if ( !empty($entity->tid) ) {
        $eid = $entity->tid;
        $etype = 'term';
    }

    // Data validation
    if ( $eid === false ) {
        error_log("Error in ".__FUNCTION__."(), bad data supplied.");
        return;
    }

    $_SESSION['udm_push_eid'] = $eid;
    $_SESSION['udm_push_type'] = $etype;

}

/**
 *  void usa_data_migration_printTaxonomyDump()
 *
 *  Print a MySqlDump of the taxonomy tables on this system, and then 
 *  terminates the PHP thread.
 */
function usa_data_migration_printTaxonomyDump() {

    if ( intval(variable_get('udm_allow_pull', false)) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Service not enabled";
        exit();
    }

    if ( intval(variable_get('udm_serv_taxonomy', false)) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Taxonomy-server not enabled";
        exit();
    }

    if ( empty($_REQUEST['batch']) || intval($_REQUEST['batch']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad batch argument in request - this argument must be an integer greater than 0";
        exit();
    }
    $batch = intval($_REQUEST['batch']);

    if ( empty($_REQUEST['size']) || intval($_REQUEST['size']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad size argument in request - this argument must be an integer greater than 0";
        exit();
    }
    $size = intval($_REQUEST['size']);

    $returnData = array();

    // Security validation
	if ( variable_get('udm_pull_security_key', '') !== '' ) { // If we expect a security key...

        // If no key provided, or the key is not matching what we expect...
		if ( empty($_REQUEST['key']) || trim($_REQUEST['key']) !== trim(variable_get('udm_pull_security_key', '')) ) {
            usa_data_migration_log(
                "A request was made to pull a taxonomy-dump from a foreign host, which was REJECTED due to "
                    ."a missing or invalid security-key."
            );
            @ob_end_clean();
            while (@ob_end_clean());
            header('Content-Type: text');
			exit('Access Denied: Invalid security key');
		}
	}

    // Obtain code used with the "Bundle Copy" module, to export/import taxonomy fields STRUCTURE (struct only, no field data)
    if ( $batch === 1 ) {
        $returnData['taxFieldStructure_BundleImportCode'] = usa_data_migration_getExportTaxonomyStructureCode();
    }

    // Get the tids of terms to push out
    $offset = ($batch - 1) * $size;
    $since = ( !empty($_GET['since']) && intval($_GET['since']) > 0 ? 'WHERE d.changed > '.intval($_GET['since']) : false );
    $tids = db_query("
        SELECT t.tid FROM taxonomy_term_data t
        LEFT JOIN taxonomy_dates d ON ( t.tid = d.tid )
        {$since} 
        LIMIT {$offset},{$size} 
    ")->fetchCol();
    $tidList = implode(',', $tids);
    $returnData['TaxDump_tidList'] = $tidList;

    // If there is no more nodes [in this batch], bail
    if ( count($tids) === 0 ) {
        @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
        exit('NO MORE DATA');
    }

    // Obtain a MySQL dump of all node information
    $returnData['TaxDump_sqlDump'] = '';

    // taxonomy_term_data
    $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump("taxonomy_term_data", "tid IN ({$tidList}) ", false, true, true, false);
    $returnData['TaxDump_sqlDump'] .= "\n";

    // taxonomy_index
    $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump("taxonomy_index", "tid IN ({$tidList}) ", false, true, true, false);
    $returnData['TaxDump_sqlDump'] .= "\n";

    // taxonomy_term_hierarchy
    $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump("taxonomy_term_hierarchy", "tid IN ({$tidList}) ", false, true, true, false);
    $returnData['TaxDump_sqlDump'] .= "\n";

    // all field and field-revision tables
    $fieldTables = usa_data_migration_getAllFieldTables();
    foreach ( $fieldTables as $fieldTable ) {

        $tblHasdDataForTheseTerms = db_query("
            SELECT COUNT(*) 
            FROM {$fieldTable} 
            WHERE 
                entity_id IN ({$tidList}) 
                AND entity_type='taxonomy_term' 
        ")->fetchColumn();
        if ( intval($tblHasdDataForTheseTerms) > 0 ) {

            // this field table
            $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump(
                $fieldTable, 
                "entity_id IN ({$tidList}) AND entity_type = 'taxonomy_term'  ", 
                false, true, true, false
            );
            $returnData['TaxDump_sqlDump'] .= "\n";

        }
    }

    // Debug
    usa_data_migration_log("A foreign host requested a taxonomy-term dump ({$size} nodes, batch {$batch})");

    // Return data
    if ( empty($_REQUEST['machineReadable']) || intval($_REQUEST['machineReadable']) !== 1 ) {

        $html = "You are seeing this message because you did not include [?/&]machineReadable=1 in the URL-request.<br/>";
        $html .= "The following is a Krumo/kprint_r() render of what this page outputs with the machineReadable=1 flag.<br/>";
        $html .= "(<small>Note: If you see nothing here, then either the Devel module is not on, or you do not have "
            ."permissions to see Krumo ouput</small>)";

        if ( function_exists('kprint_r') ) {
            $html .= kprint_r($returnData, true);
        }
        return $html;

    } else {
        @ob_end_clean();
        while (@ob_end_clean());
        header('Content-Type: text');
        print serialize($returnData);
        exit();
    }
    
}

/**
 *  void usa_data_migration_printNodeDump()
 *
 *  Prints a dump of information descirinb nodes in this system and terminates the PHP thread.
 */
function usa_data_migration_printNodeDump() {

    if ( intval(variable_get('udm_allow_pull', false)) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Server not enabled";
        exit();
    }

    if ( intval(variable_get('udm_serv_nodes', false)) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Node-server not enabled";
        exit();
    }

    if ( empty($_REQUEST['batch']) || intval($_REQUEST['batch']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad batch argument in request - this argument must be an integer greater than 0";
        exit();
    }
    $batch = intval($_REQUEST['batch']);

    if ( empty($_REQUEST['size']) || intval($_REQUEST['size']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad size argument in request - this argument must be an integer greater than 0";
        exit();
    }
    $size = intval($_REQUEST['size']);

    $returnData = array();

    // Security validation
    if ( variable_get('udm_pull_security_key', '') !== '' ) { // If we expect a security key...

        // If no key provided, or the key is not matching what we expect...
        if ( empty($_REQUEST['key']) || trim($_REQUEST['key']) !== trim(variable_get('udm_pull_security_key', '')) ) {
            usa_data_migration_log(
                "A request was made to pull a taxonomy-dump from a foreign host, which was REJECTED due to "
                    ."a missing or invalid security-key."
            );
            @ob_end_clean();
            while (@ob_end_clean());
            header('Content-Type: text');
            exit('Access Denied: Invalid security key');
        }
    }

    // Obtain code used with the "Bundle Copy" module, to export/import taxonomy fields STRUCTURE (struct only, no field data)
    if ( $batch === 1 ) {
        $returnData['nodeFieldStructure_BundleImportCode'] = usa_data_migration_getExportNodeStructureCode();
    }

    // Get the nids of nodes to push out
    $offset = ($batch - 1) * $size;
    $since = ( !empty($_GET['since']) && intval($_GET['since']) > 0 ? 'AND n.changed > '.intval($_GET['since']) : false );
    $cTypeList = '\'' . implode("', '", variable_get('udm_conttypes', array())) . '\'';
    $nids = db_query("SELECT nid FROM node n WHERE n.type IN ({$cTypeList}) {$since} LIMIT {$offset},{$size} ")->fetchCol();
    $nidList = implode(',', $nids);
    $returnData['NodeDump_nidList'] = $nidList;

    // If there is no more nodes [in this batch], bail
    if ( count($nids) === 0 ) {
        @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
        exit('NO MORE DATA');
    }

    // Obtain a MySQL dump of all node information
    $returnData['NodeDump_sqlDump'] = '';

    // usa_data_migration_getMySQLDump($tables, $where, $addDropTable, $ignoreErrors, $fullInsert, $lockTables, $replace)

    // node
    $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump("node", "nid IN ({$nidList}) ", false, true, true, false, true);
    $returnData['NodeDump_sqlDump'] .= "\n";

    // Wipe the UID info from node on the child-site
    $returnData['NodeDump_sqlDump'] .= "\n";
    $returnData['NodeDump_sqlDump'] .= "UPDATE node SET uid = 1; \n";
    $returnData['NodeDump_sqlDump'] .= "UPDATE node_revision SET uid = 1; ; \n";
    $returnData['NodeDump_sqlDump'] .= "\n";

    // node_access
    $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump("node_access", "nid IN ({$nidList}) ", false, true, true, false, true);
    $returnData['NodeDump_sqlDump'] .= "\n";

    // node_revision
    $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump("node_revision", "nid IN ({$nidList}) ", false, true, true, false, true);
    $returnData['NodeDump_sqlDump'] .= "\n";

    // field_data_body
    $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump("field_data_body", "entity_id IN ({$nidList}) ", false, true, true, false, true);
    $returnData['NodeDump_sqlDump'] .= "\n";

    // file_managed
    if ( $batch === 1 ) {
        $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump("file_managed", '', false, true, true, false, true);
        $returnData['NodeDump_sqlDump'] .= "\n";
    }

    // all field and field-revision tables
    $fieldTables = usa_data_migration_getAllFieldTables();
    foreach ( $fieldTables as $fieldTable ) {

        $tblHasdDataForTheseNodes = db_query("
            SELECT COUNT(*) 
            FROM {$fieldTable} 
            WHERE 
                entity_id IN ({$nidList}) 
                AND entity_type='node' 
        ")->fetchColumn();
        if ( intval($tblHasdDataForTheseNodes) > 0 ) {

            // this field table
            $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
                $fieldTable, 
                "entity_id IN ({$nidList}) AND entity_type = 'node'  ", 
                false, true, true, false, true
            );
            $returnData['NodeDump_sqlDump'] .= "\n";

        }
    }

    // Obtain S3 configuration
    if ( function_exists('_s3fs_get_config') ) {
       $returnData['s3Config'] = _s3fs_get_config();
    }

    // Debug
    usa_data_migration_log("A foreign host requested a node dump ({$size} nodes, batch {$batch})");

    // Return data
    if ( empty($_REQUEST['machineReadable']) || intval($_REQUEST['machineReadable']) !== 1 ) {

        $html = "You are seeing this message because you did not include [?/&]machineReadable=1 in the URL-request.<br/>";
        $html .= "The following is a Krumo/kprint_r() render of what this page outputs with the machineReadable=1 flag.<br/>";
        $html .= "(<small>Note: If you see nothing here, then either the Devel module is not on, or you do not have "
            ."permissions to see Krumo ouput</small>)";

        if ( function_exists('kprint_r') ) {
            $html .= kprint_r($returnData, true);
        }
        return $html;

    } else {
        @ob_end_clean();
        while (@ob_end_clean());
        header('Content-Type: text');
        print serialize($returnData);
        exit();
    }
    
}

/*
 * string usa_data_migration_getExportTaxonomyStructureCode()
 *
 * Obtains the same code you would see when going to ~/admin/structure/taxonomy/export and 
 * ticking all checkboxes on that form.
 *
 * This essentially is a wrapper function to _bundle_copy_export_data(), which expects to be given 
 * Drupal-form data. This function creates/emulates the Drupal-form data and triggers that 
 * function with "all checkboxes ticked".
 *
 * This function returns a string to be given to importTaxonomyStructureWithCode(), either on 
 * this site, or another.
 */
function usa_data_migration_getExportTaxonomyStructureCode() {

    $selected_bundles = array();
    foreach ( _bundle_copy_bundle_info('taxonomy_term', TRUE) as $machineName => $label ) {
        $selected_bundles[$machineName] = $machineName;
    }

    $instances = array();
    foreach ($selected_bundles as $key => $bundle) {
        if ($key === $bundle) {
          $instances += field_info_instances('taxonomy_term', $bundle);
        }
    }
    ksort($instances);

    $selectedFields = array();
    foreach ( $instances as $machineName => $fieldInfo ) {
        $selectedFields[$machineName] = $machineName;
    }

    $fieldGroupIds = array();
    $fieldGroupData = array();
    $all_groups = function_exists('field_group_info_groups') ? field_group_info_groups() : array();
    if ( !empty($all_groups) && !empty($all_groups['taxonomy_term']) ) {
        foreach ($all_groups['taxonomy_term'] as $vocabName => $formData) {
            foreach ($formData['form'] as $groupName => $data) {
                $fieldGroupIds[$data->id] = $data->id;
                $fieldGroupData[$data->id] = $data;
            }
        }
    }

    $selected_data = array(
        1 => array(
            'bundles' => $selected_bundles
        ),
        2 => array(
            'fields' => $selectedFields,
            'fieldgroups' => $fieldGroupIds,
            'fieldgroups-full' => $fieldGroupData,
        ),
    );

    return _bundle_copy_export_data('taxonomy_term', $selected_data);
}

/*
 * string usa_data_migration_getExportNodeStructureCode()
 *
 * Obtains the same code you would see when going to ~/admin/structure/types/export and 
 * ticking desiered checkboxes on that form.
 *
 * This essentially is a wrapper function to _bundle_copy_export_data(), which expects to be given 
 * Drupal-form data. This function creates/emulates the Drupal-form data and triggers that 
 * function with the "nessesary checkboxes ticked".
 *
 * This function returns a string to be given to importNodeStructureWithCode(), either on 
 * this site, or another.
 */
function usa_data_migration_getExportNodeStructureCode() {

    $selected_bundles = variable_get('udm_conttypes', array());

    $instances = array();
    foreach ($selected_bundles as $key => $bundle) {
        if ($key === $bundle) {
          $instances += field_info_instances('node', $bundle);
        }
    }
    ksort($instances);

    $selectedFields = array();
    foreach ( $instances as $machineName => $fieldInfo ) {
        $selectedFields[$machineName] = $machineName;
    }

    $selected_data = array(
        1 => array(
            'bundles' => $selected_bundles
        ),
        2 => array(
            'fields' => $selectedFields
        ),
    );

    return _bundle_copy_export_data('node', $selected_data);
}

function usa_data_migration_getMySQLDump($tables, $where = '', $addDropTable = true, $ignoreErrors = false, $fullInsert = false, $lockTables = true, $replace = false) {

    global $databases;
    $dbHost = $databases['default']['default']['host'];
    $dbUser = $databases['default']['default']['username'];
    $dbPass = $databases['default']['default']['password'];
    $dbDatabase = $databases['default']['default']['database'];

    if ( $replace && $ignoreErrors ) {
        $ignoreErrors = false; // replace and ignore cannot be used at the same time
    }

    $addDropTable = ( $addDropTable ? '' : '--skip-add-drop-table --no-create-info' );
    $ignoreErrors = ( $ignoreErrors ? '--insert-ignore' : '' );
    $fullInsert = ( $fullInsert ? '--skip-extended-insert --complete-insert' : '' );
    $lockTables = ( $lockTables ? '' : '--skip-add-locks' );
    $replace = ( $replace ? "--replace" : "" );
    $where = ( $where == '' ? '' : "--where \"{$where}\" " );

    $cmd = "mysqldump --skip-comments {$addDropTable} {$ignoreErrors} {$fullInsert}  {$lockTables} {$replace} "
        ."--host={$dbHost} '--user={$dbUser}' '--password={$dbPass}' {$dbDatabase} {$tables} {$where} ";

    return shell_exec($cmd);
}

function usa_data_migration_getAllFieldTables() {

    $ret = array();

    foreach ( db_query("SHOW TABLES") as $tbl ) {
        
        $tblInfo = array_values( (array) $tbl );
        $tbl = $tblInfo[0];
        
        // If this one of the field_revision_field_* or field_data_field_* tables...
        if ( strpos($tbl, 'field_revision_field_') !== false || strpos($tbl, 'field_data_field_') !== false ) {
        
            // If this table has entity_id and entity_type fields...
            if ( db_field_exists($tbl, 'entity_id') && db_field_exists($tbl, 'entity_type') ) {
                $ret[] = $tbl;
            }
        }
    }

    return $ret;
}

/**
 *  void usa_data_migration_ensureTaxonomyDateTableExsists()
 *
 *  This just makes sure this table exists in MySQL, and creates it if it is not
 */
function usa_data_migration_ensureTaxonomyDateTableExsists() {
    db_query("
        CREATE TABLE IF NOT EXISTS taxonomy_dates (
            tid INT UNSIGNED NOT NULL,
            created INT NOT NULL DEFAULT '0',
            changed INT NOT NULL DEFAULT '0',
            PRIMARY KEY (tid) ,
            INDEX (created,changed)
        )
    ");
}

/**
 *  void usa_data_migration_ensureTaxonomyDateTableExsists()
 *
 *  This just makes sure this table has the type column (like this table does in the CMP)
 */
function usa_data_migration_ensureFileManagedTableHasTypeField() {

    if ( !db_field_exists('file_managed', 'type')  ) {

        db_query("ALTER TABLE file_managed ADD type VARCHAR(50) NOT NULL");
    }
}