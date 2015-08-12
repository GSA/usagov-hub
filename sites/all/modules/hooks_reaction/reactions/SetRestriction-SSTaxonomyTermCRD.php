<?php
hooks_reaction_add(
    array(
        'HOOK_form_taxonomy_manager_form_alter', 
        'HOOK_form_taxonomy_form_term_alter',
        'HOOK_form_taxonomy_overview_terms_form_alter'
    ),

    function (&$form, &$form_state, $form_id) {

        global $user;

        $allowed_roles = array("ux member", "usa administrator", "administrator");
        $user_roles = array_values($user->roles);

        if (!(array_intersect($allowed_roles, $user_roles))
            && ((isset($form['voc']['#value']->machine_name) && $form['voc']['#value']->machine_name == 'site_strucutre_taxonomy')
                || (isset( $form['#vocabulary']->machine_name )&&  $form['#vocabulary']->machine_name == 'site_strucutre_taxonomy')
               )){

            drupal_add_js(drupal_get_path('module', 'hooks_reaction') . '/js/SetRestriction-SSTaxTerm.js');
            if (isset($form['toolbar']['add_show'])) {
                unset($form['toolbar']['add_show']);
                unset($form['toolbar']['delete_confirm']);
                unset($form['toolbar']['weight_up']);
                unset($form['toolbar']['weight_down']);
                unset($form['toolbar']['move_show']);
            }

        }
    }
);