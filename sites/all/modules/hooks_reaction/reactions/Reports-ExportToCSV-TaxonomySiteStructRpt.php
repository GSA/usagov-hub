<?php /*

    [--] PURPOSE [--]
    
    This script will inject a "Export to Excel" link into the "Site Structure Taxonomy" report.
    This report is located at: /content-tag-report?machine_name=site_strucutre_taxonomy

    [--] TICKET HISTORY [--]

    2015-05-19 - Created to resolve ticket: usagov-100377: "Enable exports for the website generation and site structure reports[...]"
        
*/

/**
 * Implements HOOK_menu().
 *
 * Registers the URL-path: /content-tag-report/export-site-strucutre-taxonomy to return a 
 * page generated from exportSiteStructureTaxonomyReportToCSV()
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register the URL-path: /content-tag-report/export-site-strucutre-taxonomy to return a page generated from exportSiteStructureTaxonomyReportToCSV()
        $menuArr['content-tag-report/export-site-strucutre-taxonomy'] = array(
            'title' => '',
            'description' => 'CSV export for the Site-Structure-Taxonomy report at /content-tag-report/export',
            'page callback' => 'exportSiteStructureTaxonomyReportToCSV',
            'access arguments' => array(true),
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

hooks_reaction_add("HOOK_views_post_render",
    function (&$view, &$output, &$cache) {

        if ( $view->name === 'content_taxonomy_report' && strpos(request_uri(), 'machine_name=site_strucutre_taxonomy') !== false ) {
            $thisFile = basename(__FILE__);
            $prependMarkup = '<a style="float: right" rendersource="'.$thisFile.'" href="/content-tag-report/export-site-strucutre-taxonomy">Export to Excel</a>';
            $output = $prependMarkup.$output;
        }
    }
);

/**
 * void exportSiteStructureTaxonomyReportToCSV()
 *
 * A callback function for /content-tag-report/export-site-strucutre-taxonomy
 * This function will return a file to download, to the browser.
 * WARNING: This function will terminate the PHP thread.
 */
function exportSiteStructureTaxonomyReportToCSV() {

    // Clear anything Drupal has tried printing/rendering so far    
    @ob_end_clean();
    while( @ob_end_clean() );

    // Get the vocabulary-id
    $vocab = taxonomy_vocabulary_machine_name_load('site_strucutre_taxonomy');

    // Initalize the row-counter in the CSV
    $counter = -1;
    $hierarchyLevelSemaphore = -1;
    $rows = array();

    // Compile the report as per the requierments in usagov-100377
    $topTerms = taxonomy_get_tree($vocab->vid, 0, 1);
    foreach ( $topTerms as $topTerm ) {
        compileSiteStructureTaxonomyReportToCSV($counter, $hierarchyLevelSemaphore, $rows, $vocab->vid, $topTerm->tid);
    }

    // Set headers for a CSV download
    @header("Content-type: text/csv");
    @header('Content-Disposition: attachment; filename="report.csv"');
    @header("Pragma: no-cache");
    @header("Expires: 0");

    // Print the CSV headers
    print '"counter","Page Title","Parent Title","Hierarchy Level","Page Type","Friendly URL","CMP Edit Link","Assets on Page",';
    for ( $T = 1 ; $T < intval(variable_get('tssr_lastmaxcolcount', 3)); $T++ ) {
        if ( $T > 1 ) {
            print ',';
        }
        print '"Asset Title '.$T.'"';
    }
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
    
}

/**
 * void compileSiteStructureTaxonomyReportToCSV(&$counter, &$lvlSemaphore, &$rows, $vid, $tid)
 *
 * This function reads through the taxonomy data in this environment, creating a report, which is 
 * returned into the $rows by-reference variable supplied to this function.
 * This function works in a recursive manor.
 */
function compileSiteStructureTaxonomyReportToCSV(&$counter, &$lvlSemaphore, &$rows, $vid, $tid) {

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
        if ( empty($termParents[0]->field_page_title['und'][0]['value']) ) {
            $termParentPageTitle = 'NOT SET IN CMP';
        } else {
            $termParentPageTitle = $termParents[0]->field_page_title['und'][0]['value'];
        }
    }

    // Get all assets associated with this term
    $assets = array();
    if ( !empty($term->field_asset_order_carousel['und']) ) {
        $assets = array_merge($assets, $term->field_asset_order_carousel['und']);
    }
    if ( !empty($term->field_asset_order_content['und']) ) {
        $assets = array_merge($assets, $term->field_asset_order_content['und']);
    }
    if ( !empty($term->field_asset_order_sidebar['und']) ) {
        $assets = array_merge($assets, $term->field_asset_order_sidebar['und']);
    }
    if ( !empty($term->field_asset_order_bottom['und']) ) {
        $assets = array_merge($assets, $term->field_asset_order_bottom['und']);
    }

    // Prepare to add a new row into the report
    $newRow = array(
        'counter' => $counter,
        'Page Title' => ( !empty($term->field_page_title['und'][0]['value']) ? $term->field_page_title['und'][0]['value'] : 'NOT SET IN CMP' ),
        'Parent Title' => $termParentPageTitle,
        'Hierarchy Level' => $lvlSemaphore,
        'Page Type' => ( !empty($term->field_type_of_page_to_generate['und'][0]['value']) ? $term->field_type_of_page_to_generate['und'][0]['value'] : 'NOT SET IN CMP' ),
        'Friendly URL' => ( !empty($term->field_friendly_url['und'][0]['value']) ? $term->field_friendly_url['und'][0]['value'] : 'NOT SET IN CMP' ),
        'CMP Edit Link' => "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/{$tid}/edit",
        'Assets on Page' => count($assets),
    );

    // For each asset associated with this term, add a new cell (column) with the asset's title
    foreach ( $assets as $assetId => $assetTargetIdContainer ) {
        // I'm using db_query here rather than node_load because it's faster (and really makes a difference in a recursive loop like this)
        $newRow["Asset ".($assetId+1)] = db_query("SELECT title FROM node WHERE node.nid={$assetTargetIdContainer['target_id']}")->fetchColumn();
    }

    // Note the number of additional columns (to correct the header-cound for the next report)
    if ( variable_get('tssr_lastmaxcolcount', 3) < count($assets) ) {
        variable_set('tssr_lastmaxcolcount', count($assets)+1);
    }

    // Add the new row to the report
    $rows[] = $newRow;

    // Recursively run this same function on all children to this taxonomy-term
    $children = taxonomy_get_tree($vid, $tid, 1);
    foreach ( $children as $child ) {
        compileSiteStructureTaxonomyReportToCSV($counter, $lvlSemaphore, $rows, $vid, $child->tid);
    }

    $lvlSemaphore--;
}
