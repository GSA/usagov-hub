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
        while ( @ob_get_length() ) { @ob_end_clean(); }
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
            while ( @ob_get_length() ) { @ob_end_clean(); }
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
            /* Since this may be a long-running process, close the
            connection with the client and continue running */
            #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
            if ( function_exists('fastcgi_finish_request') ) {
                drupal_set_message('Too soon for a new pull.', 'warning');
                $q = !empty($_GET['force']) ? array('force'=>1) : array();
                $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
                header('Location: ' . $url, TRUE, 302);
                session_write_close();
                while ( @ob_get_length() ) { @ob_end_clean(); }
                flush();
                fastcgi_finish_request();
            } else {
                while ( @ob_get_length() ) { @ob_end_clean(); }
                header('Content-Type: text');
                exit('too soon');
            }
        }
    }

    /* Since this may be a long-running process, close the
    connection with the client and continue running */
    #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
    if ( function_exists('fastcgi_finish_request') ) {
        drupal_set_message(__FUNCTION__.'() is running.', 'status');
        $q = !empty($_GET['force']) ? array('force'=>1) : array();
        $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
        header('Location: ' . $url, TRUE, 302);
        session_write_close();
        while ( @ob_get_length() ) { @ob_end_clean(); }
        flush();
        fastcgi_finish_request();
    }

    // Execute node update/pull
    $target = variable_get('udm_pull_from_nodetarget');
    usa_data_migration_synchNodesFromTarget($target, true, 100, 0, $since, true);

    // Execute taxonomy update/pull
    $target = variable_get('udm_pull_from_taxtarget');
    usa_data_migration_synchTaxonomyFromTarget($target, true, 100, $since, true);

    // Return
    // if ( $terminateThreadOnCompletion ) {
    //     // while ( @ob_get_length() ) { @ob_end_clean(); }
    //     // @header('Content-Type: text');
    //     // exit('done');
    // } else {
    //     drupal_set_message(__FUNCTION__.'() has completed.', 'status');
    // }
}

/**
 *  bool/string usa_data_migration_synchTaxonomyFromTarget()
 *
 * This function will attempt to pull a dump of taxonomy-related tables from the target
 * and synch it into this environment. This function returns TRUE on success, and a
 * string on failure (depending on the $retTrueOnSuccess argument).
 */
function usa_data_migration_synchTaxonomyFromTarget($taxonomyDataSource, $retTrueOnSuccess = true, $batchSize = 100, $since = 0, $quick = false, $maxBatch = 0) {

    // /* Since this may be a long-running process, close the
    // connection with the client and continue running */
    // #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
    // if ( function_exists('fastcgi_finish_request') ) {
    //     drupal_set_message(__FUNCTION__.'() is running.', 'status');
    //     $q = !empty($_GET['force']) ? array('force'=>1) : array();
    //     $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
    //     session_write_close();
    //     header('Location: ' . $url, TRUE, 302);
    //     while ( @ob_get_length() ) { @ob_end_clean(); }
    //     flush();
    //     fastcgi_finish_request();
    // }

    $shouldSlack = usa_data_migration_should_slack();
    $webhook_url = $shouldSlack ? slack_get_default_webhook_url() : '';
    // Debug for devs who tail the PHP error_log
    $thisFunct = __FUNCTION__;
    $strQuickMode = ( $quick ? ' (in quick mode) ' : '' );
    usa_data_migration_error_log("Notice: {$thisFunct} is pulling taxonomy information {$strQuickMode} from {$taxonomyDataSource}");

    // Debug for devs who tail the Slack channel
    if ( $shouldSlack ) {
        $msg = "Notice: {$thisFunct}() is pulling taxonomy information {$strQuickMode} from {$taxonomyDataSource}. My process-id is: ".getmypid();
        slack_send_message($webhook_url,
            $msg,
            "#cmp-notify-verbose",
            $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
        );
        $msg = $_SERVER['HTTP_HOST']." is pulling taxonomy data from the CMP.";
        slack_send_message($webhook_url,
            $msg,
            "cmp-notify",
            "cmp-childsite notification",['type'=>'','icon'=>0,'emoji'=>0]
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
        //$taxonomyDataSource .= '&taxTpLvlParentNameFilter=' . trim(variable_get('udm_tax_filter_names', ''));
    }

    // Pass since argument
    if ( intval($since) > 0 ) {
        $taxonomyDataSource .= '&since='.$since;
    }

    $trx = db_transaction();
    try {
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
            $pullString = file_get_contents(
                $batchURL,
                false,
                stream_context_create(
                    array(
                        'ssl' => array(
                            'verify_peer' => false,
                            'verify_peer_name' => false,
                        ),
                    )
                )
            );
            $batch++; // The next run of the loop shall pull the next $size nodes

            if ( $maxBatch > 0 && ($batch+1) > $maxBatch ) {
                usa_data_migration_error_log(__FUNCTION__." broke loop on maxBatch - not processing batch ".$batch);
                break;
            }

            // Validate data
            if ( $pullString === false ) {
                $msg = "Error - {$thisFunct} could not obtain data from {$batchURL}";
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
                usa_data_migration_error_log($msg);
                return $msg;
            }

            // Remove all data terms in this environment which are incoming (we dont want things to collide)
            // usa_data_migration_error_log(__FUNCTION__." DBGQ ".print_r($pullData['debug_tidQuery'],true));
            // usa_data_migration_error_log(__FUNCTION__." TIDLIST ".print_r(explode(',', $pullData['TaxDump_tidList']),true));
            // usa_data_migration_error_log(__FUNCTION__." DELETE FROM taxonomy_term_data WHERE tid IN (:tidList) ");
            if ( trim($pullData['TaxDump_tidList']) !== '' ) {
                $tidItems = explode(',', trim($pullData['TaxDump_tidList']));
                for($i=0; $i<count($tidItems); $i+=20){
                    $tl = "'".implode("','",array_slice($tidItems, $i, 20))."'";
                    db_query("DELETE FROM taxonomy_term_data WHERE tid IN ($tl)");
                }
                cleanup_killOrphanedTaxonomyData();
                cleanup_killOrphanedFieldData();
            }

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
            $msg = "Notice: About to consume MySQL data pulled from {$batchURL}... "
                  ."This transaction should pull taxonomy-terms: ".( trim($pullData['TaxDump_tidList']) === '' ? '{none to pull}' : '*'.$pullData['TaxDump_tidList'].'*' );
            usa_data_migration_error_log($msg);
            if ( $shouldSlack ) {
                slack_send_message($webhook_url,
                    $msg." My process-id is: ".getmypid(),
                    "#cmp-notify-verbose",
                    $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
                );
            }

            // Synch terms into this environment
            $sqlLines = explode("\n", $pullData['TaxDump_sqlDump']);
            foreach ( $sqlLines as $sqlLine ){
                if ( trim($sqlLine) !== '' ){
                    // usa_data_migration_error_log(" sql ::: $sqlLine");
                    Database::getConnection('default')
                        ->prepareQuery(trim($sqlLine))
                        ->execute();
                }
            }
            usa_data_migration_log("Consumed MySQL batch dump: {$batch}");

            // Exclaim post-sql process message over Slack
            if ( $shouldSlack ) {
                slack_send_message($webhook_url,
                    "Notice: *Done* with *comsuming MySQL* data. My process-id is: ".getmypid(),
                    "#cmp-notify-verbose",
                    $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
                );
            }

            // Clear field cache for all synched taxonomy-terms
            // foreach ( explode(',', $pullData['TaxDump_tidList']) as $nid ) {
            //     $sql = "DELETE FROM cache_field WHERE cid='field:taxonomy_term:{$nid}'";
            //     db_query($sql);
            // }
            if ( trim($pullData['TaxDump_tidList']) !== '' ) {
                db_query("DELETE FROM cache_field WHERE cid IN (:tidList)",
                    array(":tidList"=>array_map(
                            function($tid){return 'field:taxonomy_term:'.$tid;},
                            explode(',', trim($pullData['TaxDump_tidList']))
                    ))
                );
            }

            // Log
            $tidsPulled = array_merge($tidsPulled, explode(',', $pullData['TaxDump_tidList']));
            error_log('Pulled these terms from the host-site: '.$pullData['TaxDump_tidList']);

        }

        // Bug killer - make sure that is not a value of array("")
        if ( is_array($tidsPulled) && count($tidsPulled) === 1 && trim($tidsPulled[0]) === '' ) {
            $tidsPulled = array();
        }

        // Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
        variable_set('udm_last_pull_time', time() );

        // Run cleanup process
        //usa_data_migration_error_log("Cleaning up");
        cleanup_killOrphanedNodeRevisions();
        cleanup_killOrphanedTaxonomyData();
        cleanup_killOrphanedFieldData();
        //usa_data_migration_error_log("Clean-up complete");

        // Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
        variable_set('udm_last_pull_time', time() );

        // Exclaim synch-finish message
        $msg = "{$thisFunct}() has finished importing terms, now running post-synch processes...";
        #usa_data_migration_log($msg);
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
            global $utm_norun;
            $utm_norun = false;
            usa_tax_man_deleteAllGeneratedMenuItems();
            usa_tax_man_createMenusFromTaxonomy();
        }

        /* Don't let another PHP thread run this same function simultaneously (this is going to be spammed a lot in this function)
        additionally, the trigger of HOOK_udm_last_pull_time() may take a while, so we'll set udm_last_pull_time to the future. */
        variable_set('udm_last_pull_time', time() + 24 );

        // Exclaim post-process message over Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "Notice: {$thisFunct}() has finished importing taxonomy-terms and is now running post-synch processes. Firing HOOK_usa_data_migration_synched()... My process-id is: ".getmypid(),
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }

        // Trigger post-process hooks
        $hookStartTime = microtime(true);
        module_invoke_all('usa_data_migration_synched', 'terms', $tidsPulled, $since);
        $timeTaken = round(microtime(true) - $hookStartTime, 2);
        variable_set('udm_HookProcTime_tax', $timeTaken); // Note how long this hook took to execute (for debugging/logging purposes)

        // Exclaim overall-finish message
        $msg = "{$thisFunct}() has finished importing terms, post-synch processes complete...";
        #usa_data_migration_log($msg);
        usa_data_migration_error_log("Notice: " . $msg);

        // Exclaim overall-finish message in Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "{$thisFunct}() has finished importing terms, post-synch processes complete... *I am now completely done.* My process-id is: ".getmypid(),
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }

    } catch (Exception $e) {
        //  Exclaim post-sql process message over Slack
        $msg = "Exception! My process-id is: ".getmypid()."\n*The exception was:* ".print_r($e,true);
        usa_data_migration_error_log("Error: " . $msg);
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "Error: $msg",
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }
        $trx->rollBack();
        return $msg;
    }

    /// $trx should loose scope and cause an auto commit - but lets force it so we can catch any error
    try {
        unset($trx);
        if ( $retTrueOnSuccess ) {
            return true;
        } else {
            return $msg;
        }
    } catch (Exception $e){
        // Exclaim overall-finish message
        $msg = "{$thisFunct}() may have failed to commit it's transaction during unset(trx)... My process-id is: ".getmypid();
        usa_data_migration_error_log("Error: " . $msg);

        // Exclaim overall-finish message in Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                $msg,
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }
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

    // /* Since this may be a long-running process, close the
    // connection with the client and continue running */
    // #if ( $terminateThreadOnCompletion && function_exists('fastcgi_finish_request') ) {
    // if ( function_exists('fastcgi_finish_request') ) {
    //     drupal_set_message(__FUNCTION__.'() is running.', 'status');
    //     $q = !empty($_GET['force']) ? array('force'=>1) : array();
    //     $url = url(current_path(), array('query'=>$q,'absolute'=>TRUE, 'external'=>FALSE));
    //     session_write_close();
    //     header('Location: ' . $url, TRUE, 302);
    //     while ( @ob_get_length() ) { @ob_end_clean(); }
    //     flush();
    //     fastcgi_finish_request();
    // }

    $shouldSlack = usa_data_migration_should_slack();
    $webhook_url = $shouldSlack ? slack_get_default_webhook_url() : '';

    // Debug for devs who tail the PHP error_log
    $thisFunct = __FUNCTION__;
    usa_data_migration_error_log("Notice: {$thisFunct} is pulling node information from {$nodeDataSource}");
    if ( $shouldSlack ) {
        slack_send_message($webhook_url,
            "Notice: {$thisFunct}() is pulling nodes changed since {$since} from {$nodeDataSource}. My process-id is: ".getmypid(),
            "#cmp-notify-verbose",
            $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
        );
        slack_send_message($webhook_url,
            $_SERVER['HTTP_HOST']." is pulling node data from the CMP.",
            "cmp-notify",
            "cmp-childsite notification",['type'=>'','icon'=>0,'emoji'=>0]
        );
    }

    try {
        // Init
        $batch = 1;
        $size = $batchSize;

        // Pull data
        $nodeDataSource .= ( strpos($nodeDataSource, '?') === false ? '?' : '&' ) . 'machineReadable=1';
        if ( trim(variable_get('udm_node_filter_rule', '')) !== '' ) {
            $nodeDataSource .= '&filter='.trim(variable_get('udm_node_filter_rule', ''));
        }

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
            $ctx = stream_context_create(
                array(
                    'ssl' => array(
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true
                    ),
                )
            );
            $pullString = file_get_contents("$batchURL",false,$ctx);
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

            // Exclaim pre-sql process message over Slack
            if ( $shouldSlack ) {
                slack_send_message($webhook_url,
                    "Notice: About to consume MySQL data pulled from {$batchURL}... "
                        ."This transaction should pull node-IDs: ".( trim($pullData['NodeDump_nidList']) === '' ? '{none to pull}' : '*'.$pullData['NodeDump_nidList'].'*' )
                        ." My process-id is: ".getmypid(),
                    "#cmp-notify-verbose",
                    $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
                );
            }

            // Synch nodes into this environment
            // $linkMySql = usa_data_migration_connectMySQL();
            $sqlLines = explode("\n", trim($pullData['NodeDump_sqlDump']));
            // mysql_query('SET SESSION autocommit=0;', $linkMySql);
            // mysql_query('START TRANSACTION WITH CONSISTENT SNAPSHOT;', $linkMySql);
            foreach ( $sqlLines as $sqlLine ) {
                if ( trim($sqlLine) !== '' )
                {
                    Database::getConnection($options['target'])
                        ->prepareQuery(trim($sqlLine))
                        ->execute();
                }
                // if ( trim($sqlLine) !== '' ) {
                    // mysql_query($sqlLine, $linkMySql);
                    //
                    // $err = mysql_error();
                    // if ( $err !== '' ) {
                    //     // Exclaim post-sql process message over Slack
                    //     if ( $shouldSlack ) {
                    //         slack_send_message($webhook_url,
                    //             "Notice: MySQL-data-consumption *error*! My process-id is: ".getmypid()."\n*The error was:* ".$err,
                    //             "#cmp-notify-verbose",
                    //             $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
                    //         );
                    //     } else {
                    //         error_log("Notice: MySQL-data-consumption error! The error was: ".$err);
                    //         dsm("Notice: MySQL-data-consumption error! The error was: ".$err);
                    //     }
                    //     mysql_query('ROLLBACK;', $linkMySql);
                    //     mysql_close($linkMySql);
                    //     return;
                    // }
                // }
            }

            // Run a sanity test in attempt to validate some things with this node import
            // if ( _udm_node_sanity_test() === false ) {
            //     //dsm("Update rejected!");
            //     // mysql_query('ROLLBACK;', $linkMySql);
            //     // mysql_close($linkMySql);
            //     // return;
            //     //  Exclaim post-sql process message over Slack
            //     $msg = "Node sanity test failed! My process-id is: ".getmypid();
            //     #usa_data_migration_log($msg);
            //     usa_data_migration_error_log("Error: " . $msg);
            //     if ( $shouldSlack ) {
            //         slack_send_message($webhook_url,
            //             "Error: $msg",
            //             "#cmp-notify-verbose",
            //             $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            //         );
            //     }
            //     $trx->rollBack();
            //     return $msg;
            // }
            //dsm("Committing");

            // mysql_query('COMMIT;', $linkMySql);
            // mysql_close($linkMySql);

            // Clear field cache for all synched nodes
            // foreach ( explode(',', $pullData['NodeDump_nidList']) as $nid ) {
            //     $sql = "DELETE FROM cache_field WHERE cid='field:node:{$nid}'";
            //     db_query($sql);
            // }
            if ( trim($pullData['NodeDump_nidList']) !== '' ) {
                db_query("DELETE FROM cache_field WHERE cid IN (:nidList)",
                    array(":nidList"=>array_map(
                        function($nid){return 'field:node:'.$nid;},
                        explode(',', trim($pullData['NodeDump_nidList']))
                    ))
                );
            }

            // Note that NIDs were synched
            $nidsPulled = array_merge($nidsPulled, explode(',', $pullData['NodeDump_nidList']));

            // Log
            error_log('Pulled these nodes from the host-site: '.$pullData['NodeDump_nidList']);

        }

        // Bug-killer: someimtes blank/empty values are somehow getting into the $nidsPulled array
        foreach ( $nidsPulled as $key => $nidPulled ) {
            if ( empty($nidPulled) ) {
                unset($nidsPulled[$key]);
            }
        }

        /* Now we need to watch out for a certain edge-case where:
           If someone were to create an Asset with the "For Use By" field set to X, and make a few revisions...
           the Asset will get synced to site X
           If someone were then to change the "For Use By" field to Y for this given Asset, it needs to be
           removed from site-X. But so far in our code we have no way of telling site-X that this Asset only
           belongs to site-Y.
           ----------
           So here we will sync the /entire/ "For Use By" table, so site-X has the ability to filter itself.
        */
        $filter = trim(variable_get('udm_node_filter_rule', ''));
        if ( !empty($pullData['database_name']) && !empty($filter) ) {

            $cmpDbName = $pullData['database_name'];
            $dontBelongTbl = 'udm_nids_dont_belong_'.uniqid();

            // Since we will change the autocommit-sate, remember this variable's old-value
            // try {
            //     $oldAutoCommitValue = db_query("SELECT @@autocommit")->fetchColumn();
            // } catch (Exception $e) {
            //     // An exception is thrown if this variable is not defined
            //     $oldAutoCommitValue = '-NOT-SET-';
            // }

            // Try to end query caching for sensitive data
            endQueryCaching();

            // Start the transaction
            // db_query('SET SESSION autocommit=0;');
            // db_query('START TRANSACTION WITH CONSISTENT SNAPSHOT;');

            // Force copy ALL data in the For-Us-By tables from the CMP into here (refresh data)
            db_query("DELETE FROM field_data_field_for_use_by_text;");
            db_query("INSERT INTO field_data_field_for_use_by_text SELECT * FROM `{$cmpDbName}`.field_data_field_for_use_by_text;");
            db_query("DELETE FROM field_data_field_for_use_by;");
            db_query("INSERT INTO field_data_field_for_use_by SELECT * FROM `{$cmpDbName}`.field_data_field_for_use_by;");

            // Clean up the For-Us-By tables
            db_query("DELETE FROM field_data_field_for_use_by_text WHERE entity_id NOT IN (SELECT nid FROM node);");
            db_query("DELETE FROM field_data_field_for_use_by WHERE entity_id NOT IN (SELECT nid FROM node);");

            // Try to end/flush query caching for sensitive data
            endQueryCaching();

            // Lets do a quick sanity-check
            $colCount = intval( db_query("SELECT COUNT(*) FROM field_data_field_for_use_by")->fetchColumn() );
            if ( $colCount == 0 ) {
                slack_send_message($webhook_url, 'OH SNAP! The field_data_field_for_use_by table is empty!?', "#cmp-notify-verbose", $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]);
            }
            $colCount = intval( db_query("SELECT COUNT(*) FROM field_data_field_for_use_by_text")->fetchColumn() );
            if ( $colCount == 0 ) {
                slack_send_message($webhook_url, 'OH SNAP! The field_data_field_for_use_by_text table is empty!?', "#cmp-notify-verbose", $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]);
            }

            $trx2 = db_transaction();

            // Determine which nodes need to be filtered out
            db_query("DROP TABLE IF EXISTS {$dontBelongTbl};");
            db_query("CREATE TEMPORARY TABLE {$dontBelongTbl} (nid int) ENGINE=MEMORY;");
            db_query("
                INSERT INTO {$dontBelongTbl}
                    SELECT n.nid
                    FROM node n
                    WHERE
                        type IN ('text_content_type','multimedia_content_type','html_content_type')
                        AND (
                            SELECT COUNT(*)
                            FROM field_data_field_for_use_by_text
                            WHERE
                                entity_id = n.nid
                                AND field_for_use_by_text_value = '{$filter}'
                        ) = 0
                        AND (
                            SELECT COUNT(*)
                            FROM field_data_field_for_use_by
                            WHERE
                                entity_id = n.nid
                                AND field_for_use_by_value = '{$filter}'
                        ) = 0;
            ");

            // Try to end query caching for sensitive data
            endQueryCaching();

            // Sanity check
            $rejNodes = db_query("SELECT COUNT(*) FROM {$dontBelongTbl}")->fetchColumn();
            $rejNodes = intval($rejNodes);
            error_log($rejNodes." nodes are being rejected from the system due to inappropriate For-Us-By field-value(s)");
            if ( $rejNodes > 30 ) {

                // Post a panic message into Slack
                if ( $shouldSlack ) {
                    $msg = "SANITY-FAILURE: The For-Use-By filtration system is trying to delete too many nodes!... bailing...";
                    error_log($msg);
                    slack_send_message($webhook_url, $msg, "#cmp-notify-verbose", $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]);
                }

                db_query("DROP TABLE {$dontBelongTbl};");
                $trx2->rollBack();
                // db_query("ROLLBACK;");

            } else {

                // Spit a msg into Slack
                if ( $shouldSlack ) {
                    $msg = "The For-Use-By filtration system is removing *{$rejNodes}* nodes from the system...";
                    slack_send_message($webhook_url, $msg, "#cmp-notify-verbose", $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]);
                }

                // Delete any nodes from the node table that need to be filtered out
                db_query("DELETE FROM node WHERE nid IN (SELECT nid FROM {$dontBelongTbl});");
                db_query("DROP TABLE {$dontBelongTbl};");

                /// force commit
                try {
                    unset($trx2);
                } catch (Exception $e) {
                    ///
                }
                // db_query("COMMIT;");
            }

            // Restore the autocommit value back to its original state
            // if ( $oldAutoCommitValue !== '-NOT-SET-' ) {
            //     db_query("SET SESSION autocommit={$oldAutoCommitValue};");
            // }
        }

        // Run cleanup process
        usa_data_migration_log("Cleaning up");
        cleanup_killOrphanedNodeRevisions();
        cleanup_killOrphanedFieldData();
        usa_data_migration_log("Clean-up complete");

        // Post run process for node-pulls
        if ( count($nidsPulled) == 0 ) {
            error_log('Not running usa_data_migration_postSynch_s3translate(), as no nodes were synced.');
        } else {
            $nidList = implode(',', $nidsPulled);
            usa_data_migration_postSynch_s3translate($nidList);
        }

        // Exclaim post-process message over Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "Notice: {$thisFunct}() has finished importing nodes and is now running post-synch processes. Firing HOOK_usa_data_migration_synched()... My process-id is: ".getmypid(),
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
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
        #usa_data_migration_log($msg);
        usa_data_migration_error_log("Notice: " . $msg);

        // Exclaim finish message over Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "Notice: {$thisFunct}() has finished importing nodes and running post-synch processes. I am now completely done. My process-id is: ".getmypid(),
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }

    } catch (Exception $e) {
        //  Exclaim post-sql process message over Slack
        $msg = "Exception! My process-id is: ".getmypid()."\n*The exception was:* ".print_r($e,true);
        #usa_data_migration_log($msg);
        usa_data_migration_error_log("Error: " . $msg);
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                "Error: $msg",
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }
        $trx->rollBack();
        return $msg;
    }

    /// $trx should loose scope and cause an auto commit - but lets force it
    try {
        unset($trx);
        if ( $retTrueOnSuccess ) {
            return true;
        } else {
            return $msg;
        }
    } catch (Exception $e){
        // Exclaim overall-finish message
        $msg = "{$thisFunct}() may have failed to commit it's transaction during unset(trx)...  ";
        #usa_data_migration_log($msg);
        usa_data_migration_error_log("Error: " . $msg);

        // Exclaim overall-finish message in Slack
        if ( $shouldSlack ) {
            slack_send_message($webhook_url,
                $msg." My process-id is: ".getmypid(),
                "#cmp-notify-verbose",
                $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]
            );
        }
        return $msg;
    }

}

/*
 * boolean _udm_node_sanity_test()
 *
 * Runs some simple UnitTest-like tests to see if we should abort the the current
 * pending transaction.
 *
 * Note that in this function, we are assuming that a transaction is NOT yet committed
 * and this this transaction was created by mysql_query(), NOT db_query() - hence we
 * will be changing the MySQL ISOLATION LEVEL a bit here to read uncommitted data.
 *
 * This function should return a boolean, TRUE means a green-light, FALSE means that
 * something bad is going on.
 */
function _udm_node_sanity_test() {
    $shouldSlack = usa_data_migration_should_slack();
    $webhook_url = $shouldSlack ? slack_get_default_webhook_url() : '';

    // Tests for the Kids site
    $siteName = strtolower( variable_get('site_name') );
    if ( strpos($siteName, 'kids') !== false ) {

        /* Let us use db_query() and node_load() in a way to see the UN-COMMITTED
        data pending in the transaction */
        db_query("SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");

        // We shall test to see if all the front-page carousel items have links
        if ( _udm_node_sanity_test_frontPageCarouselAssets() === false ) {

            /* If a problem is detected here, we shall run the same test outside the
            transaction or order to see if THIS TRANSACTION is really the problem, or
            if this problem is existing despite the transaction */

            // Let us use db_query() and node_load() in a way to see ONLY COMMITTED data
            db_query("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ");

            if ( _udm_node_sanity_test_frontPageCarouselAssets() ) {

                // then it seems this transaction would break things, we shall abort this transaction

                // Post a message into Slack
                if ( function_exists('slack_send_message') ) {
                    $msg = "SANITY-FAILURE: complete failure by _udm_node_sanity_test()";
                    slack_send_message($webhook_url, $msg, "#cmp-notify-verbose", $_SERVER['HTTP_HOST'],['type'=>'','icon'=>0,'emoji'=>0]);
                }
                return false;
            }
        }

    }

    // Make sure we set this mode back to normal before returningo
    db_query("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ");

    return true;
}

/* Returns FALSE when a problem is detected, TRUE when everything is fine */
function _udm_node_sanity_test_frontPageCarouselAssets() {

    // We shall test to see if all the front-page carousel items have links
    $sysPath = drupal_lookup_path('source', 'index.shtml');
    $frontPageTid = intval( str_replace('taxonomy/term/', '', $sysPath) );
    $frontPageTerm = taxonomy_term_load($frontPageTid);
    $frontPageAssets = _udm_getAssetsInSiteStructTerm($frontPageTerm, false, true);
    $frontPageCarouselAssets = $frontPageAssets['carousel'];

    foreach ( $frontPageCarouselAssets as $carouselAsset ) {
        $urlVal = db_query("SELECT field_url_value FROM field_data_field_url WHERE entity_id=".$carouselAsset)->fetchColumn();
        if ( empty($urlVal) || trim($urlVal) === '' ) {
            //dsm("FAIL");
            return false;
        }
    }

    //dsm("PASS");
    return true;
}


/**
 * array _udm_getAssetsInSiteStructTerm($term[, $loadAssets = false])
 *
 * Given a loaded Site-Structure taxonomy-term, this function will find all the
 * assets assigned to this node.
 *
 * Returns an array of node-IDs, or array of loaded nodes (based on the seconds argument).
 */
if ( !function_exists('_udm_getAssetsInSiteStructTerm') ) {
    function _udm_getAssetsInSiteStructTerm($term, $loadAssets = false, $maintainSections = false) {

        $ret = array();

        // Get the top-level-term name for this $term
        if ( empty($term->tid) ) {
            return array();
        }

        $siteName = strtolower( variable_get('site_name') );
        if ( strpos($siteName, 'kids') !== false ) {

            // These fields in S.S-taxonomy-terms hold pointers to nodes (assets)
            $assetFieldContainers = array(
                'field_asset_order_carousel',
                'field_asset_order_content',
                'field_asset_order_sidebar',
                'field_asset_order_bottom'
            );

            // Look in each of these fields for node-id references
            foreach ( $assetFieldContainers as $assetFieldContainer ) {
                if ( !empty($term->{$assetFieldContainer}) && !empty($term->{$assetFieldContainer}['und']) ) {

                    // Look for [multiple] node-id references in this field
                    foreach ( $term->{$assetFieldContainer}['und'] as $targetContainer ) {

                        if ( $maintainSections ) {
                            $regionName = strrev(strtok(strrev($assetFieldContainer), '_'));
                            if ( !isset($ret[$regionName]) ) {
                                $ret[$regionName] = array();
                            }
                            $ret[$regionName][] = $targetContainer['target_id'];
                        } else {
                            $ret[] = $targetContainer['target_id'];
                        }
                    }
                }
            }

        } else {

            /* NON-Kids site logic (lookup based on Asset-Topic assignment) */

            // Get all topic-ids this $term references
            $arrTopicIds = array();
            if ( !empty($term->field_asset_topic_taxonomy) && !empty($term->field_asset_topic_taxonomy['und']) ) {
                foreach ( $term->field_asset_topic_taxonomy['und'] as $topicIdContainer ) {
                    $arrTopicIds[] = $topicIdContainer['tid'];
                }
            }
            $strTopicIds = implode(',', $arrTopicIds);

            // Get all node-IDs that reference these $strTermIds
            if ( trim($strTopicIds) === '' ) {

                // There are no Topics selected, so there can't be any assets associated
                $ret  = array();

            } else {

                // Query MySQL to get all node-IDs that reference these $strTermIds
                $ret = db_query("
                    SELECT entity_id
                    FROM field_data_field_asset_topic_taxonomy
                    WHERE
                        field_asset_topic_taxonomy_tid in ({$strTopicIds})
                        AND entity_type='node'
                ")->fetchCol();
            }

        }

        if ( !$maintainSections ) {
            sort($ret);
        }

        // Load the assets if requested
        if ( $loadAssets ) {
            if ( $maintainSections ) {
                foreach ($ret as &$section) {
                    foreach ( $section as &$n ) {
                        $n = node_load($n);
                    }
                }
            } else {
                foreach ($ret as &$n) {
                    $n = node_load($n);
                }
            }
        }

        return ( is_null($ret) ? array() : $ret);
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
    $sql = "DELETE FROM node_access WHERE nid NOT IN ( SELECT n.nid FROM node n );\n";
    set_time_limit(800);
    db_query($sql);

    // node_comment_statistics
    if ( db_table_exists('node_comment_statistics') ) {
        $sql = "DELETE FROM node_comment_statistics WHERE nid NOT IN ( SELECT n.nid FROM node n );\n";
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
                $sql = "DELETE FROM {$tbl} WHERE entity_type = 'node' AND entity_id NOT IN ( SELECT nid FROM node );\n";
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
                        AND entity_id NOT IN ( SELECT tid FROM taxonomy_term_data );
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
        $alias = str_replace('http://kids.usa.gov/',  '', $alias);
        $alias = str_replace('https://kids.usa.gov/', '', $alias);
        $alias = str_replace('//kids.usa.gov/', '', $alias);
        $alias = str_replace('http://usa.gov/',  '', $alias);
        $alias = str_replace('https://usa.gov/', '', $alias);
        $alias = str_replace('//usa.gov/', '', $alias);
        $alias = str_replace('http://gobierno.usa.gov/',  '', $alias);
        $alias = str_replace('https://gobierno.usa.gov/', '', $alias);
        $alias = str_replace('//gobierno.usa.gov/', '', $alias);
        $alias = str_replace('http://',  '', $alias);
        $alias = str_replace('https://', '', $alias);
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

    $strNids = trim($strNids);

    if ( intval(variable_get('udm_filemedia_s3translate', 0)) == 0 ) {
        return;
    }

    error_log(__FUNCTION__.'() started for nodes: ' . $strNids);

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


    $s3conf = variable_get('cmp_s3_config');
    $s3path = '//'.$s3conf['bucket'].'.s3.amazonaws.com/';

    foreach ( $nids as $nid ) {

        $entity = node_load($nid);

        // and if it has an atttached file in S3...
        if ( empty($entity->field_file_media['und'][0]['uri']) ) {

            //error_log('empty dude');

        } else {

            $s3url   = $entity->field_file_media['und'][0]['uri'];
            $s3url   = str_replace('s3:///', 's3://', $s3url);
            $realURL = str_replace('s3://', $s3path, $s3url);

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

    db_query("UPDATE field_data_field_html SET field_html_value=REPLACE(field_html_value, 'S3://', 's3://');");
    db_query("UPDATE field_data_field_html SET field_html_value=REPLACE(field_html_value, 's3://', '{$s3path}');");

    db_query("UPDATE field_revision_field_html SET field_html_value=REPLACE(field_html_value, 'S3://', 's3://');");
    db_query("UPDATE field_revision_field_html SET field_html_value=REPLACE(field_html_value, 's3://', '{$s3path}');");

    db_query("UPDATE field_data_body SET body_value=REPLACE(body_value, 'S3://', 's3://') WHERE bundle IN ('text_content_type');");
    db_query("UPDATE field_data_body SET body_value=REPLACE(body_value, 's3://', '{$s3path}') WHERE bundle IN ('text_content_type');");

    db_query("UPDATE field_revision_body SET body_value=REPLACE(body_value, 'S3://', 's3://') WHERE bundle IN ('text_content_type');");
    db_query("UPDATE field_revision_body SET body_value=REPLACE(body_value, 's3://', '{$s3path}') WHERE bundle IN ('text_content_type');");

    foreach ( $nids as $nid ) {
        db_query("DELETE FROM cache_field WHERE cid='field:node:{$nid}'");
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

/**
 * void endQueryCaching()
 *
 * This function tries to flush query-cache, when it fails to do so, it
 * will try to flush the query-cache
 */
function endQueryCaching() {

    try {

        // Try to turn off query-cache
        db_query("SET query_cache_type=0 ");

    } catch (Exception $e) {

        // It seems we can't turn it off, so we'll just flush the cache
        db_query("FLUSH QUERY CACHE");
    }

}
