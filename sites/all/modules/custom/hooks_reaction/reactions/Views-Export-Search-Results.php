<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to assist the dump_nodes View with rendering - this View uses
    some custom functions that must be defined outside of the View.

    This helper script also assists in altering the query sent to MySQL for this View,

    This View is located at: https://<site>/admin/structure/views/view/dump_nodes/edit/views_data_export_1

*/

hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register the URL-path: /content-tag-report/export-asset-topic-taxonomy to return a page generated from exportAssetTopicTaxonomyReportToCSV()
        $menuArr['export-search-api-csv/%/search_text_multimedia_html'] = array(
            'title' => '',
            'description' => 'CSV export for the Search Result report export-search-api-csv/search_text_multimedia_html',
            'page callback' => 'exportSearchTextMultiMediaHtmlToCSV',
            'access callback' => 'user_is_logged_in',
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

hooks_reaction_add("HOOK_views_post_render",
    function (&$view, &$output, &$cache) {
        $views = array('search_text_multimedia_html', 'search_files', 'search_state_details','search_directory_records_index', 'search_content_items');

        if ( in_array($view->name, $views)) {
            $thisFile = basename(__FILE__);
            $prependMarkup = '<a style="float: right" rendersource="'.$thisFile.'" href="javascript: getReport(\''.uniqid().'\'); void(0);">Export to Excel</a>';
            $output = $prependMarkup.$output;

            drupal_add_js('sites/all/modules/custom/hooks_reaction/reactions/Views-Export-Search-Results-'.$view->name.'.js');
            _cacheSearchResult($view->result, $view->name);
        }
    }
);

function _cacheSearchResult($data, $viewname) {
    unset($_SESSION["__search_result__".$viewname]);

    foreach($data as $row) {

        $_SESSION["__search_result__".$viewname][] = array($row->_entity_properties['title'],
            __get_cck_name($row->_entity_properties['type']),
        $row->_entity_properties['field_owner:name'],
        $row->_entity_properties['field_workflow_state_search'],
        $row->_entity_properties['field_language'],
            (is_array($row->_entity_properties['field_for_use_by'])? implode(',', $row->_entity_properties['field_for_use_by']):'UseBy'),
        $row->_entity_properties['field_date_last_reviewed']
    );
    }
}

function exportSearchTextMultiMediaHtmlToCSV(){
    $reportsTATR = variable_get('reports_search_api_tmh_', array());

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
        if ( !file_exists("sites/default/files/reports_search_api_tmh_{$reqid}.csv") ) {

            /* Nope, so tell the client its still in the works, it's next request will
            probably hit a different server (the one where the report is saved) */
            exit('working');

        } else {

            /* it is, so read this out to the client - JavaScript will take it from there (it
            will simulate the download) */
            readfile("sites/default/files/reports_search_api_tmh_{$reqid}.csv");
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
    variable_set('reports_search_api_tmh_', $reportsTATR);

    // Open the file for writing
    $h = fopen("sites/default/files/reports_search_api_tmh_{$reqid}.csv", 'w');
    if ( $h === false ) {
        exit('error');
    }

    // Write the CSV headers
    fwrite($h, '"counter","Title","Content Type","Owner", "Workflow State", "Language", "For Use By", "Date Last Reviewed"');
    fwrite($h, "\n");

    // Write the CSV content
    $rows = $_SESSION["__search_result__".arg(1)];
    $i = 1;
    foreach ( $rows as $row ) {
        //fwrite($h, '"' .$i . '","'.$row[0].'","'.$row[1].'","'.$row[2].'", "'.$row[3].'", "'.$row[4].'", "'.$row[5].'", "'.date('l, F d, Y - H ',$row[6]).'"');
        $fields =array($i, $row[0], $row[1], $row[2], $row[3], $row[4], $row[5], date('l, F d, Y - H ',$row[6]));
        fputcsv($h, $fields);
        $i++;
    }
    fclose($h);

    /* Place a flag in the database, visible to all servers and PHP-threads that
    this reqid is created and complete */
    $reportsTATR[$reqid] = 'complete';
    variable_set('reports_search_api_tmh_', $reportsTATR);

    exit('working');

}

function __get_cck_name($machine_name) {
    $ret = '';
    switch ($machine_name) {
        case "text_content_type": $ret = "Text Asset"; break;
        case "file_content_type": $ret = "File Asset"; break;
        case "html_content_type": $ret = "HTML Asset"; break;
        case "multimedia_content_type": $ret = "Multimedia Asset"; break;
        case "state_details": $ret = "State Details"; break;
        case "directory_record_content_type": $ret="Directory Record"; break;
    }
    return $ret;
}
