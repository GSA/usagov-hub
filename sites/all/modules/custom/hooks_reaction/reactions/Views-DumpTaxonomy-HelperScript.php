<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to assist the dump_taxonomy View with rendering - this View uses
    some custom functions that must be defined outside of the View.

    This helper script also assists in altering the query sent to MySQL for this View,

    This View is located at: https://<site>/admin/structure/views/view/dump_taxonomy/edit/views_data_export_1

*/

/**
 * Implements HOOK_views_pre_execute
 *
 */
hooks_reaction_add("HOOK_views_pre_execute",
    function (&$view) {

        // Query edits to the dump_nodes and dump_taxonomy Views
        // I'm not using HOOK_views_query_alter() due to technical difficulty/reasons
        if ( $view->name === 'dump_taxonomy' ) {

            $query =& $view->build_info['query'];

            // Implement pagination URL
            $page = ( empty($view->args[0]) ? 0 : intval($view->args[0]) - 1);

            // Implement limit by URL
            $limit = ( empty($view->args[1]) ? 1 : intval($view->args[1]) );
            $query->range(($page)*$limit, $limit);

            // The "Recent Data export" display should only show taxonomy-terms that have been modded in the last 15mins
            // if ( $view->current_display === 'views_data_export_2' ) {
            //     $query->leftJoin('taxonomy_dates', 'd', '(taxonomy_term_data.tid=d.tid)');
            //     $recentTime = time() - 901; // 900 == seconds in 15 minutes
            //     $query->where(" d.created > {$recentTime} OR d.changed > {$recentTime} ");
            // }

        }
    }
);

if ( !class_exists('SimpleXMLExtended') ) {
    class SimpleXMLExtended extends SimpleXMLElement {
        public function addCData($cdata_text) {
            $node = dom_import_simplexml($this);
            $no   = $node->ownerDocument;
            $node->appendChild($no->createCDATASection($cdata_text));
        }
    }
}

if ( !function_exists('tidToXML') ) {
function tidToXML($tid) {

    // initializing or creating array
    $t = taxonomy_term_load($tid);
    $t->parentTerm = array();
    foreach ( taxonomy_get_parents($tid) as $pTerm ) {
        $t->parentTerm = array(
            'tid' => $pTerm->tid,
            'vid' => $pTerm->vid,
            'uuid' => $pTerm->uuid
        );
    }
    $arrTermData = json_decode( json_encode($t), true );

    // creating object of SimpleXMLElement
    $taxXML = new SimpleXMLExtended("<?xml version=\"1.0\"?><NodeDataXML></NodeDataXML>");

    // function call to convert array to xml
    array_to_xml($arrTermData, $taxXML);

    //saving generated xml file
    $str = substr($taxXML->asXML(), 35);
    $str = substr($str, 0, -15);
    return $str;
}
}

if ( !function_exists('array_to_xml') ) {
    function array_to_xml($data, &$xml) {
        foreach($data as $key => $value) {
            if(is_array($value)) {
                if(!is_numeric($key)){
                    $subnode = $xml->addChild("$key");
                    array_to_xml($value, $subnode);
                }
                else{
                    $subnode = $xml->addChild("item$key");
                    array_to_xml($value, $subnode);
                }
            }
            else {
                if ( is_numeric($value) ) {
                    $xml->addChild("$key",htmlspecialchars("$value"));
                } else {
                    $xml->{$key} = null;
                    $xml->{$key}->addCData(htmlspecialchars("$value"));
                }
            }
        }
    }
}
