<?php
define( 'USA_RSS_NID',   211490  );
define( 'GOBIERNO_RSS_NID',   211691  );

hooks_reaction_add(
    "HOOK_workbench_moderation_transition",
    function ($node, $previous_state, $new_state) {

        // We don't want to fire this functionality on newly created nodes
        if (empty($node->nid) || node_load($node->nid) === false) {
            return;
        }

        // We only want to send a notifications out when a node become published
        if ($new_state !== 'published') {
            return;
        }

        if (isset($node->field_for_use_by_text['und'])) {
            $ubys=array();
            foreach($node->field_for_use_by_text['und'] as $uby){
                $ubys[] = $uby['value'];
            }

            if (in_array('Feature',$ubys)) {
                $is_USA = false;
                if (in_array('USA.gov',$ubys)){
                    $is_USA = true;
                }

                // to check if feed item is already exist or not
                $res = db_query("SELECT nid FROM node WHERE title like :title AND type='cmp_feed_item'", array(':title'=>$node->title))->fetchField();
                if (empty($res)) {
                    // generate cmp feed item and update cmp feed
                    $feed_item = _generate_cmp_feed_item($node, $is_USA);
                    _update_cmp_feed($feed_item);
                }
                else{
                    $feed_item_node = node_load($res);

                    $ubys=array();
                    foreach($feed_item_node->field_for_use_by_text['und'] as $uby){
                        $ubys[] = $uby['value'];
                    }

                    if (in_array('USA.gov', $ubys)){
                        // usa.gov
                        $noderss = node_load(USA_RSS_NID);
                    }
                    else{
                        // gobierno.gov
                        $noderss = node_load(GOBIERNO_RSS_NID);
                    }
                    $exist = false;
                    _generate_cmp_feed_item($node, $is_USA, $feed_item_node);

                    foreach($noderss->field_feed_items['und'] as $feed_item){
                        if($feed_item['target_id'] == $feed_item_node->nid){
                            $exist = true;
                        }
                    }
                    if (!$exist){
                        _update_cmp_feed($feed_item_node);
                    }
                }
            }
            else{
                return;
            }
        }
        else {
            return;
        }
    }
);

function _generate_cmp_feed_item($text_asset_node, $is_USA, $old_feed_item_node = null){

    if ($old_feed_item_node == null) {

        $cmp_feed_item_node = new StdClass();
        $cmp_feed_item_node->type = 'cmp_feed_item';
        $cmp_feed_item_node->comment = 0;
        $cmp_feed_item_node->status = 1;
        $cmp_feed_item_node->promote = 0;
        $cmp_feed_item_node->language = 'en';

        node_object_prepare($cmp_feed_item_node);
    }
    else
    {
        $cmp_feed_item_node = $old_feed_item_node;
    }
    $cmp_feed_item_node->uid = $text_asset_node->uid;
    $cmp_feed_item_node->title = $text_asset_node->title;
    $cmp_feed_item_node->field_for_use_by_text = $text_asset_node->field_for_use_by_text;
    $cmp_feed_item_node->field_feed_item_link['und'][0]['value'] = ($is_USA ? 'https://www.usa.gov/features/' : 'https://gobierno.usa.gov/novedades/') . _aliasPathHelper_urlFriendlyString($text_asset_node->title);
    $cmp_feed_item_node->field_feed_item_pubdate['und'][0] = array('value' => date('Y-m-d H:i:s', time()),
        'timezone' => 'America/New_York',
        'timezone_db' => 'UTC',
        'date_type' => 'datetime');
    $cmp_feed_item_node->body['und'][0]['format'] = 'filtered_html';
    $cmp_feed_item_node->body['und'][0]['summary'] = '';
    $cmp_feed_item_node->body['und'][0]['value'] = $text_asset_node->field_description['und'][0]['value'];

    node_save($cmp_feed_item_node);
    return $cmp_feed_item_node;
}

function _update_cmp_feed($feed_item_node){
    $ubys=array();
    foreach($feed_item_node->field_for_use_by_text['und'] as $uby){
        $ubys[] = $uby['value'];
    }

    if (in_array('USA.gov', $ubys)){
        // usa.gov
        $node = node_load(USA_RSS_NID);
    }
    else{
        // gobierno.gov
        $node = node_load(GOBIERNO_RSS_NID);
    }
    $items_count = count($node->field_feed_items['und']);
    $node->field_feed_items['und'][$items_count]['target_id'] = $feed_item_node->nid;
    node_save($node);
}
