<?php
hooks_reaction_add(
    array(
        'HOOK_form_taxonomy_manager_form_alter',
        'HOOK_form_taxonomy_form_term_alter',
        'HOOK_form_taxonomy_overview_terms_alter',
        'HOOK_form_taxonomy_overview_vocabularies_alter',
    ),

    function (&$form, &$form_state, $form_id) {

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
            }
        }

        if (isset($form['#vocabulary']->machine_name ) && $form['#vocabulary']->machine_name == 'site_strucutre_taxonomy'){
            unset($form['field_govdelivery_id']);
            unset($form['field_usefulness_survey']);
            unset($form['field_show_social_media_icon']);
            unset($form['field_term_owner']);
            unset($form['field_help_desk']);
            unset($form['group_asset_carousel_tab']);
            unset($form['field_asset_inherit_carousel']);
            unset($form['field_asset_order_carousel']);
            $form['relations']['#weight'] = 12;
            $form['relations']['weight']['#description']='This field impacts the order of nodes in the taxonomy. Do not touch without training. Terms are displayed in ascending order by weight.';
            $form['relations']['#description'] = 'Select the parent node for this page.';
            $form['name']['#description']='Page Title as listed on Nav Pages, Menus, etc.';
            // JKH added to see if we could fix "the description problem" here
            // tracetofile(__FILE__,__LINE__,"Adding description field");
            // JKH why is this in here twice? JKH commenting one...
            $form['description']['#description']= 'This description of the page will appear on Nav Pages and must be Short. This field also supplies the Page Intro on Top Level Nav pages. Character limit: 170';
            // $form['description']['#description']= 'This description of the page will appear on Nav Pages and must be Short. This field also supplies the Page Intro on Top Level Nav pages. Character limit: 170';
        }
    }
);

hooks_reaction_add(
    array(
        'HOOK_menu_alter'
    ),

    function (&$items) {
        $items['taxonomy_manager/autocomplete']['access callback'] = TRUE;
    }
);
