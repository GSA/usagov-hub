<?php
/*
 * This code is in the child and cmp sites. If you make changes on one of those, update other one
 */
function get_term_lastReviewedDate($tid){
    $ret = false;
    $sql="
    SELECT field_asset_order_carousel_target_id  AS nid
        FROM field_data_field_asset_order_carousel
        WHERE entity_id =:tid
    UNION
    SELECT field_asset_order_content_target_id AS nid
        FROM field_data_field_asset_order_content
        WHERE entity_id =:tid
    UNION
    SELECT field_asset_order_sidebar_target_id AS nid
        FROM field_data_field_asset_order_sidebar
        WHERE entity_id =:tid
    UNION
    SELECT field_asset_order_bottom_target_id AS nid
        FROM field_data_field_asset_order_bottom
        WHERE entity_id =:tid
    UNION
    SELECT field_asset_order_menu_target_id AS nid
        FROM field_data_field_asset_order_menu
        WHERE entity_id =:tid";
    $res = db_query($sql, array(':tid'=>$tid));
    $nids = array();
    foreach($res as $row){
        $nids[] = $row->nid;

        $multimediares = db_query("SELECT field_related_multimedia_two_target_id AS nid
                                      FROM field_data_field_related_multimedia_two WHERE entity_id=:nid",array(':nid'=>$row->nid));
        foreach($multimediares as $mrow){
            $nids[] = $mrow->nid;
        }
    }

    $ret = get_node_lastReviewedDate($nids);

    return $ret;
}

function get_node_lastReviewedDate($nids){
    $ret = false;
    if (count($nids) > 0) {
        $ret = db_query("SELECT MAX(field_date_last_reviewed_value) FROM field_data_field_date_last_reviewed WHERE entity_id IN (" . join(',', $nids) . ")")->fetchField(0);
        if (!empty($ret)) {
            $date = new DateTime($ret);
            $ret = $date->getTimestamp();
        }
    }

    return $ret;
}