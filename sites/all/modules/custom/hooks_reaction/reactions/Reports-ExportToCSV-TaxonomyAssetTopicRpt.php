<?php /*

    [--] PURPOSE [--]
    
    This script will inject a "Export to Excel" link into the "Asset Topic" report.
    This report is located at: /content-tag-report?machine_name=asset_topic_taxonomy

    [--] TICKET HISTORY [--]

    2015-05-19 - Created to resolve ticket: usagov-100377: "Enable exports for the website generation and site structure reports[...]"
        
*/

/**
 * Implements HOOK_menu().
 *
 * Registers the URL-path: /content-tag-report/export-asset-topic-taxonomy to return a
 * page generated from exportAssetTopicTaxonomyReportToCSV()
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register the URL-path: /content-tag-report/export-asset-topic-taxonomy to return a page generated from exportAssetTopicTaxonomyReportToCSV()
        $menuArr['content-tag-report/export-asset-topic-taxonomy'] = array(
            'title' => '',
            'description' => 'CSV export for the Asset-Topic-Taxonomy report at /content-tag-report/export',
            'page callback' => 'exportAssetTopicTaxonomyReportToCSV',
            'access callback' => 'user_is_logged_in',
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

hooks_reaction_add("HOOK_views_post_render",
    function (&$view, &$output, &$cache) {

        if ( $view->name === 'content_taxonomy_report' && strpos(request_uri(), 'machine_name=asset_topic_taxonomy') !== false ) {
            $thisFile = basename(__FILE__);
            $prependMarkup = '<a style="float: right" rendersource="'.$thisFile.'" href="javascript: getReport(\''.uniqid().'\'); void(0);">Asset Topic Taxonomy with All Parents and Pages Report</a>';
            $output = $prependMarkup.$output;

            drupal_add_js('sites/all/modules/custom/hooks_reaction/reactions/Reports-ExportToCSV-TaxonomyAssetTopicRpt.js');
        }
    }
);

/**
 * void exportAssetTopicTaxonomyReportToCSV()
 *
 * A callback function for /content-tag-report/export-asset-topic-taxonomy
 * This function will return a file to download, to the browser.
 * WARNING: This function will terminate the PHP thread.
 */
function exportAssetTopicTaxonomyReportToCSV() {

    $reportsTATR = variable_get('reports_tatr', array());

    // Clear anything Drupal has tried printing/rendering so far    
    @ob_end_clean();
    while( @ob_end_clean() );

    // Argument validation
    if ( empty($_REQUEST['reqid']) ) {
        exit('Missing reqid argument');
    }
    $reqid = $_REQUEST['reqid'];

    // Check to see if another thread is working on this report already
    if ( isset($reportsTATR[$reqid]) && $reportsTATR[$reqid] === 'working' ) {
        exit('working');
    }

    // Check to see if another thread has already completed this report [of report-id reqid]
    if ( isset($reportsTATR[$reqid]) && $reportsTATR[$reqid] === 'complete' ) {

        // So this report must be completed now - but~ is the report saved on THIS server?
        if ( !file_exists("sites/default/files/report_tatr_{$reqid}.csv") ) {

            /* Nope, so tell the client its still in the works, it's next request will
            probably hit a different server (the one where the report is saved) */
            exit('working');

        } else {

            /* it is, so read this out to the client - JavaScript will take it from there (it 
            will simulate the download) */
            readfile("sites/default/files/report_tatr_{$reqid}.csv");
            exit();
        }
    }

    /*  ==================================================
        FROM THIS POINT ON WE ASSUME WE ARE THE FIRST CALL FOR THIS $reqid, FROM 
        HERE WE WILL BUILD THE ACTUAL REPORT.
        ==================================================
    */

    /* Place a flag in the database, visible to all servers and PHP-threads that 
    this reqid is in the works */
    $reportsTATR[$reqid] = 'working';
    variable_set('reports_tatr', $reportsTATR);

    // Get the vocabulary-id
    $vocab = taxonomy_vocabulary_machine_name_load('asset_topic_taxonomy');

    // Initalize the row-counter in the CSV
    $counter = -1;
    $hierarchyLevelSemaphore = -1;
    $rows = array();

    // Compile the report as per the requierments in usagov-100377
    $topTerms = taxonomy_get_tree($vocab->vid, 0, 1);
    foreach ( $topTerms as $topTerm ) {
        compileAssetTopicTaxonomyReportToCSV($counter, $hierarchyLevelSemaphore, $rows, $vocab->vid, $topTerm->tid);
    }

    // Open the file for writing
    $h = fopen("sites/default/files/report_tatr_{$reqid}.csv", 'w');
    if ( $h === false ) {
        exit('error');
    }

    // Write the CSV headers
    fwrite($h, '"counter","Title","Parent Title","Hierarchy Level","Type","CMP Edit Link","Assets-Nodes Associated (cumulative)","For Use By","Owner","Status",');
    for ( $T = 1 ; $T < intval(variable_get('tatr_lastmaxcolcount', 3)); $T++ ) {
        if ( $T > 1 ) {
            fwrite($h, ',');
        }
        fwrite($h, '"Page Title '.$T.'"');
    }
    fwrite($h, "\n");

    // Write the CSV content
    foreach ( $rows as $row ) {
        foreach ( array_values($row) as $cellId => $cellValue) {
            if ( $cellId != 0 ) {
                fwrite($h, ",");
            }
            fwrite($h, "\"".$cellValue."\"");
        }
        fwrite($h, "\n");
    }
    fclose($h);

    /* Place a flag in the database, visible to all servers and PHP-threads that 
    this reqid is created and complete */
    $reportsTATR[$reqid] = 'complete';
    variable_set('reports_tatr', $reportsTATR);

    exit('working');
}

/**
 * void compileSiteStructureTaxonomyReportToCSV(&$counter, &$lvlSemaphore, &$rows, $vid, $tid)
 *
 * This function reads through the taxonomy data in this environment, creating a report, which is
 * returned into the $rows by-reference variable supplied to this function.
 * This function works in a recursive manor.
 */
function compileAssetTopicTaxonomyReportToCSV(&$counter, &$lvlSemaphore, &$rows, $vid, $tid) {

    $lvlSemaphore++;
    $counter++;
    $newRow = array();

    // Load the target term
    $term = taxonomy_term_load($tid);

    // Get parent-term's page-title
    $termParents = array_values(taxonomy_get_parents($tid));
    if ( empty($termParents[0]) ) {
        $termParentPageTitle = 'N/A';
    } else {
        $termParentPageTitle = $termParents[0]->name;
    }

    // Add the new row to the report - for the Asset Topic
    $rows[] = array(
        'counter' => $counter,
        'Title' => $term->name,
        'Parent Title' => $termParentPageTitle,
        'Hierarchy Level' => $lvlSemaphore,
        'Type' => 'Asset Topic (taxonomy-term)',
        'CMP Edit Link' => "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/{$tid}/edit",
        'Assets-Nodes Associated (cumulative)' => findNodeCountAssociatedWithTopicCumulatively($vid, $tid),
        'For Use By' => '',
        'Owner' => '',
        'Status' => ''
    );

    // Get the nodes associated with this Topic
    $nodes = findNodesAssociatedWithTopic($tid);
    foreach ($nodes as $node ) {

        // Get the 'For Use By' text for this node
        $forUseBy = array();
        if ( property_exists('field_for_use_by_text',$node) &&
             array_has_key('und',$node->field_for_use_by_text) )
        {
            foreach ( $node->field_for_use_by_text['und'] as $valCont ) {
                $forUseBy[] = $valCont['value'];
            }
        }
        $forUseBy = implode(', ', $forUseBy);

        // Prepare to add new row to the report - for this node under this Asset Topic
        $counter++;
        $newRow = array(
            'counter' => $counter,
            'Title' => $node->title,
            'Parent Title' => $term->name,
            'Hierarchy Level' => ($lvlSemaphore + 1),
            'Type' => 'Asset (node)',
            'CMP Edit Link' => "https://".$_SERVER['HTTP_HOST']."/node/{$node->nid}/edit",
            'Assets-Nodes Associated (cumulative)' => '',
            'For Use By' => $forUseBy,
            'Owner' => !empty($node->field_owner['und'][0]['target_id'])? (tssr_get_username($node->field_owner['und'][0]['target_id'])) : 'NOT SET IN CMP',
            'Status' => ($node->status)? 'Published':'Unpublished'
        );

        // For each page this node apears on, add a new column
        $siteStructTaxTerms = tatr_findSiteStructTermsThatReferenceAsset($node->nid);
        foreach ( $siteStructTaxTerms as $siteStructTaxTerm ) {
            $newRow[] = db_query("SELECT name FROM taxonomy_term_data WHERE tid={$siteStructTaxTerm}")->fetchColumn();
        }

        // Note the number of additional columns (to correct the header-cound for the next report)
        if ( variable_get('tatr_lastmaxcolcount', 3) < count($siteStructTaxTerms) ) {
            variable_set('tatr_lastmaxcolcount', count($siteStructTaxTerms)+1);
        }

        // Add new row to the report - for this node under this Asset Topic
        $rows[] = $newRow;

    }

    // Recursively run this same function on all children to this taxonomy-term
    $children = taxonomy_get_tree($vid, $tid, 1);
    foreach ( $children as $child ) {
        compileAssetTopicTaxonomyReportToCSV($counter, $lvlSemaphore, $rows, $vid, $child->tid);
    }

    $lvlSemaphore--;
}

function findNodeCountAssociatedWithTopicCumulatively($vid, $tid) {

    // Start with the count of nodes associated directly with this term
    $sum = findNodeCountAssociatedWithTopic($tid);

    // Now run through all children, recursively, counting node-associations
    $children = taxonomy_get_tree($vid, $tid, 1);
    foreach ( $children as $child ) {
        $sum += findNodeCountAssociatedWithTopicCumulatively($vid, $child->tid);
    }

    return $sum;
}

function findNodeCountAssociatedWithTopic($tid) {

    return db_query("
        SELECT COUNT(entity_id) 
        FROM field_data_field_asset_topic_taxonomy 
        WHERE
            field_asset_topic_taxonomy_tid={$tid}
            AND entity_type = 'node'
    ")->fetchColumn();
}

function findNodesAssociatedWithTopic($tid) {

    $nids = db_query("
        SELECT entity_id 
        FROM field_data_field_asset_topic_taxonomy 
        WHERE field_asset_topic_taxonomy_tid={$tid}
    ")->fetchCol();

    $nodes = node_load_multiple($nids);
    return array_values($nodes);
}

/*
 * array findSiteStructTermsThatReferenceAsset(int $assetNid)
 *
 * Searches MySQL to find all taxonomy terms that reference 
 * $assetNid in any of the "Asset Placement" fields.
 *
 * This will also scan for non-Kids.gov terms that associate 
 * with the same Asset Topic that this node associates with.
 *
 * Returns an array of term-ids.
 */
function tatr_findSiteStructTermsThatReferenceAsset($assetNid) {

    $ret = array();

    // Tables to search
    $tables = array(
        "field_data_field_asset_order_carousel",
        "field_data_field_asset_order_content",
        "field_data_field_asset_order_sidebar",
        "field_data_field_asset_order_bottom",
    );

    // Search the assets tables (on the S.S.-tax-terms)
    foreach ( $tables as $table ) {
        $valueColumn = str_replace('field_data_', '', $table);
        $results = db_query("SELECT entity_id FROM {$table} WHERE {$valueColumn}_target_id={$assetNid}");
        foreach ( $results as $result ) {
            $tid = $result->entity_id;
            $ret[$tid] = $tid;
        }
    }

    // Get the "Asset Topic"(s) this node is associated with
    // And use db_query() since its faster than node_load()
    $topicIds = db_query("
        SELECT field_asset_topic_taxonomy_tid
        FROM field_data_field_asset_topic_taxonomy
        WHERE
            entity_type = 'node'
            AND entity_id = {$assetNid}
    ")->fetchCol();
    $topicIds = implode(',', $topicIds);

    /* For each "Asset Topic" this node is associated with;
    Get all S.S.-taxonomy-terms that are associated with 
    these Asset-Topic(s). Only get non-Kids terms */
    $results = db_query("
        SELECT entity_id
        FROM field_data_field_asset_topic_taxonomy att
        LEFT JOIN taxonomy_tlt_name tlt ON ( tlt.tid = att.entity_id )
        WHERE
            entity_type = 'taxonomy_term'
            AND field_asset_topic_taxonomy_tid IN ($topicIds)
            AND tlt.tlt_name <> 'Kids.gov'
    ");
    foreach ($results as $record ) {
        $ret[$record->entity_id] = $record->entity_id;
    }

    return array_values($ret);
}