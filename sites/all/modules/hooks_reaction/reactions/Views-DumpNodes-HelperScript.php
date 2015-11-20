<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to assist the dump_nodes View with rendering - this View uses
    some custom functions that must be defined outside of the View.

    This helper script also assists in altering the query sent to MySQL for this View,

    This View is located at: https://<site>/admin/structure/views/view/dump_nodes/edit/views_data_export_1

*/


/**
 * Implements HOOK_views_pre_execute
 *
 */
hooks_reaction_add("HOOK_views_pre_execute",
    function (&$view) {

        // Query edits to the dump_nodes and dump_taxonomy Views
        // I'm not using HOOK_views_query_alter() due to technical difficulty/reasons
        if ( $view->name === 'dump_nodes' ) {

            $query = $view->build_info['query'];

            // Implement pagination URL
            $page = ( empty($view->args[0]) ? 0 : intval($view->args[0]) - 1);

            // Implement limit by URL
            $limit = ( empty($view->args[1]) ? 1 : intval($view->args[1]) );
            $query->range(($page)*$limit, $limit);

            /* COMMENTING OUT AS THIS CODE DOES NOT BELONG HERE?

                // The "Recent Data export" display should only show taxonomy-terms that have been modded in the last 15mins
                if ( $view->current_display === 'views_data_export_2' ) {
                    $query->leftJoin('taxonomy_dates', 'd', '(taxonomy_term_data.tid=d.tid)');
                    $recentTime = time() - 901; // 900 == seconds in 15 minutes
                    $query->where(" d.created > {$recentTime} OR d.changed > {$recentTime} ");
                }
            */

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

function _vdn_forUseBy( $node )
{
  $by = [];
  foreach ( ['field_for_use_by','field_for_use_by_text'] as $field )
  {
    if ( !empty($node->$field) )
    {
      foreach ( $node->$field as $l )
      {
        foreach ( $l as $fub )
        {
          if ( !empty($fub['value']) )
          {
            $by[strtolower($fub['value'])] = strtolower($fub['value']);
          }
        }
      }
    }
  }
  return $by;
}
function _vdn_absoluteLinks( &$node )
{
  $host = null;
  $hosts = [
       'usa.gov'          => 'https://www.usa.gov'
      ,'gobiernousa.gov'  => 'https://gobierno.usa.gov'
      ,'gobierno.usa.gov' => 'https://gobierno.usa.gov'
      ,'kids.usa.gov'     => 'https://kids.usa.gov'
      ,'blog.usa.gov'     => 'https://blog.usa.gov'
  ];
  $fubs = _vdn_forUseBy( $node );
  foreach ( $fubs as $fub )
  {
    if ( isset($hosts[$fub]) )
    {
      $host = $hosts[$fub];
      break;
    }
  }
  $node->body['und'][0]['value'] = preg_replace(
     "/(href|src)\s*\=\s*([\"'])\s*([^(https?|mailto|ftp)])/",
     "$1=$2$host/$3", $node->body['und'][0]['value']);
}
function _vdn_deletionDetails( &$node )
{
  // override deleted, deletion_uid, deletion_timestamp
  if (isset($node) && is_object($node)) {
      $del = (db_query("SELECT deletion_uid, deletion_timestamp FROM node_deleted WHERE nid = :nid", array(":nid"=>$node->nid))->fetchAssoc());
      if (isset($del) && !empty($del) && is_array($del)) {
          $node->deleted=1;
          $node->deletion_uid = $del['deletion_uid'];
          $node->deletion_timestamp = $del['deletion_timestamp'];
      }
  }
}

function _vdn_locations( &$node )
{
  /// for use by usa/gob/kids
  # for usa/gob/kids : the id must be in stl.field_asset_order_content[und][\d][target_id]==node_id
  # for blog : if node.for_use_by==blog then blog.usa.gov/{title_with_space_to_dashed-and-all-lowercase}
  # for features : ignore it

}

function nidToXML($nid) {

    // initializing or creating array
    $n = node_load($nid);

    _vdn_deletionDetails( $n );
    _vdn_absoluteLinks(   $n );

    $arrNodeData = json_decode( json_encode($n), true );

    // creating object of SimpleXMLElement
    $nodeXML = new SimpleXMLExtended("<?xml version=\"1.0\"?><NodeDataXML></NodeDataXML>");

    // function call to convert array to xml
    array_to_xml($arrNodeData, $nodeXML);

    //saving generated xml file
    $str = substr($nodeXML->asXML(), 35);
    $str = substr($str, 0, -15);
    return $str;
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
            if ( is_numeric($value) || trim($value) === '' ) {
            $xml->addChild("$key",htmlspecialchars("$value"));
            } else {
              @$xml->{$key} = null;
              @$xml->{$key}->addCData(htmlspecialchars("$value"));
            }
            }
        }
    }
}
