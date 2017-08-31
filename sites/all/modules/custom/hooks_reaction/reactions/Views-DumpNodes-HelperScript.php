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

            $query =& $view->build_info['query'];

            // Implement pagination URL
            $page = ( empty($view->args[0]) ? 0 : intval($view->args[0]) - 1);

            // Implement limit by URL
            $limit = ( empty($view->args[1]) ? 1 : intval($view->args[1]) );
            $query->range(($page)*$limit, $limit);

            // do not include soft-deleted items
            // $query->addJoin('LEFT', 'node_deleted', 'd', "d.nid = node.nid AND d.deletion_state='soft'" );
            // $query->where('(d.deletion_state IS NULL)');

            // do not include un-published items
            // $query->where('(node.status = 1)');

            __vdn_cache_stuff();

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
    if ( isset($node) && isset($node->body) && isset($node->body['und'])
        && isset($node->body['und'][0]) && !empty($node->body['und'][0]['value']) )
    {
        $node->body['und'][0]['value'] = preg_replace(
            "/(href|src)\s*\=\s*([\"'])\s*([^(https?|mailto|ftp)])/",
            "$1=$2{$host}/$3", $node->body['und'][0]['value']);
        $node->body['und'][0]['value'] = preg_replace("/usa\.gov\/{2,}/", "usa.gov/",
            $node->body['und'][0]['value']);
    }
}
function _vdn_deletionDetails( &$node )
{
    // override deleted, deletion_uid, deletion_timestamp
    if (isset($node) && is_object($node)) {
        $del = (db_query("SELECT deletion_uid, deletion_timestamp FROM node_deleted WHERE nid = :nid AND deletion_state='soft'", array(":nid"=>$node->nid))->fetchAssoc());
        if (isset($del) && !empty($del) && is_array($del)) {
            $node->deleted=1;
            $node->deletion_uid = $del['deletion_uid'];
            $node->deletion_timestamp = $del['deletion_timestamp'];
        }
    }
}
function _vdn_locations( &$node )
{
    $node->locations = [];
    if ( !empty($GLOBALS['__cached_content_pages'][$node->nid]) )
    {
        foreach ( $GLOBALS['__cached_content_pages'][$node->nid] as $page_id )
        {
            if ( !empty($GLOBALS['__cached_page_sites'][$page_id]) )
            {
                $page = $GLOBALS['__cached_page_sites'][$page_id];
                if ( !empty($page['site']) )
                {
                    if ( in_array($page['site'],['usa.gov','kids.gov','kids.usa.gov','gobiernousa.gov','gobierno.usa.gov']) )
                    {
                        $full_url = '';
                        if ( $page['site'] == 'usa.gov' )
                        {
                            $full_url = 'https://www.usa.gov';
                        } else if ( $page['site'] == 'gobiernousa.gov' || $page['site'] == 'gobierno.usa.gov' ) {
                            $full_url = 'https://gobierno.usa.gov';
                        } else if ( $page['site'] == 'kids.usa.gov'    || $page['site'] == 'kids.gov' ) {
                            $full_url = 'https://kids.usa.gov';
                        }
                        if ( !empty($page['url']) )
                        {
                            $full_url .= $page['url'];
                        }
                        if ( strlen($full_url) == 0 )
                        {
                            continue;
                        }
                        $node->locations[] = [ 'value'=> [
                            'page_title' => $page['title'],
                            'url' => $full_url.'#item-'.$node->nid
                        ]
                        ];
                    } else if ( $page['site'] == 'blog.usa.gov' ) {
                        $node->locations[] = [ 'value'=> [
                            'page_title' => $node->title,
                            'url' => 'https://blog.usa.gov/'._bloggov_urlFriendlyString($node->title),
                        ]
                        ];
                    }
                }
            }
        }
    }
}


function __vdn_cache_stuff()
{
    /// which pages contain which content
    $GLOBALS['__cached_content_pages'] = [];
    $query = "
      SELECT
        aoc.field_asset_order_content_target_id aoc,
        group_concat(ttd.tid separator ',') as tid
      FROM
        taxonomy_term_data ttd
        JOIN field_data_field_asset_order_content aoc
          ON ( aoc.entity_id = ttd.tid )
      GROUP BY aoc.field_asset_order_content_target_id
    ";
    $result = db_query($query);
    foreach ( $result as $row )
    {
        $GLOBALS['__cached_content_pages'][$row->aoc] = explode(',',$row->tid);
    }

    /// which pages belong to which site
    $GLOBALS['__cached_page_sites'] = [];
    /// handles 10 level of parents
    $query = "
    SELECT
      tops.tid,
      pd.name as title,
      TRIM(LCASE(td.name)) as site,
      IF ( fu.field_friendly_url_value IS NULL,
           '/', fu.field_friendly_url_value ) as url
    FROM (
      SELECT
      	tth0.tid as tid,
      	IF ( tthA.tid IS NOT NULL, tthA.tid,
      	IF ( tth9.tid IS NOT NULL, tth9.tid,
      	IF ( tth8.tid IS NOT NULL, tth8.tid,
      	IF ( tth7.tid IS NOT NULL, tth7.tid,
      	IF ( tth6.tid IS NOT NULL, tth6.tid,
      	IF ( tth5.tid IS NOT NULL, tth5.tid,
      	IF ( tth4.tid IS NOT NULL, tth4.tid,
      	IF ( tth3.tid IS NOT NULL, tth3.tid,
      	IF ( tth2.tid IS NOT NULL, tth2.tid,
      	IF ( tth1.tid IS NOT NULL, tth1.tid,tth0.tid)))))))))
      	) as top
      FROM taxonomy_term_hierarchy tth0
      	 LEFT JOIN taxonomy_term_data ttd ON ( ttd.tid = tth0.tid )
      	 LEFT JOIN taxonomy_term_hierarchy tth1 ON ( tth1.tid = tth0.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth2 ON ( tth2.tid = tth1.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth3 ON ( tth3.tid = tth2.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth4 ON ( tth4.tid = tth3.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth5 ON ( tth5.tid = tth4.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth6 ON ( tth6.tid = tth5.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth7 ON ( tth7.tid = tth6.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth8 ON ( tth8.tid = tth7.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tth9 ON ( tth9.tid = tth8.parent )
      	 LEFT JOIN taxonomy_term_hierarchy tthA ON ( tthA.tid = tth9.parent )
      WHERE ttd.vid = 42
      ORDER BY top
    ) tops
    left join taxonomy_term_data td            on ( td.tid       = tops.top )
    left join taxonomy_term_data pd            on ( pd.tid       = tops.tid )
    left join field_data_field_friendly_url fu on ( fu.entity_id = tops.tid )
    ";
    $result = db_query($query);
    foreach ( $result as $row )
    {
        $GLOBALS['__cached_page_sites'][$row->tid] = ['title'=>$row->title,'site'=>$row->site,'url'=>$row->url];
    }
    // die(print_r($GLOBALS['__cached_page_sites'],1));
}
if ( !function_exists('_vdn_govbranch_field') ) {
    function _vdn_govbranch_field(&$node){

        if ($node->field_government_branch['und'][0]['value'] == "Executive"){
            $node->field_government_branch['und'][0]['value'] = "Executive Department Sub-Office/Agency/Bureau";
        }
    }
}

if ( !function_exists('nidToXML') ) {
    function nidToXML($nid)
    {

        // initializing or creating array
        $n = node_load($nid);

        _vdn_deletionDetails( $n );
        _vdn_absoluteLinks(   $n );
        _vdn_locations(       $n );

        if ($n->type == 'directory_record_content_type'){
            _vdn_govbranch_field( $n );
        }


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
