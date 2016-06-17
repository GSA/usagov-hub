<?php


/**
 * Implements hook_taxonomy_term_presave
 *
 */
hooks_reaction_add("HOOK_taxonomy_term_presave",
    function ($term) {
        // field_gobiernousa_gov_toggle_url
        // field_kids_gov_toggle_url
        // field_usa_gov_toggle_url

        // We don't want to fire this functionality on non-"Content Page"s
        $current_term_parent =  _get_top_term($term->tid);
        if (!empty($term->field_usa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is spanish page
            _update_toggle($term->field_friendly_url['und'][0]['value'], $term->field_usa_gov_toggle_url['und'][0]['value'],'field_usa_gov_toggle_url',$current_term_parent);
        }

        if (!empty($term->field_gobiernousa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is usagov page
            _update_toggle($term->field_friendly_url['und'][0]['value'], $term->field_gobiernousa_gov_toggle_url['und'][0]['value'],'field_gobiernousa_gov_toggle_url', $current_term_parent);
        }

        if (!empty($term->field_kids_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is kids page
            _update_toggle($term->field_friendly_url['und'][0]['value'], $term->field_kids_gov_toggle_url['und'][0]['value'],'field_kids_gov_toggle_url',$current_term_parent);
        }
    }
);


function _update_togglee($settoggle_str, $other_term_friendly_url, $toggle_field, $current_termp_parent) {

    $res = db_query("SELECT entity_id, field_friendly_url_value FROM field_data_field_friendly_url WHERE field_friendly_url_value LIKE :toggle", array(':toggle'=>$other_term_friendly_url));
    foreach($res as $row) {

        $top_term = _get_top_term($row->entity_id);
        dsm("Found:" . $row->entity_id . " term:".$top_term. " FRIENDLY URL: ". $row->field_friendly_url_value . ' curren  term parent' . $current_termp_parent);

        if (isset($row->entity_id)) {

            if ($toggle_field == 'field_usa_gov_toggle_url') {
                if ($top_term == 3062 && $current_termp_parent == 3067) { // usagov gobierno
                    db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3062 && $current_termp_parent == 3072) { // usagov kids
                    db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
            }

            if ($toggle_field == 'field_gobiernousa_gov_toggle_url') {
                if ($top_term == 3067 &&  $current_termp_parent == 3062) { //gobierno usagov

                    db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3067 &&  $current_termp_parent == 3072) { // gobierno kids

                    db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
            }

            if ($toggle_field == 'field_kids_gov_toggle_url') {
                if ($top_term == 3072 && $current_termp_parent==3062) { // kids usagov
                    db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3072 && $current_termp_parent==3067) { //kids gobierno
                    db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$settoggle_str, ':tid'=>$row->entity_id));
                }
            }

            $sql = "DELETE FROM cache_field WHERE cid='field:taxonomy_term:{$row->entity_id}'";
            db_query($sql);
        }
    }
}

function _get_top_term($tid){

    $parent_tid = db_query("SELECT parent FROM taxonomy_term_hierarchy WHERE  tid = :tid", array(":tid" => $tid))->fetchField();
    if (isset($parent_tid) && ($parent_tid == 3062 || $parent_tid == 3072 || $parent_tid == 3067 || $parent_tid == 11272)) {
        return $parent_tid;
    }
    else {
        return _get_top_term($parent_tid);
    }
}