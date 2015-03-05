<?php

/**
 *  void usa_data_migration_updatePull()
 *
 * Pulls nodes and taxonomy terms from the CMP into this environment
 * This function will only pull entities on the CMP that have been changed since 
 * the last time this function was called.
 *
 * @param bool $security - Set to false to ignore security key (force run)
 */
function usa_data_migration_updatePull($security = true, $terminateThreadOnCompletion = true) {

    $thisFunct = __FUNCTION__;

    // Make sure we are the client
    if ( intval(variable_get('udm_do_pull', false)) === 0 ) {
        @ob_end_clean();
        while (@ob_end_clean());
        print "Service not enabled";
        exit();
    }

    // Security validation
    if ( $security && variable_get('udm_push_security_key', '') !== '' ) { // If we expect a security key...

        // If no key provided, or the key is not matching what we expect...
        if ( empty($_REQUEST['key']) || trim($_REQUEST['key']) !== trim(variable_get('udm_push_security_key', '')) ) {
            usa_data_migration_log(
                "A request was made to push a taxonomy entity into this environment, which was REJECTED due to "
                    ."a missing or invalid security-key."
            );
            @ob_end_clean();
            while (@ob_end_clean());
            header('Content-Type: text');
            exit('Access Denied: Invalid security key');
        }
    }

    // Dont pull if there may be another thread doing a pull right now
    $since = variable_get('udm_last_pull_time', 0);
    if ( time() - $since > 8 || $since == 0 ) { 
        $since = intval($since) - 1800; // 1800 = 30 mins
        $since = ( $since < 0 ? 0 : $since );
        error_log('since is: ' . (time() - $since));
    } else {
        @ob_end_clean();
        while (@ob_end_clean());
        header('Content-Type: text');
        exit('too soon');
    }

    // Execute node update/pull
    $target = variable_get('udm_pull_from_nodetarget');
    usa_data_migration_synchNodesFromTarget($target, true, 100, 0, $since, true);

    // Execute taxonomy update/pull
    $target = variable_get('udm_pull_from_taxtarget');
    usa_data_migration_synchTaxonomyFromTarget($target, true, 100, $since, true);

    // Return
    if ( $terminateThreadOnCompletion ) {
        @ob_end_clean();
        while (@ob_end_clean());
        header('Content-Type: text');
        exit('done');
    } else {
        drupal_set_message(__FUNCTION__.'() has completed.', 'status');
    }
}

/**
 *  bool/string usa_data_migration_synchTaxonomyFromTarget()
 *
 * This function will attempt to pull a dump of taxonomy-related tables from the target
 * and synch it into this environment. This function returns TRUE on success, and a 
 * string on failure (depending on the $retTrueOnSuccess argument).
 */
function usa_data_migration_synchTaxonomyFromTarget($taxonomyDataSource, $retTrueOnSuccess = true, $batchSize = 100, $since = 0, $quick = false, $maxBatch = 0) {

    // Debug for devs who tail the PHP error_log
    $thisFunct = __FUNCTION__;
    $strQuickMode = ( $quick ? ' (in quick mode) ' : '' );
    usa_data_migration_error_log("Notice: {$thisFunct} is pulling taxonomy information {$strQuickMode} from {$taxonomyDataSource}");

    // Tell the USA Taxonomy Man module to not execute on term-hook for this batch process
    global $utm_norun;
    $utm_norun = true;

    // Init
    $batch = 1;
    $size = $batchSize;

    // Pull data
    $taxonomyDataSource .= ( strpos($taxonomyDataSource, '?') === false ? '?' : '&' ) . 'machineReadable=1';

    // Pass since argument
    if ( intval($since) > 0 ) {
        $taxonomyDataSource .= '&since='.$since;
    }

    $tidsPulled = array();
    while ( true ) {

        // Ensure we dont time out
        set_time_limit(500);

        // Note that at this time is when the last pull has occurred
        variable_set('udm_last_pull_time', time() );

        // Target location
        $batchURL = $taxonomyDataSource . "&batch={$batch}&size={$size}";
        //error_log($batchURL);
        $pullString = file_get_contents($batchURL);
        $batch++; // The next run of the loop shall pull the next $size nodes

        if ( $maxBatch > 0 && ($batch+1) > $maxBatch ) {
            usa_data_migration_error_log(__FUNCTION__." broke loop on maxBatch - not processing batch ".$batch);
            break;
        }

        // Validate data
        if ( $pullString === false ) {
            $msg = "Error - {$thisFunct} could not obtain data from {$batchURL}";
            usa_data_migration_log($msg);
            usa_data_migration_error_log($msg);
            return $msg;
        }

        // Break if we are done 
        if ( strpos($pullString, 'NO MORE DATA') !== false ) {
            usa_data_migration_error_log(__FUNCTION__." broke loop on completion ".$batch);
            break;
        }

        // Typecast and validate data
        $pullData = @unserialize($pullString);
        unset($pullString); // free memory
        if ( $pullData === false ) {
            $msg = "Error - {$thisFunct} pull malformed data from {$batchURL}";
            usa_data_migration_log($msg);
            usa_data_migration_error_log($msg);
            return $msg;
        }

        // Remove all data terms in this environment which are incoming (we dont want things to collide)
        db_query("DELETE FROM taxonomy_term_data WHERE tid IN ({$pullData['TaxDump_tidList']}) ");
        cleanup_killOrphanedTaxonomyData();
        cleanup_killOrphanedFieldData();
        
        // Synch node [field] structure into this environment 
        if ( $quick != true && !empty($pullData['taxFieldStructure_BundleImportCode']) ) {
            usa_data_migration_importStructureWithCode( $pullData['taxFieldStructure_BundleImportCode'] );
            taxonomy_vocabulary_static_reset();
            taxonomy_terms_static_reset();
            field_cache_clear();
            usa_data_migration_log("Imported taxonomy structure from remote host");
        }

        // Synch terms into this environment
        db_query( $pullData['TaxDump_sqlDump'] );
        entity_get_controller('taxonomy_term')->resetCache();
        //usa_data_migration_log("Consumed MySQL batch dump: {$batch}");

        // Log
        $tidsPulled = array_merge($tidsPulled, explode(',', $pullData['TaxDump_tidList']));
        error_log('Pulled these terms from the host-site: '.$pullData['TaxDump_tidList']);

    }

    // Run cleanup process
    //usa_data_migration_error_log("Cleaning up");
    cleanup_killOrphanedNodeRevisions();
    cleanup_killOrphanedTaxonomyData();
    cleanup_killOrphanedFieldData();
    //usa_data_migration_error_log("Clean-up complete");

    // Exclaim finish message
    $msg = "{$thisFunct}() has finished importing terms.";
    usa_data_migration_log($msg);
    usa_data_migration_error_log("Notice: " . $msg);

    // Taxonomy-pull post-synch processes
    cleanup_killOrphanTaxonomyTerms(); // TO ONLY BE RUN AFTER A COMPLETE SYNCH!
    usa_data_migration_filterTaxonomy();
    if ( $quick != true ) {

        usa_data_migration_postSynch_taxonomyTermsFriendlyAliases();

        if ( function_exists('usa_tax_man_deleteAllGeneratedMenuItems') ) {
            global $utm_norun;
            $utm_norun = false;
            usa_tax_man_deleteAllGeneratedMenuItems();
            usa_tax_man_createMenusFromTaxonomy();
        }
    } else {
        usa_data_migration_postSynch_taxonomyTermsFriendlyAliases( $tidsPulled );
    }

    // Return
    if ( $retTrueOnSuccess ) {
        return true;
    } else {
        return $msg;
    }
}

/**
 *  bool/string usa_data_migration_synchNodesFromTarget()
 *
 * This function will attempt to pull a dump of node from the target
 * and synch it into this environment. This function returns TRUE on success, and a 
 * string on failure (depending on the $retTrueOnSuccess argument)
 */
function usa_data_migration_synchNodesFromTarget($nodeDataSource, $retTrueOnSuccess = true, $batchSize = 100, $maxBatch = 0, $since = 0, $quick = false) {

    // Debug for devs who tail the PHP error_log
    $thisFunct = __FUNCTION__;
    usa_data_migration_error_log("Notice: {$thisFunct} is pulling node information from {$nodeDataSource}");

    // Init
    $batch = 1;
    $size = $batchSize;

    // Pull data
    $nodeDataSource .= ( strpos($nodeDataSource, '?') === false ? '?' : '&' ) . 'machineReadable=1';

    // Make sure our table structures match with the structures on CMP
    usa_data_migration_ensureExpectedTableStructure();

    // Pass since argument (if we are doing an update-pull)
    if ( intval($since) > 0 ) {
        $nodeDataSource .= '&since='.$since;
    }

    while ( true ) {

        // Ensure we dont time out
        set_time_limit(500);

        // Note that at this time is when the last pull has occurred
        variable_set('udm_last_pull_time', time() );

        // Target location
        $batchURL = $nodeDataSource . "&batch={$batch}&size={$size}";
        //error_log($batchURL);
        $pullString = file_get_contents($batchURL);
        $batch++; // The next run of the loop shall pull the next $size nodes

        if ( $maxBatch > 0 && ($batch+1) > $maxBatch ) {
            usa_data_migration_error_log(__FUNCTION__." broke loop on maxBatch - not processing batch ".$batch);
            break;
        }

        // Validate data
        if ( $pullString === false ) {
            $msg = "Error - {$thisFunct} could not obtain data from {$batchURL}";
            usa_data_migration_log($msg);
            usa_data_migration_error_log($msg);
            return $msg;
        }

        // Break if we are done 
        if ( strpos($pullString, 'NO MORE DATA') !== false ) {
            usa_data_migration_error_log(__FUNCTION__." broke loop on completion ".$batch);
            break;
        }

        // Typecast and validate data
        $pullData = @unserialize($pullString);
        unset($pullString); // free memory
        if ( $pullData === false ) {
            $msg = "Error - {$thisFunct} pull malformed data from {$batchURL}";
            usa_data_migration_log($msg);
            usa_data_migration_error_log($msg);
            return $msg;
        }
        
        // If S3 settings information was given, save them into a Drupal-var
        if ( !empty($pullData['s3Config']) ) {
            variable_set('cmp_s3_config', $pullData['s3Config']);
        }

        // Synch node [field] structure into this environment 
        if ( $quick != true && !empty($pullData['nodeFieldStructure_BundleImportCode']) ) {
            usa_data_migration_importStructureWithCode( $pullData['nodeFieldStructure_BundleImportCode'] );
            field_cache_clear();
            usa_data_migration_log("Imported node structure from remote host");
        }

        // Synch nodes into this environment
        db_query( $pullData['NodeDump_sqlDump'] );
        db_query('UPDATE node SET uid = 1; ');
        db_query('UPDATE node_revision SET uid = 1; ');
        entity_get_controller('node')->resetCache();
        //usa_data_migration_log("Consumed MySQL batch dump: {$batch}");

        // Clear field cache for all synched nodes
        foreach ( explode(',', $pullData['NodeDump_nidList']) as $nid ) {
            db_query("DELETE FROM cache_field WHERE InStr(cid, '{$nid}')<>0;");
        }

        // Log
        error_log('Pulled these nodes from the host-site: '.$pullData['NodeDump_nidList']);

    }

    // Run cleanup process
    //usa_data_migration_error_log("Cleaning up");
    cleanup_killOrphanedNodeRevisions();
    cleanup_killOrphanedFieldData();
    //usa_data_migration_error_log("Clean-up complete");

    // Prost run process for node-pulls
    if ( $quick != true ) {
        usa_data_migration_postSynch_s3translate();
    }

    // Exclaim finish message
    $msg = "{$thisFunct}() has finished importing nodes.";
    usa_data_migration_log($msg);
    usa_data_migration_error_log("Notice: " . $msg);

    if ( $retTrueOnSuccess ) {
        return true;
    } else {
        return $msg;
    }
}

/*
 * void usa_data_migration_ensureExpectedTableStructure()
 *
 * Checks to make sure that certain tables have certain expected columns.
 * This is done so we can consumes MySQL-dumps without [missing column] errors.
 */
function usa_data_migration_ensureExpectedTableStructure() {

    if ( !db_field_exists('node', 'deleted') ) {
        db_query("ALTER TABLE node ADD deleted INT(11) NULL DEFAULT NULL");
    }

    if ( !db_field_exists('node', 'deletion_uid') ) {
        db_query("ALTER TABLE node ADD deletion_uid INT(11) NULL DEFAULT NULL");
    }

    if ( !db_field_exists('node', 'deletion_timestamp') ) {
        db_query("ALTER TABLE node ADD deletion_timestamp INT(11) NULL DEFAULT NULL");
    }

}

/*
 * void usa_data_migration_importStructureWithCode(string $code)
 *
 * Submits the given code into the same form you see at ~/admin/structure/taxonomy/import
 * ticking all checkboxes on that form.
 *
 * This essentially is a wrapper function to bundle_copy_import_submit(), which expects to be given 
 * Drupal-form data. This function creates/emulates the Drupal-form data and triggers that 
 * function.
 */
function usa_data_migration_importStructureWithCode($code) {
    
    if ( empty($_SESSION['messages']['status']) ) {
        $restoSession = false;
    } else {
        $restoSession = $_SESSION['messages']['status'];
    }

    $emulatedFormState = array(
        'values' => array(
            'macro' => $code
        )
    );
    bundle_copy_import_submit(array(), $emulatedFormState);

    if ( $restoSession === false ) {
        if ( isset($_SESSION['messages']['status']) ) {
            unset($_SESSION['messages']['status']);
        }
    } else {
        $_SESSION['messages']['status'] = $restoSession;
    }
}

/*
 * void usa_data_migration_filterTaxonomy()
 *
 * As per the settings in the UDM module (see the administration interface), this 
 * function will kill/filter taxonomy terms in the system that do not fall under 
 * a (given) branch.
 */
function usa_data_migration_filterTaxonomy() {

    if ( intval(variable_get('udm_tax_dofilter', 0)) === 0 ) {
        return;
    }

    $delCount = 0;
    $keepTermsUnderNames = explode("\n", variable_get('udm_tax_filter_names', '') );

    $tids = db_query("SELECT tid FROM taxonomy_term_data")->fetchCol();
    foreach ($tids as $tid) {

        $doKillTerm = true;

        foreach ( taxonomy_get_parents_all($tid) as $termParent ) { // For each parent
            foreach ($keepTermsUnderNames as $keepTermsUnderName) { // For each demanding term/name
                if ( strtolower(trim($termParent->name)) === strtolower(trim($keepTermsUnderName)) ) {
                    $doKillTerm = false;
                    break;
                }
            }
            if ( $doKillTerm === false ) {
                break;
            }
        }

        if ( $doKillTerm === true ) {
            taxonomy_term_delete($tid);
            $delCount++;
        }

    }

    usa_data_migration_error_log(__FUNCTION__." has delete {$delCount} terms.");
}

function usa_data_migration_DeleteTermAndMaintainChildren($termName = '') {

    // We will not run this function when this process is turned off from the module configuration 
    if ( intval(variable_get('udm_tax_del', 0)) == 0 ) {
        return;
    }

    // If no $termName was given, assume the term-name given from the settings of this module
    if ( $termName === '' ) {
        $termName = variable_get('udm_tax_del_term', '');
    }

    // We can't continue if no term-name is supplied
    if ( $termName === '' ) {
        usa_data_migration_error_log(__FUNCTION__." cant not function because no term was given (not even in the settings form).");
        return;
    }

    // Lookup the term [object] based on the given name
    $terms = array_values( taxonomy_get_term_by_name($termName) );
    $term = $terms[0];

    // Bump up each of the term's [direct] children in the hierarchy
    foreach ( taxonomy_get_children($term->tid) as $tid => $termChild) {
        $termChild->parent = 0; // Well just make it a root element for now
        taxonomy_term_save($termChild);
    }

    // Delete the target term
    taxonomy_term_delete($term->tid);

    usa_data_migration_error_log(__FUNCTION__.' has completed its functionality.');
}

/*
 * void destroyAllEntityContentData(string $entityType)
 *
 * USE WITH CAUTION 
 */
function destroyAllEntityContentData($entityType) {

    switch ( strtolower($entityType) ) {
        case 'node':

            // Delete all nodes from base table
            db_query("TRUNCATE TABLE node");

            // Use the clean-up scripts to remove the deleted node's [left-over] field data
            cleanup_killOrphanedFieldData(800);
            cleanup_killOrphanedNodeRevisions();

            entity_get_controller('node')->resetCache();

            break;
        case 'terms':

            // Delete all terms from base table
            db_query("TRUNCATE TABLE taxonomy_term_data");

            // Use the clean-up script to remove the deleted terms's [left-over] field data
            cleanup_killOrphanedFieldData(800);

            // Cache clear
            entity_get_controller('taxonomy_term')->resetCache();
            taxonomy_terms_static_reset();

            break;
        default:
            exit('Error - Unknown entityType givent to destroyAllEntityContentData()');
            break;
    }

}

/**
 * void cleanup_killOrphanedNodeRevisions()
 * 
 * This function will remove rows from the node_revision and field_revision_body tables that 
 * contain information about nodes that don't exist anymore. Essentially deleting needless 
*  information that got left over from from an improper/interrupted node_delete() process. 
 */
function cleanup_killOrphanedNodeRevisions() {

    $sql = "DELETE FROM node_revision WHERE nid NOT IN ( SELECT n.nid FROM node n )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);
    
    $sql = "DELETE FROM field_data_body WHERE entity_id NOT IN ( SELECT n.nid FROM node n )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);
    
    $sql = "DELETE FROM field_revision_body WHERE entity_id NOT IN ( SELECT n.nid FROM node n )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);
}

/**
 * void cleanup_killOrphanedTaxonomyData()
 * 
 * This function will remove rows from various taxonomy tables that contain information about 
 * terms that don't exist anymore (in the taxonomy_term_data table). Essentially deleting 
 * needless information that got left over from from an improper/interrupted 
 * taxonomy deletion process. 
 */
function cleanup_killOrphanedTaxonomyData() {

    $sql = "DELETE FROM taxonomy_index WHERE tid NOT IN ( SELECT t.tid FROM taxonomy_term_data t )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);

    $sql = "DELETE FROM taxonomy_term_hierarchy WHERE tid NOT IN ( SELECT t.tid FROM taxonomy_term_data t )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);
    
}

/**
 * void cleanup_killOrphanTaxonomyTerms()
 * 
 * [!!] USE WITH CAUTION [!!]
 * DO NOT RUN THIS FUNCTIONS IN THE MIDDLE OF AN IMPORT PROCESS!
 * ONLY RUN THIS FUNCTION AFTER ALL IMPORTS ARE COMPLETE!
 *
 * This function will find all taxonomy-terms who's parents a non-exsistant, 
 * and delete them.
 */
function cleanup_killOrphanTaxonomyTerms() {

    // Find orphan terms
    $orphanTermsIds = db_query("
        SELECT d.tid AS 'tid'
        FROM taxonomy_term_data d
        LEFT JOIN taxonomy_term_hierarchy h ON ( h.tid = d.tid )
        LEFT JOIN taxonomy_term_data p ON ( h.parent = p.tid )
        WHERE p.tid IS NULL AND h.parent <> 0
    ")->fetchCol();

    // Bail if there are none (or else we'll generate a PDO exception below)
    if ( count($orphanTermsIds) == 0 ) {
        return;
    }


    $orphanTermsIds = implode(',', $orphanTermsIds);
    error_log('Killing orphan taxonomy-terms: '.$orphanTermsIds);
    set_time_limit(800);
    db_query("DELETE FROM taxonomy_term_data WHERE tid IN ({$orphanTermsIds}) ");
}

/**
 * array cleanup_killOrphanedFieldData()
 * 
 * This function will remove rows from all field_revision_field_* and field_data_field_* tables 
 * that contain information about nodes that don't exist anymore. Essentially deleting 
 * needless information that got left over from from an improper/interrupted node_delete() 
 * process. 
 *
 * This process can be very time-consuming, so you can specify how long (in seconds) this 
 * function should continue running at maximum in the first argument passed. You can 
 * tail -f the PHP-error-log to watch what table this process is currently working on.
 *
 * Returns an array of TableName => Number of rows deleted
 */
function cleanup_killOrphanedFieldData($maxSecondsForProcessing = 180) {

    $ret = array();
    $startTime = time();
    
    // node_access
    $sql = "DELETE FROM node_access WHERE nid NOT IN ( SELECT n.nid FROM node n )";
    set_time_limit(800);
    //error_log($sql);
    db_query($sql);
    
    // node_comment_statistics
    if ( db_table_exists('node_comment_statistics') ) {
        $sql = "DELETE FROM node_comment_statistics WHERE nid NOT IN ( SELECT n.nid FROM node n )";
        set_time_limit(800);
        //error_log($sql);
        db_query($sql);
    }

    // For each table in this database...
    foreach ( db_query("SHOW TABLES") as $tbl ) {
        
        set_time_limit(800);
        $tblInfo = array_values( (array) $tbl );
        $tbl = $tblInfo[0];
        
        // If this one of the field_revision_field_* or field_data_field_* tables...
        if ( strpos($tbl, 'field_revision_field_') !== false || strpos($tbl, 'field_data_field_') !== false ) {
        
            // If this table has an entity_id field...
            if ( db_field_exists($tbl, 'entity_id') ) {
                
                // Break out of loop if we have taken too much time processing
                $timeTaken = time() - $startTime;
                if ( $timeTaken > $maxSecondsForProcessing ) {
                    break;
                }
                
                // Delete orphaned field data for nodes from this table
                $sql = "DELETE FROM {$tbl} WHERE entity_type = 'node' AND entity_id NOT IN ( SELECT nid FROM node )";
                //error_log("Running SQL Query: {$sql}");
                set_time_limit(800);
                $rowDeleteCount = db_query($sql)->rowCount();
                $ret[$tbl] = $rowDeleteCount;
                //error_log("Deleted {$rowDeleteCount} rows from the {$tbl} table.");

                // Delete orphaned field data for taxonomy-terms from this table
                $sql = "
                    DELETE FROM {$tbl} 
                    WHERE 
                        entity_type = 'taxonomy_term' 
                        AND entity_id NOT IN ( SELECT tid FROM taxonomy_term_data )
                ";
                //error_log("Running SQL Query: {$sql}");
                set_time_limit(800);
                $rowDeleteCount = db_query($sql)->rowCount();
                $ret[$tbl] = $rowDeleteCount;
                //error_log("Deleted {$rowDeleteCount} rows from the {$tbl} table.");
            }
        }
    }

    // Remove left-over node alias-paths
    db_query("
        DELETE FROM url_alias 
        WHERE 
            InStr(source, 'node/') = 1
            AND CONVERT(SUBSTRING_INDEX(source, '/', -1), UNSIGNED INTEGER) NOT IN ( SELECT nid FROM node )
    ");

    // Remove left-over taxonomy alias-paths
    db_query("
        DELETE FROM url_alias
        WHERE 
            InStr(source, 'taxonomy/term/') = 1
            AND CONVERT(SUBSTRING_INDEX(source, '/', -1), UNSIGNED INTEGER) NOT IN ( SELECT tid FROM taxonomy_term_data )
    ");
    
    return $ret;
}

/**
 * void usa_data_migration_postSynch_taxonomyTermsFriendlyAliases()
 * 
 * Sets the alias paths of taxonomy-terms to the value in their "Friendly URL" field
 */
function usa_data_migration_postSynch_taxonomyTermsFriendlyAliases($tids = array()) {

    if ( intval(variable_get('udm_friendly_alias', 0)) == 0 ) {
        return;
    }

    if ( is_array($tids) ) {

        if ( count($tids) == 0 ) {
            error_log(__FUNCTION__.'() is not running as an empy array was supplied.');
            return;
        }

        error_log(__FUNCTION__.'() started, and will work on ' . count($tids) . ' terms.');

        $tids = implode(',', $tids);
        $friendlyTerms = db_query("
            SELECT 
                t.tid AS 'tid',
                f.field_friendly_url_value AS 'url',
                g.field_generate_page_value AS 'genpage'
            FROM taxonomy_term_data t
            LEFT JOIN field_data_field_friendly_url f ON ( t.tid = f.entity_id )
            LEFT JOIN field_data_field_generate_page g ON ( t.tid = g.entity_id )
            WHERE t.tid IN ({$tids})
        ");
    } else {
        
        error_log(__FUNCTION__.'() started, and will work on ALL terms.');

        $friendlyTerms = db_query("
            SELECT 
                t.tid AS 'tid',
                f.field_friendly_url_value AS 'url',
                g.field_generate_page_value AS 'genpage'
            FROM taxonomy_term_data t
            LEFT JOIN field_data_field_friendly_url f ON ( t.tid = f.entity_id )
            LEFT JOIN field_data_field_generate_page g ON ( t.tid = g.entity_id )
            WHERE
                f.field_friendly_url_value IS NOT NULL
                AND g.field_generate_page_value IS NOT NULL 
                AND g.field_generate_page_value = 'yes'
        ");
    }

    foreach ( $friendlyTerms as $record ) {

        // Kill an alias that already exsists
        db_query("DELETE FROM url_alias WHERE source = 'taxonomy/term/{$record->tid}' ");
        drupal_clear_path_cache();

        // Save new alias
        $alias = $record->url;
        $alias = str_replace('http://kids.usa.gov/', '', $alias);
        $alias = str_replace('http://usa.gov/', '', $alias);
        $alias = str_replace('http://', '', $alias);
        $pathInfo = array(
            'source' => 'taxonomy/term/'.$record->tid,
            'alias' => $alias,
        );

        path_save($pathInfo);
        error_log("Set alias path {$alias} for term {$record->tid}");
    }

    drupal_clear_path_cache();
    error_log(__FUNCTION__.'() complete.');
}

function usa_data_migration_postSynch_s3translate() {

    if ( intval(variable_get('udm_filemedia_s3translate', 0)) == 0 ) {
        return;
    }

    error_log(__FUNCTION__.'() started...');

    $nids = db_query("
        SELECT m.entity_id AS 'nid'
        FROM field_data_field_file_media m
        LEFT JOIN file_managed f ON ( m.field_file_media_fid = f.fid )
    ")->fetchCol();

    // Kill repeating nids
    $nids = array_flip($nids); // this kills the duplicates
    $nids = array_flip($nids); // this restores the array back into its original form
    $nids = array_values($nids); // this resets the array index

    dsm($nids);

    foreach ( $nids as $nid ) {

        $entity = node_load($nid);

        // and if it has an atttached file in S3...
        if ( empty($entity->field_file_media['und'][0]['uri']) ) {

            //error_log('empty dude');

        } else {

            $s3url = $entity->field_file_media['und'][0]['uri'];
            $realURL = str_replace('s3://', 'http://gsa-cmp-fileupload-stage.s3.amazonaws.com/', $s3url);

            // then plug the URL to the file into the "" field
            $entity->field_file_media_url = array(
                'und' => array(
                    0 => array(
                        'value' => $realURL,
                        'format' => null,
                        'safe_value' => $realURL
                    )
                )
            );
        }

        // look for abbr, if there is an abbr, replace
        $entity = _usa_data_migration_alter_content($entity);

        node_save($entity);
    }

    error_log(__FUNCTION__.'() complete.');
}


/**
 * _usa_data_migration_alter_content
 *
 * Alter some fields of nodes before node_save called
 */
function _usa_data_migration_alter_content($node) {

    if ($node->type == "text_content_type" || $node->type == 'directory_record_content_type') {

        $data_abbr = variable_get('data_abbr', "Apt.|Apartment\nAve.|Avenue\nBldg.|Building\nBlvd.|Boulevard\nCir.|Circle\nCt.|Court\nDr.|Drive"
            . "\nExpy.|Expressway\nJct.|Junction\nLn.|Lane\nRte.|Route\nSt.|Street\nSte.|Suite\nTpke.|Turnpike");

        $abbrs = explode("\n", $data_abbr);

        if (isset($data_abbr) && count($abbrs) > 0) {
            foreach ($abbrs as $abbr) {
                $tmp_abbr = explode("|", $abbr);
                if (count($tmp_abbr) == 2) {
                    $find_str = $tmp_abbr[0];
                    $replace_str = $tmp_abbr[1];
                    // find and replace
                    if ($node->type == "text_content_type" ) {
                        if (isset($node->title)) {
                            $node->title = str_replace($find_str, $replace_str, $node->title);
                        }
                        if (isset($node->field_description['und'][0]['value'])) {
                            $node->field_description['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_description['und'][0]['value']);
                            $node->field_description['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_description['und'][0]['safe_value']);
                        }
                        if (isset($node->body['und'][0]['value'])) {
                            $node->body['und'][0]['value'] = str_replace($find_str, $replace_str, $node->body['und'][0]['value']);
                            $node->body['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->body['und'][0]['safe_value']);
                        }
                        if (isset($node->field_contact_center_info['und'][0]['value'])) {
                            $node->field_contact_center_info['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_contact_center_info['und'][0]['value']);
                            $node->field_contact_center_info['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_contact_center_info['und'][0]['safe_value']);
                        }
                    }
                    elseif($node->type == 'directory_record_content_type'){

                        if (isset($node->title)) {
                            $node->title = str_replace($find_str, $replace_str, $node->title);
                        }
                        // assuming it is directory_record_content_type
                        if (isset($node->field_description['und'][0]['value'])) {
                            $node->field_description['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_description['und'][0]['value']);
                            $node->field_description['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_description['und'][0]['safe_value']);
                        }

                        if (isset($node->field_alpha_order_name['und'][0]['value'])) {
                            $node->field_alpha_order_name['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_alpha_order_name['und'][0]['value']);
                            $node->field_alpha_order_name['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_alpha_order_name['und'][0]['safe_value']);
                        }

                        if(isset($node->field_english_translation_name['und'][0]['value'])) {
                            $node->field_english_translation_name['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_english_translation_name['und'][0]['value']);
                            $node->field_english_translation_name['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_english_translation_name['und'][0]['safe_value']);
                        }

                        if (isset($node->field_see_also['und'][0]['value'])) {
                            $node->field_see_also['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_see_also['und'][0]['value']);
                            $node->field_see_also['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_see_also['und'][0]['safe_value']);
                        }

                        if (isset($node->field_subdivision['und'][0]['value'])) {
                            $node->field_subdivision['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_subdivision['und'][0]['value']);
                            $node->field_subdivision['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_subdivision['und'][0]['safe_value']);
                        }

                        if (isset($node->field_street_2['und'][0]['value'])) {
                            $node->field_street_2['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_street_2['und'][0]['value']);
                            $node->field_street_2['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_street_2['und'][0]['safe_value']);
                        }

                        if (isset($node->field_street_1['und'][0]['value'])) {
                            $node->field_street_1['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_street_1['und'][0]['value']);
                            $node->field_street_1['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_street_1['und'][0]['safe_value']);
                        }

                        if (isset($node->field_city['und'][0]['value'])) {
                            $node->field_city['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_city['und'][0]['value']);
                            $node->field_city['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_city['und'][0]['safe_value']);
                        }

                        if (isset($node->field_contact_links['und'][0]['value'])) {
                            $node->field_contact_links['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_contact_links['und'][0]['value']);
                            $node->field_contact_links['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_contact_links['und'][0]['safe_value']);
                        }

                        if (isset($node->field_in_person_links['und'][0]['value'])) {
                            $node->field_in_person_links['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_in_person_links['und'][0]['value']);
                            $node->field_in_person_links['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_in_person_links['und'][0]['safe_value']);
                        }

                        if (isset($node->field_website_links['und'][0]['value'])) {
                            $node->field_website_links['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_website_links['und'][0]['value']);
                            $node->field_website_links['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_website_links['und'][0]['safe_value']);
                        }

                        if (isset($node->field_info_for_contact_center['und'][0]['value'])) {
                            $node->field_info_for_contact_center['und'][0]['value'] = str_replace($find_str, $replace_str, $node->field_info_for_contact_center['und'][0]['value']);
                            $node->field_info_for_contact_center['und'][0]['safe_value'] = str_replace($find_str, $replace_str, $node->field_info_for_contact_center['und'][0]['safe_value']);
                        }

                    }

                }

            }
        }
    }
    return $node;
}