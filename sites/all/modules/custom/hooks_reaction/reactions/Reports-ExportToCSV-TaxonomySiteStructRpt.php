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
            'access callback' => 'user_is_logged_in',
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

hooks_reaction_add("HOOK_views_post_render",
    function (&$view, &$output, &$cache) {

        if ( $view->name === 'content_taxonomy_report' && strpos(request_uri(), 'machine_name=site_strucutre_taxonomy') !== false ) {
            $thisFile = basename(__FILE__);
            $prependMarkup = '<a style="float: right" rendersource="'.$thisFile.'" href="javascript: getReport(\''.uniqid().'\'); void(0);">Site Structure Taxonomy with Assets on Page Report</a>';
            $output = $prependMarkup.$output;
            drupal_add_js('sites/all/modules/custom/hooks_reaction/reactions/Reports-ExportToCSV-TaxonomySiteStructRpt.js');
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

    $reportsTSSR = variable_get('reports_tssr', array());

    // Clear anything Drupal has tried printing/rendering so far    
    @ob_end_clean();
    while( @ob_end_clean() );

    // Argument validation
    if ( empty($_REQUEST['reqid']) ) {
        exit('Missing reqid argument');
    }
    $reqid = $_REQUEST['reqid'];

    // Check to see if another thread is working on this report already
    if ( isset($reportsTSSR[$reqid]) && $reportsTSSR[$reqid] === 'working' ) {
        exit('working');
    }

    // Check to see if another thread has already completed this report [of report-id reqid]
    if ( isset($reportsTSSR[$reqid]) && $reportsTSSR[$reqid] === 'complete' ) {

        // So this report must be completed now - but~ is the report saved on THIS server?
        if ( !file_exists("sites/default/files/report_tssr_{$reqid}.csv") ) {

            /* Nope, so tell the client its still in the works, it's next request will
            probably hit a different server (the one where the report is saved) */
            exit('working');

        } else {

            /* it is, so read this out to the client - JavaScript will take it from there (it 
            will simulate the download) */
            readfile("sites/default/files/report_tssr_{$reqid}.csv");
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
    $reportsTSSR[$reqid] = 'working';
    variable_set('reports_tssr', $reportsTSSR);

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

    // Open the file for writing
    $h = fopen("sites/default/files/report_tssr_{$reqid}.csv", 'w');
    if ( $h === false ) {
        exit('error');
    }

    // Print the CSV headers
    fwrite($h, '"counter","Site","Page Title","Parent Title","Owner","Hierarchy Level","Page Type","Topic Desk Replacement","Friendly URL","CMP Edit Link","Assets on Page",');
    //  fwrite($h, '"counter","Site","Page Title","Parent Title","Hierarchy Level","Page Type","Friendly URL","CMP Edit Link","Assets on Page",');

    for ( $T = 1 ; $T < intval(variable_get('tssr_lastmaxcolcount', 3)); $T++ ) {
        if ( $T > 1 ) {
            fwrite($h, ',');
        }
        fwrite($h, '"Asset Title '.$T.'"');
    }
    fwrite($h, "\n");

    // Print the CSV content
    foreach ( $rows as $row ) {
        foreach ( array_values($row) as $cellId => $cellValue) {
            if ( $cellId != 0 ) {
                fwrite($h, ",");
            }
            fwrite($h, "\"".$cellValue."\"");
        }
        fwrite($h, "\n");
    }

    /* Place a flag in the database, visible to all servers and PHP-threads that 
    this reqid is created and complete */
    fwrite($h, "\n");
    $reportsTSSR[$reqid] = 'complete';
    variable_set('reports_tssr', $reportsTSSR);

    exit('working');
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
    $assets = tssr_getAssetsInSiteStructTerm($term);

    $help_desk = 'NOT SET IN CMP';
    if (isset($term->field_help_desk['und'][0]['tid'])) {
        $help_term = taxonomy_term_load($term->field_help_desk['und'][0]['tid']);
        $help_desk = (!empty($help_term))? $help_term->name : '';
    }

    // Prepare to add a new row into the report
    $newRow = array(
        'counter' => $counter,
        'Site' => db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid={$term->tid}")->fetchColumn(),
        'Page Title' => tssr_sanitzie( !empty($term->field_page_title['und'][0]['value']) ? $term->field_page_title['und'][0]['value'] : 'NOT SET IN CMP' ),
        'Parent Title' => tssr_sanitzie($termParentPageTitle),
        'Owner' => !empty($term->field_term_owner['und'][0]['target_id'])? (tssr_get_username($term->field_term_owner['und'][0]['target_id'])) : 'NOT SET IN CMP',
        'Hierarchy Level' => $lvlSemaphore,
        'Page Type' => ( !empty($term->field_type_of_page_to_generate['und'][0]['value']) ? $term->field_type_of_page_to_generate['und'][0]['value'] : 'NOT SET IN CMP' ),
        'Help Desk'=> $help_desk,
        'Friendly URL' => ( !empty($term->field_friendly_url['und'][0]['value']) ? $term->field_friendly_url['und'][0]['value'] : 'NOT SET IN CMP' ),
        'CMP Edit Link' => "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/{$tid}/edit",
        'Assets on Page' => count($assets),
    );

    // For each asset associated with this term, add a new cell (column) with the asset's title
    foreach ( $assets as $assetId => $nid ) {
        // I'm using db_query here rather than node_load because it's faster (and really makes a difference in a recursive loop like this)
        $newRow["Asset ".($assetId+1)] = tssr_sanitzie( db_query("SELECT title FROM node WHERE node.nid={$nid}")->fetchColumn() );
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

/**
 * array tssr_getAssetsInSiteStructTerm(object $term)
 *
 * This function finds all assets associated to the given Site-Structure taxonomy
 * term, and returns an array. The array returned is an array of nod-IDs.
 */
function tssr_getAssetsInSiteStructTerm($term) {

    $ret = array();

    // Get the top-level-term name for this $term
    if ( empty($term->tid) ) {
        return array();
    }
    $tltName = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid=".$term->tid)->fetchColumn();
    if ( $tltName === false ) {
        return array();
    }

    if ( $tltName === 'Kids.gov' ) {

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
                    $ret[] = $targetContainer['target_id'];
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

    return ( is_null($ret) || !is_array($ret) ? array() : $ret );
}

function tssr_get_username($str) {
    $username = db_query("SELECT name FROM users WHERE uid={$str}")->fetchColumn();
    return $username;
}

function tssr_sanitzie($str) {

    $table = array(
        'Š'=>'S', 'š'=>'s', 'Ð'=>'Dj', 'Ž'=>'Z', 'ž'=>'z', 'C'=>'C', 'c'=>'c', 'C'=>'C', 'c'=>'c',
        'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
        'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
        'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss',
        'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e',
        'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o',
        'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b',
        'ÿ'=>'y', 'R'=>'R', 'r'=>'r', "'"=>'-', '"'=>'-'
    );

    return strtr($str, $table);
}