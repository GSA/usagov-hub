<?php
hooks_reaction_add(
    array(
        'HOOK_form_taxonomy_manager_form_alter',
        'HOOK_form_taxonomy_form_term_alter',
        'HOOK_form_taxonomy_overview_terms_alter',
        'HOOK_form_taxonomy_overview_vocabularies_alter',
    ),

    function (&$form, &$form_state, $form_id) {
        //dsm($form);
        //dsm($form_state);

        global $user;
        $allowed_roles = array("ux member", "usa administrator", "administrator");
        $user_roles = array_values($user->roles);

        if (!(array_intersect($allowed_roles, $user_roles))
            && ((isset($form['voc']['#value']->machine_name) && $form['voc']['#value']->machine_name == 'site_strucutre_taxonomy')
                || (isset($form['#vocabulary']->machine_name ) && $form['#vocabulary']->machine_name == 'site_strucutre_taxonomy')
                || ($form_id == 'taxonomy_overview_vocabularies'))){

            drupal_add_js(drupal_get_path('module', 'hooks_reaction') . '/js/SetRestriction-SSTaxTerm.js');

            // hidden toolbars
            if (isset($form['toolbar']['add_show'])) {
                unset($form['toolbar']['add_show']);
                unset($form['toolbar']['delete_confirm']);
                unset($form['toolbar']['weight_up']);
                unset($form['toolbar']['weight-down']);
                unset($form['toolbar']['move_show']);
                unset($form['toolbar']['showbatchopts']);
                unset($form['toolbar']['batchoptsform']);
                unset($form['toolbar']['double_tree_show']);
                unset($form['toolbar']['export_show']);
                unset($form['toolbar']['wrapper']);
            }

        }
    }
);