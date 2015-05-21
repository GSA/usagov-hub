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
            'access arguments' => array(true),
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

hooks_reaction_add("HOOK_views_post_render",
    function (&$view, &$output, &$cache) {

        if ( $view->name === 'content_taxonomy_report' && strpos(request_uri(), 'machine_name=asset_topic_taxonomy') !== false ) {
            $thisFile = basename(__FILE__);
            $prependMarkup = '<a style="float: right" rendersource="'.$thisFile.'" href="/content-tag-report/export-asset-topic-taxonomy">Export to Excel</a>';
            $output = $prependMarkup.$output;
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

    // Clear anything Drupal has tried printing/rendering so far    
    @ob_end_clean();
    while( @ob_end_clean() );

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

    // Set headers for a CSV download
    @header("Content-type: text/csv");
    @header('Content-Disposition: attachment; filename="report.csv"');
    @header("Pragma: no-cache");
    @header("Expires: 0");

    // Print the CSV headers
    print '"counter","Title","Parent Title","Hierarchy Level","Type","CMP Edit Link","Assets on Page",';
    print '"Asset 1","Asset 2","Asset 3","Asset 4","Asset 5"';
    print "\n";

    // Print the CSV content
    foreach ( $rows as $row ) {
        foreach ( array_values($row) as $cellId => $cellValue) {
            if ( $cellId != 0 ) {
                print ",";
            }
            print "\"".$cellValue."\"";
        }
        print "\n";
    }

    exit();
    
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
    );

    // Get the nodes associated with this Topic
    $nodes = findNodesAssociatedWithTopic($tid);
    foreach ($nodes as $node ) {

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
        );

        // For each page this node apears on, add a new column
        $siteStructTaxTerms = tatr_findSiteStructTermsThatReferenceAsset($node->nid);
        foreach ( $siteStructTaxTerms as $siteStructTaxTerm ) {
            $newRow[] = db_query("SELECT name FROM taxonomy_term_data WHERE tid={$siteStructTaxTerm}")->fetchColumn();
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
        WHERE field_asset_topic_taxonomy_tid={$tid}
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

    foreach ( $tables as $table ) {
        $valueColumn = str_replace('field_data_', '', $table);
        $results = db_query("SELECT entity_id FROM {$table} WHERE {$valueColumn}_target_id={$assetNid}");
        foreach ( $results as $result ) {
            $nid = $result->entity_id;
            $ret[$nid] = $nid;
        }
    }

    return array_values($ret);
}