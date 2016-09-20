<?php

function usa_data_migration_triggerUpdatePullOnAllChildSites($killThreadOnComplete = true) {

    $ret = '';

    // Post debug into into Slack
    $thisFunct = __FUNCTION__;
    if(usa_data_migration_should_slack()){
        slack_send_message(
            slack_get_default_webhook_url(),
            "Notice: {$thisFunct}() has triggered ".( isset($_SESSION['udm_push_eid']) ? "since {$_SESSION['udm_push_type']} {$_SESSION['udm_push_eid']} was modified." : "[via cron]."),
            "#cmp-notify-verbose",
            $_SERVER['HTTP_HOST'],
            ['type'=>'','icon'=>0,'emoji'=>0]
        );
    }
    // Lets not bee too trigger-happy - don't poke the child-sites any more than once every minute
    $lastTUPOACS = variable_get('udm_last_tupoacs', -3);
    $lastTUPOACS_ago = time() - $lastTUPOACS;
    if ( -1 < $lastTUPOACS_ago && $lastTUPOACS_ago < 60 ) {
        $ret = 'NOT BOTHERING TO INVOKE CHILD-SITES - this has been done (by server/CMP) too recently.';
    } else {

        // Unset session variables that tell client browsers to trigger this function through AJAX
        if ( isset($_SESSION['udm_push_eid']) ) {
            unset($_SESSION['udm_push_eid']);
        }
        if ( isset($_SESSION['udm_push_type']) ) {
            unset($_SESSION['udm_push_type']);
        }

        // Run through each child-site
        $targets = explode("\n", variable_get('udm_push_targets', ''));
        foreach ($targets as $target) {
            if ( empty($target) ) { continue; }
            $arrContextOptions=array(
                "ssl"=>array(
                    "verify_peer"=>false,
                    "verify_peer_name"=>false,
                ),
            );

            $ret .= "Invoked site: {$target}\n";

            // This next line is what triggers a child-site to do an update pull
            $ret .= "Its response was: ".file_get_contents($target, false, stream_context_create($arrContextOptions))."\n";
        }
    }

    // Kill thread (assuming this function was called from an AJAX request)
    if ( $killThreadOnComplete ) {
        @ob_end_clean();
        while ( @ob_end_clean() );
        print trim($ret);
        exit();
    }

    return trim($ret);
}

/*
 * Implements HOOK_taxonomy_term_delete
 */
function usa_data_migration_taxonomy_term_delete($term) {

    // Bail if we are not a content-server
    if ( intval(variable_get('udm_allow_pull', 0)) === 0 ) {
        return;
    }

    $tidsDeleted = variable_get('udm_tidsDeleted', array());
    // Limit tracking to the last 50 terms to save db space
    $tidsDeleted = array_slice($tidsDeleted, -50);
    $tidsDeleted[$term->tid] = $term->tid;
    variable_set('udm_tidsDeleted', $tidsDeleted);

    error_log(__FUNCTION__."() triggered, udm_tidsDeleted drupal-variable now has {$term->tid} in its array.");

    usa_data_migration_schedualTriggerChildPull($term, 'taxonomy_term');

}

/*
 * Implements HOOK_entity_delete
 */
function usa_data_migration_entity_delete($entity, $type) {

    // Track node deletions
    if ( !empty($entity->nid) ) {
        $nidsDeleted = variable_get('udm_nidsDeleted', array());
        // Limit tracking to the last 50 nodes to save db space
        $nidsDeleted = array_slice($nidsDeleted, -50);
        $nidsDeleted[] = $entity->nid;
        variable_set('udm_nidsDeleted', $nidsDeleted);
        usa_data_migration_schedualTriggerChildPull($entity, 'node');
    }

    // Track taxonomy deletions
    if ( !empty($entity->tid) ) {
        $tidsDeleted = variable_get('udm_tidsDeleted', array());
        // Limit tracking to the last 50 terms to save db space
        $tidsDeleted = array_slice($tidsDeleted, -50);
        $tidsDeleted[$entity->tid] = $entity->tid;
        variable_set('udm_tidsDeleted', $tidsDeleted);
        error_log(__FUNCTION__.'() triggered, udm_tidsDeleted is now: '.print_r($tidsDeleted, true));
        usa_data_migration_schedualTriggerChildPull($entity, 'taxonomy_term');
    }

}

/*
 * array usa_data_migration_getDeletedNodes()
 *
 * Returns an array of dead node-IDs
 */
function usa_data_migration_getDeletedNodes() {

    $ret = array();

    // To make sure we're not crazy, well check and make sure the given entity-id truley is dead
    foreach ( variable_get('udm_nidsDeleted', array()) as $nid ) {
        $nidExsists = db_query("SELECT COUNT(*) FROM node WHERE nid={$nid} ")->fetchColumn();
        if ( intval($nidExsists) === 0 ) {
            $ret[] = $nid;
        }
    }

    return $ret;
}

/*
 * array usa_data_migration_getDeletedTerms()
 *
 * Returns an array of dead term-IDs
 */
function usa_data_migration_getDeletedTerms() {

    $ret = array();

    // To make sure we're not crazy, well check and make sure the given entity-id truley is dead
    foreach ( variable_get('udm_tidsDeleted', array()) as $tid ) {
        $tidExsists = db_query("SELECT COUNT(*) FROM taxonomy_term_data WHERE tid={$tid} ")->fetchColumn();
        if ( intval($tidExsists) === 0 ) {
            $ret[] = $tid;
        }
    }

    return $ret;
}

/*
 * Implements HOOK_taxonomy_term_update
 */
function usa_data_migration_taxonomy_term_update($term) {

    usa_data_migration_updateTopLevelTaxonomyNameTbl( array($term->tid) );
    usa_data_migration_schedualTriggerChildPull($term, 'taxonomy_term');

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

    usa_data_migration_updateTopLevelTaxonomyNameTbl( array($term->tid) );
    usa_data_migration_schedualTriggerChildPull($term, 'taxonomy_term');

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
    usa_data_migration_schedualTriggerChildPull($node, 'node');
}

/*
 * Implements HOOK_node_insert
 */
function usa_data_migration_node_update($node) {

    /* When a new revision is added to a node, in certain edge cases, the node's "changed" field is not updated,
    which can cause a node to be missed by childsite update-pulls. We will fix this here. */
    if ( !empty($node->nid) ) {
        $nowTime = time();
        db_query("UPDATE node SET changed={$nowTime} WHERE nid={$node->nid}");
    }
}

/*
 * Implements HOOK_workbench_moderation_transition
 */
function usa_data_migration_workbench_moderation_transition($entity, $fromState, $toState) {

    /* When a work-flow state [alone] is changed, in certain edge cases, the node's "changed" field is not updated,
    which can cause a node to be missed by childsite update-pulls. We will fix this here. */
    if ( !empty($entity->nid) ) {
        $nowTime = time();
        db_query("UPDATE node SET changed={$nowTime} WHERE nid={$entity->nid}");
    }

    usa_data_migration_schedualTriggerChildPull($entity, 'node');
}

/*
 * void usa_data_migration_pushEntity(object $entity)
 *
 * Pushes a node or taxonomy-term out to child sites when nessesary
 */
function usa_data_migration_schedualTriggerChildPull($entity, $entityType) {

    $thisFunct = __FUNCTION__;

    // Bail if we are not setup as the content-server
    if ( intval(variable_get('udm_do_push', false)) === 0 ) {
        return;
    }

    // Are we supposed to server this bundle-type?
    if ( $entityType === 'taxonomy_term' && intval(variable_get('udm_serv_taxonomy', 0)) === 0 ) {
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
    // Validation
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
    if ( !empty($_REQUEST['taxTpLvlParentNameFilter']) ) {
        @ob_end_clean();
        while (@ob_end_clean());
        $taxTpLvlParentNameFilter = trim($_REQUEST['taxTpLvlParentNameFilter']);
    } else {
        $taxTpLvlParentNameFilter = false;
    }

    if ( empty($_REQUEST['size']) || intval($_REQUEST['size']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad size argument in request - this argument must be an integer greater than 0";
        exit();
    }

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

    // Init
    global $databases;
    $cmpDbName = $databases['default']['default']['database'];
    $allowedTaxFilters = db_query("
        SELECT d.name
        FROM `{$cmpDbName}`.taxonomy_term_data d
    	     JOIN `{$cmpDbName}`.taxonomy_term_hierarchy h
                ON (d.tid=h.tid)
        WHERE d.vid=42 and parent=0
    ")->fetchCol();
    if ( !empty($allowedTaxFilters) )
    {
        $allowedTaxFilters = array_flip($allowedTaxFilters);
    }
    if ( !empty($taxTpLvlParentNameFilter) && !isset($allowedTaxFilters[$taxTpLvlParentNameFilter]) )
    {
        @ob_end_clean(); while (@ob_end_clean());
        header('Content-Type: text');
        exit('Access Denied: Invalid security key');
    }
    $doLocalPush = ( intval(variable_get('udm_do_localpush', 0)) === 0 ? false : true );
    $returnData = array();
    $batch = intval(preg_replace('/\D/','',$_REQUEST['batch']));
    $size  = intval(preg_replace('/\D/','',$_REQUEST['size']));
    $since = intval(preg_replace('/\D/','',$_REQUEST['since']));

    // Obtain code used with the "Bundle Copy" module, to export/import taxonomy fields STRUCTURE (struct only, no field data)
    if ( $batch === 1 ) {
        $returnData['taxFieldStructure_BundleImportCode'] = usa_data_migration_getExportTaxonomyStructureCode();
    }

    // $taxTpLvlParentNameFilter = mysqli::real_escape_string($taxTpLvlParentNameFilter);
    // die("DIE:<pre>$taxTpLvlParentNameFilter\n");

    /* GET THE TIDS OF TERMS TO PUSH OUT */
    // If a since argument is given, then we are only processing recently changed terms
    $tidParams = [];
    if ( empty($since) ) {
        if ( empty($taxTpLvlParentNameFilter) ) {
            $tidQuery = "SELECT tid FROM `{$cmpDbName}`.taxonomy_term_data";
        } else {
            $tidQuery = "SELECT tid FROM `{$cmpDbName}`.taxonomy_tlt_name WHERE tlt_name='$taxTpLvlParentNameFilter' OR tlt_name='ALL'";
        }
    } else {
        $since = intval(preg_replace('/\D/','',$_GET['since']));
        #$since = mysqli::escape_string($since);
        if ( $taxTpLvlParentNameFilter === false ) {
            /* EDNARK: BAD DALE never from GET straight into query */
            $tidQuery = "SELECT d.tid FROM `{$cmpDbName}`.taxonomy_dates d WHERE d.changed > $since OR d.created > $since";
        } else {
            /* EDNARK: BAD DALE never from GET straight into query */
            $tidQuery = "SELECT d.tid FROM `{$cmpDbName}`.taxonomy_dates d LEFT JOIN `{$cmpDbName}`.taxonomy_tlt_name tltn ON (tltn.tid=d.tid) WHERE ( d.changed > $since OR d.created > $since ) AND (tltn.tlt_name = '$taxTpLvlParentNameFilter' OR tltn.tlt_name = 'ALL') ";
        }
    }
    // If we are NOT doing a "Local-Push", then we need to work in batches
    if ( $doLocalPush == false ) {
        $offset = ($batch - 1) * $size;
        $tidQuery .= " LIMIT $offset,$size";
    }

    $returnData['debug_tidQuery'] = $tidQuery;

    // Place the term-ids to push into a temporary-table (that MySqlDump will read from)
    if ( $doLocalPush == false ) {
        $tmpTableName = 'udmEntities_'.uniqid();
        $query = "CREATE TABLE {$tmpTableName} (entity_id INT)";
        db_query($query);
        $query = "INSERT INTO {$tmpTableName} {$tidQuery} ";
        db_query($query);
    }

    // The childsite needs to know what term-IDs have been supplied in this sync, so it can run post-sync processes on these terms
    $tids = db_query($tidQuery,$tidParams)->fetchCol();
    $tidList = implode(',', $tids);
    $returnData['TaxDump_tidList'] = $tidList;

    // A dump of MySQL commands shall be stored here, anything in this will be consumed into MySql on the childsite
    $returnData['TaxDump_sqlDump'] = '';

    // If there is no more nodes [in this batch], bail
    if ( count($tids) === 0 ) {

        /* Unless batch is == 1. This is because we want to push at least 1 batch out, just in case
        nothing has been added/changed but there are deleted items to push. */
        if ( $batch === 1 ) {
            $returnData['TaxDump_sqlDump'] .= "# No new entity data in this batch, not blocking because "
                ."this is the first batch (and the first batch is special)\n\n";
        } else {
            @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
            exit('NO MORE DATA');
        }
    }

    // If we are doing a "Local Push", then all content is migrated over in the 1st batch, bail on any higher batch-request
    if ( $doLocalPush && $batch > 1 ) {
        @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
        exit('NO MORE DATA');
    }

    // Dump SQL commands to removerecently deleted terms in the CMP, from the childsite.
    // Note that the usa_data_migration_getDeletedTerms() function may return up to the 50 most deleted terms (no more)
    if ( $batch === 1 ) {
        $tidsKilled = usa_data_migration_getDeletedTerms();
        $listTidsKilled = implode(',',$tidsKilled);
        if ( trim($listTidsKilled) !== '' ) {
            $returnData['TaxDump_sqlDump'] .= "DELETE from taxonomy_term_data WHERE tid IN ({$listTidsKilled});\n\n";
        }
    }

    // Dump taxonomy-creation/modification dates table
    if ( $batch === 1 ) {
        $returnData['TaxDump_sqlDump'] .= "\nTRUNCATE TABLE taxonomy_dates;\n";
        if ( $doLocalPush ) {
            $returnData['TaxDump_sqlDump'] .= "INSERT INTO taxonomy_dates SELECT * FROM `{$cmpDbName}`.taxonomy_dates; \n";
        } else {
            $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump("taxonomy_dates", '', false, true, true, false, false) . "\n";
        }
    }

    // taxonomy_term_data, taxonomy_index, taxonomy_term_hierarchy
    if ( $doLocalPush ) {
        $returnData['TaxDump_sqlDump'] .=
            "\n"
            ."DELETE FROM taxonomy_term_data WHERE tid IN ({$tidQuery}); \n"
            ."INSERT INTO taxonomy_term_data SELECT * FROM `{$cmpDbName}`.taxonomy_term_data cmp WHERE cmp.tid IN ({$tidQuery}); \n"
            ."\n"
            ."DELETE FROM taxonomy_index WHERE tid IN ({$tidQuery}); \n"
            ."INSERT INTO taxonomy_index SELECT * FROM `{$cmpDbName}`.taxonomy_index cmp WHERE cmp.tid IN ({$tidQuery}); \n"
            ."\n"
            ."DELETE FROM taxonomy_term_hierarchy WHERE tid IN ({$tidQuery}); \n"
            ."INSERT INTO taxonomy_term_hierarchy SELECT * FROM `{$cmpDbName}`.taxonomy_term_hierarchy cmp WHERE cmp.tid IN ({$tidQuery}); \n"
            ."\n";
    } else {
        $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump(
            "taxonomy_term_data taxonomy_index taxonomy_term_hierarchy",
            "tid IN (SELECT entity_id FROM {$tmpTableName}) ",
            false,
            true,
            true,
            false
        ) . "\n";
    }

    if ( $batch === 1 ) {
        // Bundleug killer - for any [exsisting] term that does exsist on the childsite, force-update its weight value
        $taxDatas = db_query("SELECT tid, weight FROM taxonomy_term_data");
        foreach ( $taxDatas as $taxData ) {
            $returnData['TaxDump_sqlDump'] .= "UPDATE taxonomy_term_data SET weight={$taxData->weight} WHERE tid={$taxData->tid};\n";
        }
    }

    // Get a list of all field-data/revision tables that contain information for the interested terms
    $dumpFieldTables = array();
    $fieldTables = usa_data_migration_getAllFieldTables();
    foreach ( $fieldTables as $fieldTable ) {
        if ( $doLocalPush ) {
            $tblHasdDataForTheseTerms = db_query("
                SELECT COUNT(*)
                FROM {$fieldTable}
                WHERE entity_id IN ({$tidQuery}) AND entity_type='taxonomy_term'
            ")->fetchColumn();
        } else {
            $tblHasdDataForTheseTerms = db_query("
                SELECT COUNT(*)
                FROM {$fieldTable}
                WHERE entity_id IN (SELECT entity_id FROM {$tmpTableName}) AND entity_type='taxonomy_term'
            ")->fetchColumn();
        }
        if ( intval($tblHasdDataForTheseTerms) > 0 ) {
            $dumpFieldTables[] = $fieldTable;
        }
    }

    if ( $doLocalPush ) {

        foreach ($dumpFieldTables as $dumpFieldTable) {
            $returnData['TaxDump_sqlDump'] .=
                "DELETE FROM {$dumpFieldTable} WHERE entity_type = 'taxonomy_term' AND entity_id IN ({$tidQuery}); \n"
                ."INSERT INTO {$dumpFieldTable} SELECT * FROM `{$cmpDbName}`.{$dumpFieldTable} cmp WHERE cmp.entity_type = 'taxonomy_term' AND cmp.entity_id IN ({$tidQuery}); \n"
                ."\n";
        }

    } else {

        // Dump field-data/revision tables that contain information for the interested terms
        $returnData['TaxDump_sqlDump'] .= usa_data_migration_getMySQLDump(
            implode(' ', $dumpFieldTables),
            "entity_id IN (SELECT entity_id FROM {$tmpTableName}) ",
            false,
            true,
            true,
            false
        );
    }

    // Debug
    usa_data_migration_log("A foreign host requested a taxonomy-term dump ({$size} nodes, batch {$batch})");

    // Clean up
    if ( $doLocalPush == false ) {
        db_query("DROP TABLE {$tmpTableName}");
    }

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
    // Validation
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
        print "Missing or bad batch argument in request - this argument must be an integer greater than 0 ".print_r($_GET,1);
        usa_data_migration_error_log('Missing or bad batch argument in request');
        exit();
    }
    if ( empty($_REQUEST['size']) || intval($_REQUEST['size']) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Missing or bad size argument in request - this argument must be an integer greater than 0";
        usa_data_migration_error_log('Missing or bad size argument in request');
        exit();
    }

    if ( empty($_REQUEST['filter']) ) {
        $filter = false;
    } else {
        $filter = $_REQUEST['filter'];
    }

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

    // Init
    global $databases;
    $cmpDbName = $databases['default']['default']['database'];
    $doLocalPush = ( intval(variable_get('udm_do_localpush', 0)) === 0 ? false : true );
    $returnData = array();
    $batch = intval($_REQUEST['batch']);
    $size = intval($_REQUEST['size']);

    // Tell the child-site the name of this CMP database (used in the "Local Push" mode)
    $returnData['database_name'] = $cmpDbName;

    // Obtain code used with the "Bundle Copy" module, to export/import taxonomy fields STRUCTURE (struct only, no field data)
    if ( $batch === 1 ) {
        $returnData['nodeFieldStructure_BundleImportCode'] = usa_data_migration_getExportNodeStructureCode();
    }

    /* GET THE NIDS OF NODES TO PUSH OUT */
    $cTypeList = '\'' . implode("','", variable_get('udm_conttypes', array())) . '\'';
    if ( !empty($_REQUEST['type']) ) {
        $cTypeList = "'" . $_REQUEST['type'] . "'";
    }
    // If a since argument is given, then we are only processing recently changed terms
    if ( empty($_GET['since']) ) {
        if ( $filter === false ) {
            $nidQuery = "SELECT nid FROM `{$cmpDbName}`.node WHERE ( type IN ({$cTypeList}) OR type='directory_record_content_type' ) ";
        } else {
            $nidQuery = "SELECT nid FROM `{$cmpDbName}`.node n2 LEFT JOIN `{$cmpDbName}`.field_data_field_for_use_by ub ON (n2.nid=ub.entity_id) LEFT JOIN `{$cmpDbName}`.field_data_field_for_use_by_text ub2 ON (n2.nid=ub2.entity_id) WHERE n2.type IN ({$cTypeList}) AND (ub.field_for_use_by_value = '{$filter}' OR ub2.field_for_use_by_text_value = '{$filter}' OR n2.type='directory_record_content_type' )";
        }
    } else {
        if ( $filter === false ) {
            $nidQuery = "SELECT cn.nid FROM `{$cmpDbName}`.node cn WHERE cn.type IN ({$cTypeList}) AND (cn.changed > {$_GET['since']} OR cn.created > {$_GET['since']})";
        } else {
            $nidQuery = "SELECT nid FROM `{$cmpDbName}`.node n2 LEFT JOIN `{$cmpDbName}`.field_data_field_for_use_by ub ON (n2.nid=ub.entity_id) LEFT JOIN `{$cmpDbName}`.field_data_field_for_use_by_text ub2 ON (n2.nid=ub2.entity_id) WHERE n2.type IN ({$cTypeList}) AND ( ub.field_for_use_by_value = '{$filter}' OR ub2.field_for_use_by_text_value = '{$filter}' OR n2.type='directory_record_content_type' ) AND ( n2.changed > {$_GET['since']} OR n2.created > {$_GET['since']} ) ";
        }
    }
    // If we are NOT doing a "Local-Push", then we need to work in batches
    if ( $doLocalPush == false ) {
        $offset = ($batch - 1) * $size;
        $nidQuery .= " LIMIT {$offset},{$size}";
    }
    $returnData['debug_nidQuery'] = $nidQuery;
    // Place the node-ids to push into a temporary-table (that MySqlDump will read from)
    if ( $doLocalPush == false ) {
        $tmpTableName = 'udmEntities_'.uniqid();
        $query = "CREATE TABLE {$tmpTableName} (entity_id INT)";
        db_query($query); error_log($query);
        $query = "INSERT INTO {$tmpTableName} {$nidQuery} ";
        db_query($query); error_log($query);
    }

    // The childsite needs to know what node-IDs have been supplied in this sync, so it can run post-sync processes on these nodes
    $nids = db_query($nidQuery)->fetchCol();
    $nidList = implode(',', $nids);
    $returnData['NodeDump_nidList'] = $nidList;

    // If there are no more nodes [in this batch], bail
    if ( count($nids) === 0 ) {

        /* Unless batch is == 1. This is because we want to push at least 1 batch out, just in case
        nothing has been added/changed but there are deleted items to push. */
        if ( $batch === 1 ) {
            if ( !isset($returnData['NodeDump_sqlDump']) ) {
                $returnData['NodeDump_sqlDump'] = '';
            }
            $returnData['NodeDump_sqlDump'] .= "# No new entity data in this batch, not blocking because "
                ."this is the first batch (and the first batch is special)\n\n";
        } else {
            @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
            exit('NO MORE DATA');
        }
    }

    // If we are doing a "Local Push", then all content is migrated over in the 1st batch, bail on any higher batch-request
    if ( $doLocalPush && $batch > 1 ) {
        @ob_end_clean(); @ob_end_clean(); @ob_end_clean();
        exit('NO MORE DATA');
    }

    // Obtain S3 configuration
    if ( function_exists('_s3fs_get_config') ) {
       $returnData['s3Config'] = _s3fs_get_config();
    }

    // A dump of MySQL commands shall be stored here, anything in this will be consumed into MySql on the childsite
    $returnData['NodeDump_sqlDump'] = '';

    // Dump SQL commands to remove recently-deleted nodes in the CMP, from the childsite.
    // Note that the usa_data_migration_getDeletedNodes() function may return up to the 50 most deleted terms (no more)
    if ( $batch === 1 ) {
        $nidsKilled = usa_data_migration_getDeletedNodes();
        $listNidsKilled = implode(',',$nidsKilled);
        if ( trim($listNidsKilled) !== '' ) {
            $returnData['NodeDump_sqlDump'] .= "DELETE from node WHERE nid IN ({$listNidsKilled});\n\n";
        }
    }

    // file_managed, relation, relation_bundles, relation_revision, relation_type, field_data_endpoints, field_revision_endpoints
    if ( $batch === 1 ) {
        if ( $doLocalPush ) {
            $returnData['NodeDump_sqlDump'] .=
                "\n"
                ."DELETE FROM file_managed; \n"
                ."INSERT INTO file_managed SELECT * FROM `{$cmpDbName}`.file_managed; \n"
                ."\n"
                ."DELETE FROM relation; \n"
                ."INSERT INTO relation SELECT * FROM `{$cmpDbName}`.relation; \n"
                ."\n"
                ."DELETE FROM relation_bundles; \n"
                ."INSERT INTO relation_bundles SELECT * FROM `{$cmpDbName}`.relation_bundles; \n"
                ."\n"
                ."DELETE FROM relation_revision; \n"
                ."INSERT INTO relation_revision SELECT * FROM `{$cmpDbName}`.relation_revision; \n"
                ."\n"
                ."DELETE FROM relation_type; \n"
                ."INSERT INTO relation_type SELECT * FROM `{$cmpDbName}`.relation_type; \n"
                ."\n"
                ."DELETE FROM field_data_endpoints; \n"
                ."INSERT INTO field_data_endpoints SELECT * FROM `{$cmpDbName}`.field_data_endpoints; \n"
                ."\n"
                ."DELETE FROM field_revision_endpoints; \n"
                ."INSERT INTO field_revision_endpoints SELECT * FROM `{$cmpDbName}`.field_revision_endpoints; \n"
                ."\n";
        } else {
            $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
                "file_managed relation relation_bundles relation_revision relation_type field_data_endpoints field_revision_endpoints",
                '',
                false,
                true,
                true,
                false,
                true
            )."\n";
        }
    }

    // node, node_revision, node_access
    if ( $doLocalPush ) {

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "INSERT IGNORE INTO node SELECT * FROM `{$cmpDbName}`.node cmp WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "\n";

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node_revision WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "INSERT IGNORE INTO node_revision SELECT * FROM `{$cmpDbName}`.node_revision cmp WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "\n";

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node_access WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "INSERT IGNORE INTO node_access SELECT * FROM `{$cmpDbName}`.node_access cmp WHERE nid IN ({$nidQuery});\n";
        $returnData['NodeDump_sqlDump'] .= "\n";

    } else {

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node WHERE nid IN ({$nidList});\n";
        $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
            "node",
            "nid IN (SELECT entity_id FROM {$tmpTableName})",
            false,
            true,
            true,
            false,
            false
        )."\n";

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node_revision WHERE nid IN ({$nidList});\n";
        $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
            "node_revision",
            "nid IN (SELECT entity_id FROM {$tmpTableName}) AND vid = (SELECT n2.vid FROM node n2 WHERE n2.nid = node_revision.nid)",
            false,
            true,
            true,
            false,
            false
        )."\n";

        $returnData['NodeDump_sqlDump'] .= "DELETE FROM node_access WHERE nid IN ({$nidList});\n";
        $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
            "node_access",
            "nid IN (SELECT entity_id FROM {$tmpTableName})",
            false,
            true,
            true,
            false,
            false
        )."\n";
    }

    // Wipe the UID info from node on the child-site
    $returnData['NodeDump_sqlDump'] .=
        "\n"
        ."UPDATE node SET uid = 1; \n"
        ."UPDATE node_revision SET uid = 1;\n\n";

    // Get a list of all field-data/revision tables that contain information for the interested nodes
    $dumpFieldTables = array();
    $fieldTables = usa_data_migration_getAllFieldTables();
    array_unshift($fieldTables, 'field_data_body');

    // Prioritize field_revison_field_* tables first (before field_data_field_* tables)
    foreach ($fieldTables as $index => $fieldTable) {
        if ( strpos($fieldTable, 'field_revision_field_') !== false ) {
            unset( $fieldTables[$index] ); // removes this element [from its current position]
            array_unshift($fieldTables, $fieldTable); // prepends this element back into the array [at the beginning]
        }
    }

    // If we have nodes to dump, dump each field for this node
    if ( !empty($nidList) ) {

        foreach ( $fieldTables as $fieldTable ) {

            $tblHasdDataForTheseNodes = db_query("
                SELECT COUNT(*)
                FROM {$fieldTable}
                WHERE entity_id IN ({$nidQuery}) AND entity_type='node'
            ")->fetchColumn();
            if ( intval($tblHasdDataForTheseNodes) > 0 ) {

                if ( $doLocalPush ) {

                    // If a nodes has [historically] had information in this field, wipe information for this node in this field
                    // This is to catch edge-cases where information in a field has been erased in the current/published node-revision
                    if ( strpos($fieldTable, 'field_revision_field_') !== false ) {
                        $dataField = str_replace('field_revision_field_', 'field_data_field_', $fieldTable);
                        $returnData['NodeDump_sqlDump'] .=
                            "DELETE IGNORE FROM {$dataField} WHERE entity_type = 'node' AND entity_id IN ({$nidQuery}); \n";
                    }

                    $returnData['NodeDump_sqlDump'] .=
                        "DELETE FROM {$fieldTable} WHERE entity_type = 'node' AND entity_id IN ({$nidQuery}); \n"
                        ."INSERT INTO {$fieldTable} SELECT * FROM `{$cmpDbName}`.{$fieldTable} cmp WHERE cmp.entity_type = 'node' AND cmp.entity_id IN ({$nidQuery}); \n"
                        ."\n";

                } else {

                    // If a nodes has [historically] had information in this field, wipe information for this node in this field
                    // This is to catch edge-cases where information in a field has been erased in the current/published node-revision
                    if ( strpos($fieldTable, 'field_revision_field_') !== false ) {
                        $dataField = str_replace('field_revision_field_', 'field_data_field_', $fieldTable);
                        $returnData['NodeDump_sqlDump'] .=
                            "DELETE IGNORE FROM {$dataField} WHERE entity_type = 'node' AND entity_id IN ({$nidList});\n";
                    }

                    $returnData['NodeDump_sqlDump'] .= "\nDELETE FROM {$fieldTable} WHERE entity_type = 'node' AND entity_id IN ({$nidList});\n";
                    $returnData['NodeDump_sqlDump'] .= usa_data_migration_getMySQLDump(
                        $fieldTable,
                        "entity_id IN (SELECT entity_id FROM {$tmpTableName}) AND revision_id = (SELECT n2.vid FROM node n2 WHERE n2.nid = entity_id)",
                        false,
                        true,
                        true,
                        false
                    );
                }

            }
        }
    }

    // Debug
    usa_data_migration_log("A foreign host requested a node dump ({$size} nodes, batch {$batch})");

    // Clean up
    if ( $doLocalPush == false ) {
        db_query("DROP TABLE {$tmpTableName}");
    }

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

    $cmd = "mysqldump --single-transaction --skip-comments {$addDropTable} {$ignoreErrors} {$fullInsert}  {$lockTables} {$replace} "
        ."--host={$dbHost} '--user={$dbUser}' '--password={$dbPass}' {$dbDatabase} {$tables} {$where} ";

    error_log(__FUNCTION__.'() triggered, pulling a MySqlDump with command: '.$cmd);
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
 * void usa_data_migration_updateTopLevelTaxonomyNameTbl()
 *
 * This function will lookup the highest parent of each
 * term given, and update the taxonomy_tlt_name table
 */
function usa_data_migration_updateTopLevelTaxonomyNameTbl($tids) {

    usa_data_migration_ensureTaxonomyTLTNameTableExsists();

    $siteStructVocab = taxonomy_vocabulary_machine_name_load('site_strucutre_taxonomy');
    $siteStructVocabId = $siteStructVocab->vid;

    foreach ( $tids as $tid ) {

        $vocabId = db_query("SELECT vid FROM taxonomy_term_data WHERE tid={$tid}")->fetchColumn();
        if ( intval($siteStructVocabId) === intval($vocabId) ) {
            // then this is a site-structure taxonomy-term
            $parents = taxonomy_get_parents_all($tid);
            $topLevelParent = $parents[ count($parents) - 1 ];
            $tltName = $topLevelParent->name;
        } else {
            // then this is NOT a site-structure taxonomy-term, this is under some different vocab
            $tltName = 'ALL';
        }

        db_query("DELETE FROM taxonomy_tlt_name WHERE tid = {$tid}; ");
        db_query("INSERT IGNORE INTO taxonomy_tlt_name (tid, tlt_name) VALUES ({$tid}, '{$tltName}'); ");

    }

}

/**
 *  void usa_data_migration_ensureTaxonomyTLTNameTableExsists()
 *
 *  This just makes sure this table exists in MySQL, and creates it if it is not
 */
function usa_data_migration_ensureTaxonomyTLTNameTableExsists() {
    db_query("
        CREATE TABLE IF NOT EXISTS taxonomy_tlt_name (
            tid INT UNSIGNED NOT NULL,
            tlt_name TEXT NOT NULL,
            PRIMARY KEY (tid)
        )
    ");
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
