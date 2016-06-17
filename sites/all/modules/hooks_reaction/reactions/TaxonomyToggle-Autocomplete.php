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
        if (!empty($term->field_usa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is spanish page
            _update_toggle($term->field_usa_gov_toggle_url['und'][0]['value'], $term->field_friendly_url['und'][0]['value'],'field_usa_gov_toggle_url');
        }

        if (!empty($term->field_gobiernousa_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is usagov page
            _update_toggle($term->field_gobiernousa_gov_toggle_url['und'][0]['value'], $term->field_friendly_url['und'][0]['value'],'field_gobiernousa_gov_toggle_url');
        }

        if (!empty($term->field_kids_gov_toggle_url['und'][0]['value']) && !empty($term->field_friendly_url['und'][0]['value'])) {
            // assume this is kids page
            _update_toggle($term->field_kids_gov_toggle_url['und'][0]['value'], $term->field_friendly_url['und'][0]['value'],'field_kids_gov_toggle_url');
        }
    }
);


function _update_toggle($toggle_str, $current_term_friendly_url, $toggle_field) {

    $res = db_query("SELECT entity_id FROM field_data_field_friendly_url WHERE field_friendly_url_value LIKE :toggle", array(':toggle'=>$toggle_str));
    foreach($res as $row) {
        dsm("Found:" . $row->entity_id);

        $top_term = _get_top_term($row->entity_id);

        dpr($top_term);

        if (isset($row->entity_id)) {
            //$term = taxonomy_term_load($row->entity_id);

            if ($toggle_field == 'field_usa_gov_toggle_url') {
                if ($top_term == 3067) { // gobierno
                    //$term->field_gobiernousa_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3072) { // usagov
                    //$term->field_kids_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
               // taxonomy_term_save($term);
            }

            if ($toggle_field == 'field_gobiernousa_gov_toggle_url') {
                if ($top_term == 3062) { //usagov
                    //$term->field_usa_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3072) { // 3072
                    //$term->field_kids_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_kids_gov_toggle_url SET field_kids_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
                //taxonomy_term_save($term);
            }

            if ($toggle_field == 'field_kids_gov_toggle_url') {
                if ($top_term == 3062) { // usagov
                    //$term->field_usa_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_usa_gov_toggle_url SET field_usa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
                if ($top_term == 3067) { // gobierno
                    //$term->field_gobiernousa_gov_toggle_url['und'][0]['value'] = $current_term_friendly_url;
                    db_query("UPDATE field_data_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                    db_query("UPDATE field_revision_field_gobiernousa_gov_toggle_url SET field_gobiernousa_gov_toggle_url_value=:new_toggle_url WHERE entity_id=:tid",
                        array(':new_toggle_url'=>$current_term_friendly_url, ':tid'=>$row->entity_id));
                }
                //taxonomy_term_save($term);
            }
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