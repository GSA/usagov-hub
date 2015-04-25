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
            exit("Access Denied: Invalid security key ({$_REQUEST['key']})");
        }
    }

    // Dont pull if there may be another thread doing a pull right now
    $since = variable_get('udm_last_pull_time', 0);
    if ( abs(time() - $since) > 300 || $since == 0 ) { 
        $since = intval($since) - 1800; // 1800 = 30 mins
        $since = ( $since < 0 ? 0 : $since );
        error_log('since is: ' . (time() - $since));
    } else {
        if ( empty($_REQUEST['force']) ) {
            @ob_end_clean();
            while (@ob_end_clean());
            header('Content-Type: text');
            exit('too soon');
        }
    }

    // Execute node update/pull
    $target = variable_get('udm_pull_from_nodetarget');
    usa_data_migration_synchNodesFromTarget($target, true, 100, 0, $since, true);
    error_log("\n");

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

    // Debug for devs who tail the Slack channel
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "Notice: {$thisFunct}() is pulling taxonomy information {$strQuickMode} from {$taxonomyDataSource}. My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
    }

    // Tell the USA Taxonomy Man module to not execute on term-hook for this batch process
    global $utm_norun;
    $utm_norun = true;

    // Init
    $batch = 1;
    $size = $batchSize;

    // Pull data
    $taxonomyDataSource .= ( strpos($taxonomyDataSource, '?') === false ? '?' : '&' ) . 'machineReadable=1';
    if ( trim(variable_get('udm_tax_filter_names', '')) !== '' ) {
        $taxonomyDataSource .= '&taxTpLvlParentNameFilter=' . trim(variable_get('udm_tax_filter_names', ''));
        $taxonomyDataSource .= '&taxTpLvlParentNameFilter=' . trim(variable_get('udm_tax_filter_names', ''));
    }

    // Pass since argument
    if ( intval($since) > 0 ) {
        $taxonomyDataSource .= '&since='.$since;
    }

    // Make sure this table exists to synch data into 
    usa_data_migration_ensureTaxonomyDateTableExsists();

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

        // Lock URL-paths that request term-pages being written to
        usa_data_migration_lockUrlToTerms( explode(',', $pullData['TaxDump_tidList']) );

        // Remove all data terms in this environment which are incoming (we dont want things to collide)
        if ( trim($pullData['TaxDump_tidList']) !== '' ) {
            db_query("DELETE FROM taxonomy_term_data WHERE tid IN ({$pullData['TaxDump_tidList']}) ");
        }
        cleanup_killOrphanedTaxonomyData();
        cleanup_killOrphanedFieldData();
        
        // Synch taxonomy [field] structure into this environment 
        if ( $quick != true && !empty($pullData['taxFieldStructure_BundleImportCode']) ) {

            // Try this operation up to 50 times...
            for ( $x = 0 ; $x < 50 ; $x++ ) {


                try {
                    usa_data_migration_importStructureWithCode( $pullData['taxFieldStructure_BundleImportCode'] );
                    break; // break out of loop on successful import
                } catch ( DatabaseSchemaObjectExistsException $e ) {

                    $msg = $e->getMessage();
                    if ( strpos($msg, 'already exists') !== false ) {
                        $words = explode(' ', $msg);
                        db_query("DROP TABLE ".$words[1]);
                    } else {
                        $msg = 'There was an error executing usa_data_migration_importStructureWithCode()...';
                        usa_data_migration_log($msg);
                        usa_data_migration_error_log($msg);
                        break; // break out of loop from an unhandleable exception
                    }

                }
            }


            taxonomy_vocabulary_static_reset();
            taxonomy_terms_static_reset();
            field_cache_clear();
            usa_data_migration_log("Imported taxonomy structure from remote host");
        }
        
        // Exclaim pre-sql process message over Slack
        if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
            slack_send_message(
                "Notice: About to consume MySQL data pulled from {$batchURL}... My process-id is: ".getmypid(),
                "@dfrey", 
                $_SERVER['HTTP_HOST']
            );
        }

        // Synch terms into this environment
        $linkMySql = usa_data_migration_connectMySQL();
        $sqlLines = explode("\n", $pullData['TaxDump_sqlDump']);
        mysql_query('SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;', $linkMySql);
        foreach ( $sqlLines as $sqlLine ) {
            if ( trim($sqlLine) !== '' ) {

                mysql_query($sqlLine, $linkMySql);

                $err = mysql_error();
                if ( $err !== '' ) {
                    // Exclaim post-sql process message over Slack
                    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
                        slack_send_message(
                            "Notice: MySQL-data-consumption *error*! My process-id is: ".getmypid()."\n*The error was:* ".$err,
                            "@dfrey", 
                            $_SERVER['HTTP_HOST']
                        );
                    }
                }

            }
        }
        mysql_query('COMMIT;', $linkMySql);
        mysql_close($linkMySql);
        entity_get_controller('taxonomy_term')->resetCache();
        //usa_data_migration_log("Consumed MySQL batch dump: {$batch}");

        // Exclaim post-sql process message over Slack
        if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
            slack_send_message(
                "Notice: *Done*with comsuming MySQL data! My process-id is: ".getmypid(),
                "@dfrey", 
                $_SERVER['HTTP_HOST']
            );
        }

        // Clear field cache for all synched taxonomy-terms
        foreach ( explode(',', $pullData['TaxDump_tidList']) as $nid ) {
            $sql = "DELETE FROM cache_field WHERE InStr(cid, '{$nid}')<>0";
            db_query($sql);
        }


        // Log
        $tidsPulled = array_merge($tidsPulled, explode(',', $pullData['TaxDump_tidList']));
        error_log('Pulled these terms from the host-site: '.$pullData['TaxDump_tidList']);

    }

    // Bug killer - make sure that is not a value of array("")
    if ( is_array($tidsPulled) && count($tidsPulled) === 1 && trim($tidsPulled[0]) === '' ) {
        error_log('test');
        $tidsPulled = array();
    }

    // Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
    variable_set('udm_last_pull_time', time() );

    // Run cleanup process
    //usa_data_migration_error_log("Cleaning up");
    cleanup_killOrphanedNodeRevisions();
    cleanup_killOrphanedTaxonomyData();
    cleanup_killOrphanedFieldData();
    entity_get_controller('taxonomy_term')->resetCache();
    taxonomy_vocabulary_static_reset();
    taxonomy_terms_static_reset();
    field_cache_clear();
    sleep(3);
    //usa_data_migration_error_log("Clean-up complete");

    // Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
    variable_set('udm_last_pull_time', time() );

    // Exclaim synch-finish message
    $msg = "{$thisFunct}() has finished importing terms, now running post-synch processes...";
    usa_data_migration_log($msg);
    usa_data_migration_error_log("Notice: " . $msg);

    // Taxonomy-pull post-synch processes
    cleanup_killOrphanTaxonomyTerms(); // TO ONLY BE RUN AFTER A COMPLETE SYNCH!
    //usa_data_migration_filterTaxonomy();
    //usa_data_migration_killTermsByField();
    if ( $since == 0 ) {
        usa_data_migration_postSynch_taxonomyTermsFriendlyAliases(false);
    } else {
        usa_data_migration_postSynch_taxonomyTermsFriendlyAliases( $tidsPulled );
    }

    // Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
    variable_set('udm_last_pull_time', time() );

    // Updated associated menu-item titles with the pulled-term titles
    if ( function_exists('usa_tax_man_createMenusFromTaxonomy') ) {
        usa_data_migration_lockEntireSite();
        global $utm_norun;
        $utm_norun = false;
        usa_tax_man_deleteAllGeneratedMenuItems();
        usa_tax_man_createMenusFromTaxonomy();
    }

    // Unlock the previously locked pages
    usa_data_migration_unlockAllUrls();

    /* Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
    additionally, the trigger of HOOK_udm_last_pull_time() may take a while, so we'll set udm_last_pull_time to the future. */
    variable_set('udm_last_pull_time', time() + 24 );

    // Exclaim post-process message over Slack
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "Notice: {$thisFunct}() has finished importing taxonomy-terms and is now running post-synch processes. Firing HOOK_usa_data_migration_synched()... My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
    }

    // Trigger post-process hooks
    $hookStartTime = microtime(true);
    module_invoke_all('usa_data_migration_synched', 'terms', $tidsPulled, $since);
    $timeTaken = round(microtime(true) - $hookStartTime, 2);
    variable_set('udm_HookProcTime_tax', $timeTaken); // Note how long this hook took to execute (for debugging/logging purposes)

    // Exclaim overall-finish message
    $msg = "{$thisFunct}() has finished importing terms, post-synch processes complete...";
    usa_data_migration_log($msg);
    usa_data_migration_error_log("Notice: " . $msg);

    // Exclaim overall-finish message in Slack
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "{$thisFunct}() has finished importing terms, post-synch processes complete... I am now completely done. My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
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
function usa_data_migration_synchNodesFromTarget($nodeDataSource, $retTrueOnSuccess = true, $batchSize = 100, $maxBatch = 0, $since = 0, $quick = false, $onlyCertainType = '') {

    // Debug for devs who tail the PHP error_log
    $thisFunct = __FUNCTION__;
    usa_data_migration_error_log("Notice: {$thisFunct} is pulling node information from {$nodeDataSource}");
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "Notice: {$thisFunct}() is pulling nodes changed since {$since} from {$nodeDataSource}. My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
    }

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

    // Restricy typ-epull (if requested)
    if ( trim($onlyCertainType) !== '' ) {
        $nodeDataSource .= '&type='.$onlyCertainType;
    }

    $nidsPulled = array();
    while ( true ) {

        // Ensure we dont time out
        set_time_limit(500);

        // Note that at this time is when the last pull has occurred
        variable_set('udm_last_pull_time', time() );

        // Target location
        $batchURL = $nodeDataSource . "&batch={$batch}&size={$size}";
        usa_data_migration_log('Pulling a batch of nodes from '.$batchURL);
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
            return $msg;
        }

        // Break if we are done 
        if ( strpos($pullString, 'NO MORE DATA') !== false ) {
            usa_data_migration_error_log(__FUNCTION__." broke loop on completion ".($batch-1));
            break;
        }

        // Typecast and validate data
        $pullData = @unserialize($pullString);
        unset($pullString); // free memory
        if ( $pullData === false ) {
            $msg = "Error - {$thisFunct} pull malformed data from {$batchURL}";
            usa_data_migration_log($msg);
            return $msg;
        }
        
        // If S3 settings information was given, save them into a Drupal-var
        if ( !empty($pullData['s3Config']) ) {
            variable_set('cmp_s3_config', $pullData['s3Config']);
        }

        // Synch node [field] structure into this environment 
        if ( $quick != true && !empty($pullData['nodeFieldStructure_BundleImportCode']) ) {

            // Try this operation up to 30 times...
            for ( $x = 0 ; $x < 30 ; $x++ ) {

                try {
                    $msg = "Trying to import node-structure...";
                    usa_data_migration_log($msg);
                    usa_data_migration_importStructureWithCode( $pullData['nodeFieldStructure_BundleImportCode'] );
                    field_cache_clear();
                    usa_data_migration_log("Imported node structure from remote host");
                    break; // break out of loop on successful import
                } catch ( DatabaseSchemaObjectExistsException $e ) {

                    $eMsg = $e->getMessage();
                    $words = explode(' ', $eMsg);
                    $problemTbl = $words[1];
                    if ( strpos($eMsg, 'already exists') !== false && db_table_exists($problemTbl) ) {
                        $msg = "Couldnt import structure, table {$problemTbl} was in the way, dropping, and retrying...";
                        usa_data_migration_log($msg);
                        db_query("DROP TABLE ".$problemTbl);
                    } else {
                        $msg = 'There was an error executing usa_data_migration_importStructureWithCode()...';
                        usa_data_migration_log($msg);
                        break; // break out of loop from an unhandleable exception
                    }

                }

            }

            $msg = __FUNCTION__.'() has completed, failed, given-up, or succeeded, with the structure-import. Continuing operation...';
            usa_data_migration_log($msg);

        }

        // Synch nodes into this environment
        db_query( $pullData['NodeDump_sqlDump'] );
        entity_get_controller('node')->resetCache();

        // Clear field cache for all synched nodes
        foreach ( explode(',', $pullData['NodeDump_nidList']) as $nid ) {
            $sql = "DELETE FROM cache_field WHERE InStr(cid, '{$nid}')<>0";
            db_query($sql);
        }

        // Note that NIDs were synched
        $nidsPulled = array_merge($nidsPulled, explode(',', $pullData['NodeDump_nidList']));

        // Log
        error_log('Pulled these nodes from the host-site: '.$pullData['NodeDump_nidList']);

    }

    // Run cleanup process
    usa_data_migration_log("Cleaning up");
    cleanup_killOrphanedNodeRevisions();
    cleanup_killOrphanedFieldData();
    usa_data_migration_log("Clean-up complete");

    // Prost run process for node-pulls
    if ( count($nidsPulled) == 0 ) {
        error_log('Not running usa_data_migration_postSynch_s3translate(), as no nodes were synced.');
    } else {
        $nidList = implode(',', $nidsPulled);
        //usa_data_migration_postSynch_s3translate($nidList);
    }

    // Exclaim post-process message over Slack
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "Notice: {$thisFunct}() has finished importing nodes and is now running post-synch processes. Firing HOOK_usa_data_migration_synched()... My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
    }

    // Trigger post-process hooks
    usa_data_migration_log("Firing HOOK_usa_data_migration_synched...");
    $hookStartTime = microtime(true);
    module_invoke_all('usa_data_migration_synched', 'nodes', $nidsPulled, $since);
    $timeTaken = round(microtime(true) - $hookStartTime, 2);
    variable_set('udm_HookProcTime_node', $timeTaken); // Note how long this hook took to execute (for debugging/logging purposes)
    usa_data_migration_log("HOOK_usa_data_migration_synched() has completed.");

    // Exclaim finish message
    $msg = "{$thisFunct}() has finished importing nodes.";
    usa_data_migration_log($msg);
    usa_data_migration_error_log("Notice: " . $msg);

    // Exclaim finish message over Slack
    if ( function_exists('slack_send_message') && in_array($_SERVER['HTTP_HOST'], variable_get('udm_prod_domains', array())) ) {
        slack_send_message(
            "Notice: {$thisFunct}() has finished importing nodes and running post-synch processes. I am now completely done. My process-id is: ".getmypid(),
            "cmp-notify", 
            $_SERVER['HTTP_HOST']
        );
    }

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
 * void usa_data_migration_debugShowPageLockingStatusPage()
 *
 * This is a menu-callback function.
 *
 * Prints debug info for what pages are currently locked, etc.
 * Notice: This function will hijack and terminate the PHP-thread on call.
 */
function usa_data_migration_debugShowPageLockingStatusPage() {

    @ob_end_clean();
    while ( @ob_end_clean() );

    print "<h1>Last-Pull and Timing Info:</h1>";

    print "<b>udm_last_pull_time (unix time):</b> " . variable_get('udm_last_pull_time', '!NEVER!');
    print "<br/>";
    print "<b>udm_last_pull_time (seconds ago):</b> " . ( time() - variable_get('udm_last_pull_time', 0) );
    print "<br/>";
    print "<b>Pull-Request currently allowed:</b> " . ( abs(time() - variable_get('udm_last_pull_time', 0)) > 90 ? 'yes' : 'no' );
    print "<br/>";

    $timeReport = variable_get('udm_HookProcTime_node', '!UNKNOWN!');
    print "The last call to HOOK_usa_data_migration_synched() [after a node synch] took <b>{$timeReport}</b> seconds to process.";
    print "<br/>";

    $timeReport = variable_get('udm_HookProcTime_tax', '!UNKNOWN!');
    print "The last call to HOOK_usa_data_migration_synched() [after a tax-term synch] took <b>{$timeReport}</b> seconds to process.";
    print "<br/>";

    print "<h1>Currently Locked Page:</h1>";

    print "<table border=1>";

    print "<tr>";
    print "<td>tid</td>";
    print "<td>url</td>";
    print "</tr>";

    foreach (db_query("SELECT * FROM udm_locked_urls") as $record) {
        print "<tr>";
        print "<td>{$record->tid}</td>";
        print "<td>{$record->url}</td>";
        print "</tr>";
    }
    print "</table>";

    exit();

}

/*
 * bool usa_data_migration_lagIfRequestingLockedPage([int $maxLagSeconds = 10])
 *
 * If the requesting-page is locked [due to an ongoing data-migration], this function 
 * will sleep() this thread until the page is unlocked.
 *
 * Returns FALSE if no lag was taken. Returns TRUE if this function needed to sleep() 
 */
function usa_data_migration_lagIfRequestingLockedPage($maxLagSeconds = 8) {

    $rurl = request_uri();

    // The following is a special page for debugging
    if ( $rurl === '/dev/udm-debug-and-status' ) {
        return false;
    }

    // If this URL is not locked, bail
    if ( !usa_data_migration_urlIsLocked($rurl) ) {
        return false;
    }

    // We shall sleep untill the page is no longer locked
    $lagStart = time();
    while ( usa_data_migration_urlIsLocked($rurl) ) {

        sleep(1);
        
        // Watch the timeout
        if ( time() - $lagStart > $maxLagSeconds ) {
            error_log(__FUNCTION__."() timed out, and released the lag prematurely!");
            return true;
        }
    }

    // We have broken out of loop - lets wait 2 more seconds just to make sure its all in
    sleep(2);

    return true;
}

/*
 * void usa_data_migration_lockUrlToTerms(array $tids)
 * void usa_data_migration_lockUrlToTerms(int $tid)
 *
 * This functions "locks" the alias path associated with the given term [id].
 */
function usa_data_migration_lockUrlToTerms($tids) {

    // This function accepts a number, or an array of numbers
    if ( !is_array($tids) ) {
        $tids = array($tids);
    }

    usa_data_migration_ensureLockedUrlsTblExsists();

    foreach ( $tids as $tid ) {

        $tid = intval($tid);

        $url = trim(drupal_lookup_path('alias', 'taxonomy/term/'.$tid));

        if ( $url !== '' ) {
            error_log("Locking URL path: {$url}");
            db_query("INSERT IGNORE INTO udm_locked_urls (tid, url) VALUES ({$tid}, '{$url}') ");
        }
    }
}

/*
 * void usa_data_migration_lockUrlToTerms()
 *
 * This functions "locks" the entire site, ONLY USE THIS WHEN NESSESARY!
 */
function usa_data_migration_lockEntireSite() {
    db_query("INSERT IGNORE INTO udm_locked_urls (tid, url) VALUES (0, '*') ");
}

/*
 * void usa_data_migration_unlockAllUrls()
 *
 * This functions "unlocks" all URLs locked from usa_data_migration_lockUrlToTerm()
 * After a call to this function, usa_data_migration_urlIsLocked() shall always 
 * return TRUE until another call to usa_data_migration_lockUrlToTerm() is made.
 */
function usa_data_migration_unlockAllUrls() {
    db_query("TRUNCATE TABLE udm_locked_urls");
    error_log("All URL-paths unlocked in udm_locked_urls");
}

/*
 * bool usa_data_migration_urlIsLocked(string $url)
 *
 * Returns weather or not a URL is locked (due to an ongoing data-migration)
 */
function usa_data_migration_urlIsLocked($url) {
    
    usa_data_migration_ensureLockedUrlsTblExsists();

    $entireSiteIsLocked = db_query("SELECT COUNT(*) AS 'count' FROM udm_locked_urls u WHERE u.url = '*' ")->fetchColumn();
    if ( intval($entireSiteIsLocked) > 0 ) {
        return true;
    }

    $url = ltrim($url, '/');
    $isLocked = db_query("
        SELECT COUNT(*) AS 'count'
        FROM udm_locked_urls u 
        WHERE InStr(u.url, '{$url}') <> 0
    ")->fetchColumn();

    $isLocked = intval($isLocked);
    return ( $isLocked > 0 );
}

/*
 * void usa_data_migration_ensureLockedUrlsTblExsists()
 *
 * Ensures the database-table used for tacking what URLs are locked exsists
 */
function usa_data_migration_ensureLockedUrlsTblExsists() {

    // No need to run this function more than once in a PHP thread
    global $udm_ELUTE;
    if ( isset($udm_ELUTE) && $udm_ELUTE === true ) {
        return;
    }
    $udm_ELUTE = true; // Setting this, we will bail in the future, in this funct, in this thread

    // Create this table if it does not exist already
    db_query("
        CREATE TABLE IF NOT EXISTS udm_locked_urls (
            tid INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'associated taxonomy-term id this lock is associated with. REMEMBER, this term-id may not exists while the tid is in here.',
            url TEXT NOT NULL COMMENT 'the url path to lock.'
        )
    ");
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
            error_log(__FUNCTION__."() is deleting taxonomy-term {$tid} as it does not belong on this child-site.");
            taxonomy_term_delete($tid);
            $delCount++;
        }

    }

    usa_data_migration_error_log(__FUNCTION__." has delete {$delCount} terms.");
}

/*
 * void usa_data_migration_killTermsByField()
 *
 * As per the settings in the UDM module (see the administration interface), this 
 * function will kill taxonomy terms based on field-values.
 */
function usa_data_migration_killTermsByField() {

    if ( intval(variable_get('udm_tax_delbyfield', 0)) === 0 ) {
        return;
    }

    $checkField = variable_get('udm_tax_delbyfield_field', '');
    $deadlyValue = variable_get('udm_tax_delbyfield_fieldval', '');

    $vocab = taxonomy_vocabulary_machine_name_load('site_strucutre_taxonomy');
    $terms = taxonomy_get_tree($vocab->vid, 0, null, true);

    foreach ($terms as $term ) {
        if ( !empty($term->{$checkField}['und'][0]['value']) ) {

            $thisFieldValue = $term->{$checkField}['und'][0]['value'];
            $thisFieldValue = strtolower($thisFieldValue);

            if ( $thisFieldValue === strtolower($deadlyValue) ) {
                $termParents = taxonomy_get_parents_all($term->tid);
                if ( count($termParents) === 1 ) {
                    usa_data_migration_log(__FUNCTION__."() is not deleting term ".$term->tid." as it is a root-level item.");
                } else {
                    $msg = __FUNCTION__."() is deleting term ".$term->tid;
                    usa_data_migration_log($msg);
                    taxonomy_term_delete($term->tid);
                }
            }
        }
    }
    
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
    $sql = "SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\n";
    $sql .= "DELETE FROM node_access WHERE nid NOT IN ( SELECT n.nid FROM node n );\n";
    $sql .= "COMMIT;";
    set_time_limit(800);
    db_query($sql);
    
    // node_comment_statistics
    if ( db_table_exists('node_comment_statistics') ) {
        $sql = "SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\n";
        $sql .= "DELETE FROM node_comment_statistics WHERE nid NOT IN ( SELECT n.nid FROM node n );\n";
        $sql .= "COMMIT;";
        set_time_limit(800);
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
                $sql = "SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\n";
                $sql .= "DELETE FROM {$tbl} WHERE entity_type = 'node' AND entity_id NOT IN ( SELECT nid FROM node );\n";
                $sql .= "COMMIT;";
                //error_log("Running SQL Query: {$sql}");
                set_time_limit(800);
                $rowDeleteCount = db_query($sql)->rowCount();
                $ret[$tbl] = $rowDeleteCount;
                //error_log("Deleted {$rowDeleteCount} rows from the {$tbl} table.");

                // Delete orphaned field data for taxonomy-terms from this table
                $sql = "
                    SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
                    DELETE FROM {$tbl} 
                    WHERE 
                        entity_type = 'taxonomy_term' 
                        AND entity_id NOT IN ( SELECT tid FROM taxonomy_term_data );
                    COMMIT;
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
            WHERE
                f.field_friendly_url_value IS NOT NULL
                AND g.field_generate_page_value IS NOT NULL 
                AND g.field_generate_page_value = 'yes'
                AND t.tid IN ({$tids})
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
            'alias' => ltrim($alias, '/'),
        );

        path_save($pathInfo);
        error_log("Set alias path {$alias} for term {$record->tid}");
    }

    drupal_clear_path_cache();
    error_log(__FUNCTION__.'() complete.');
}

function usa_data_migration_postSynch_s3translate($strNids = '') {

    if ( intval(variable_get('udm_filemedia_s3translate', 0)) == 0 ) {
        return;
    }

    error_log(__FUNCTION__.'() started...');

    $where = ( $strNids == '' ? '' : "WHERE m.entity_id IN ({$strNids})" );
    $query = "
        SELECT m.entity_id AS 'nid'
        FROM field_data_field_file_media m
        LEFT JOIN file_managed f ON ( m.field_file_media_fid = f.fid )
        $where
    ";
    $nids = db_query($query)->fetchCol();

    // Kill repeating nids
    $nids = array_flip($nids); // this kills the duplicates
    $nids = array_flip($nids); // this restores the array back into its original form
    $nids = array_values($nids); // this resets the array index

    foreach ( $nids as $nid ) {

        $entity = node_load($nid);

        // and if it has an atttached file in S3...
        if ( empty($entity->field_file_media['und'][0]['uri']) ) {

            //error_log('empty dude');

        } else {

            $s3url = $entity->field_file_media['und'][0]['uri'];
            $s3url = str_replace('s3:///', 's3://', $s3url);
            $realURL = str_replace('s3://', '//gsa-cmp-fileupload.s3.amazonaws.com/', $s3url);

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

        node_save($entity);
    }

    error_log(__FUNCTION__.'() complete.');
}


/**
 * resource connectMySQL()
 *
 * Connects to the MySQL database that this Drupal instance is/will-be using
 * This is meant to create a connection to the database that bypasses Drupal's db_query() and query alter hooks
 */
function usa_data_migration_connectMySQL() {
    $dbAuth = $GLOBALS["databases"]["default"]["default"];
    $host = $dbAuth["host"];
    $user = $dbAuth["username"];
    $pass = $dbAuth["password"];
    $port = $dbAuth["port"];
    $db = $dbAuth["database"];
    if ( !empty($port) ) {
        $host .= ":" . $port;
    }
    $link = @mysql_connect($host, $user, $pass);
    @mysql_select_db($db, $link);
    return $link;
}