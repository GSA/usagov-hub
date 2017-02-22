<?php


/**
 * Implements hook_taxonomy_term_presave
 *
 */

/*
hooks_reaction_add("HOOK_taxonomy_term_presave",
    function ($term) {
        if (isset($term) && $term->vid == 42 ) {
            // field_gobiernousa_gov_toggle_url
            // field_kids_gov_toggle_url
            // field_usa_gov_toggle_url

            // We don't want to fire this functionality on non-"Content Page"s
            $current_term_parent = _get_top_term($term->tid);
            if ($current_term_parent != null && !empty($term->field_usa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
                // assume this is spanish page
                _update_togglee($term->field_friendly_url['und'][0]['value'], $term->field_usa_gov_toggle_url['und'][0]['value'], 'field_usa_gov_toggle_url', $current_term_parent);
            }

            if ($current_term_parent != null && !empty($term->field_gobiernousa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
                // assume this is usagov page
                _update_togglee($term->field_friendly_url['und'][0]['value'], $term->field_gobiernousa_gov_toggle_url['und'][0]['value'], 'field_gobiernousa_gov_toggle_url', $current_term_parent);
            }

            if ($current_term_parent != null && !empty($term->field_kids_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
                // assume this is kids page
                _update_togglee($term->field_friendly_url['und'][0]['value'], $term->field_kids_gov_toggle_url['und'][0]['value'], 'field_kids_gov_toggle_url', $current_term_parent);
            }
        }
    }
);


function _update_togglee($settoggle_str, $other_term_friendly_url, $toggle_field, $current_termp_parent) {

    $res = db_query("SELECT entity_id, field_friendly_url_value FROM field_data_field_friendly_url WHERE field_friendly_url_value LIKE :toggle", array(':toggle'=>$other_term_friendly_url));
    foreach($res as $row) {

        $top_term = _get_top_term($row->entity_id);


        if (isset($row->entity_id)) {
            $term_name = db_query("SELECT name FROM taxonomy_term_data WHERE tid=:tid",array(":tid"=>$row->entity_id))->fetchField(0);

            if ($toggle_field == 'field_usa_gov_toggle_url') {
                if ($top_term == 3062 && $current_termp_parent == 3067) { // usagov gobierno
                    if (db_query("SELECT COUNT(*) FROM field_data_field_gobiernousa_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url' => $settoggle_str, ':tid' => $row->entity_id));
                        db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url' => $settoggle_str, ':tid' => $row->entity_id));
                    }
                    else {
                        $t = taxonomy_term_load($row->entity_id);
                        $t->field_gobiernousa_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }
                    $changed_toggle= "GobiernoUSA.gov Toggle URL";
                    $site='USA';
                }
                if ($top_term == 3062 && $current_termp_parent == 3072) { // usagov kids
                    if (db_query("SELECT COUNT(*) FROM field_data_field_kids_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id,))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                        db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    }
                    else {
                        $t = taxonomy_term_load($row->entity_id);
                        $t->field_kids_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }
                    $changed_toggle= "Kids.gov Toggle URL";
                    $site='USA';

                }
            }

            if ($toggle_field == 'field_gobiernousa_gov_toggle_url') {
                if ($top_term == 3067 &&  $current_termp_parent == 3062) { //gobierno usagov

                    if (db_query("SELECT COUNT(*) FROM field_data_field_usa_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id,))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                        db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    }
                    else {
                        $t = taxonomy_term_load($row->entity_id);
                        $t->field_usa_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }
                    $changed_toggle = "USA.gov Toggle URL";
                    $site='Gobierno';
                }
                if ($top_term == 3067 &&  $current_termp_parent == 3072) { // gobierno kids

                    if (db_query("SELECT COUNT(*) FROM field_data_field_kids_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id,))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                        db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    }
                    else {
                        $t = taxonomy_term_load($row->entity_id);
                        $t->field_kids_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }
                    $changed_toggle= "Kids.gov Toggle URL";
                    $site='Gobierno';
                }
            }

            if ($toggle_field == 'field_kids_gov_toggle_url') {
                if ($top_term == 3072 && $current_termp_parent==3062) { // kids usagov

                    if (db_query("SELECT COUNT(*) FROM field_data_field_usa_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id,))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                        db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));

                    }
                    else {

                        $t = taxonomy_term_load($row->entity_id);
                        $t->field_usa_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }
                    $changed_toggle= "USA.gov Toggle URL";
                    $site='Kids';
                }

                if ($top_term == 3072 && $current_termp_parent==3067) { //kids gobierno

                    if (db_query("SELECT COUNT(*) FROM field_data_field_gobiernousa_gov_toggle_url WHERE entity_id = :entity_id", array(":entity_id"=>$row->entity_id,))->fetchField(0) > 0) {

                        db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url' => $settoggle_str, ':tid' => $row->entity_id));
                        db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                            array(':new_toggle_url' => $settoggle_str, ':tid' => $row->entity_id));
                    }
                    else {
                        $t = taxonomy_term_load($row->entity_id);
                       // $t->field_gobiernousa_gov_toggle_url['und'][0]['value'] = $settoggle_str;
                        field_attach_presave('taxonomy_term', $t);
                        field_attach_update('taxonomy_term', $t);
                    }

                    $changed_toggle= "GobiernoUSA.gov Toggle URL";
                    $site='Kids';
                }
            }
            // tell migration to sync
            db_query("INSERT IGNORE INTO taxonomy_dates (tid) VALUES({$row->entity_id})");
            $nowTime = time();
            db_query("UPDATE taxonomy_dates SET created={$nowTime}, changed={$nowTime} WHERE tid = {$row->entity_id}");

            $sql = "DELETE FROM cache_field WHERE cid='field:taxonomy_term:{$row->entity_id}'";
            db_query($sql);
           // drupal_set_message($settoggle_str ." has been set to ".strtoupper($site)." SITE's ".$term_name."'s (".$row->entity_id.")".$changed_toggle. " field.");
        }
    }
}

function _get_top_term($tid){

    if ($tid == 3062 || $tid == 3072 || $tid == 3067 || $tid == 11272 || $tid == 0 || $tid == null) return $tid;

    $parent_tid = db_query("SELECT parent FROM taxonomy_term_hierarchy WHERE  tid = :tid", array(":tid" => $tid))->fetchField();
    //if (empty($parent_tid) || $parent_tid==0) {
      //  return null;
    //}
    if (isset($parent_tid) && ($parent_tid == 3062 || $parent_tid == 3072 || $parent_tid == 3067 || $parent_tid == 11272)) {
        return $parent_tid;
    }
    else{
        return _get_top_term($parent_tid);
    }
}
*/