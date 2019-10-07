<?php

hooks_reaction_add(array("hook_form_taxonomy_form_term_alter","hook_form_taxonomy_manager_form_alter"),
    function (&$form, &$form_state, $form_id) {
        
        if (isset($form['#entity']->tid)) {
            $form['name']['#prefix'] = '<div class="form-item form-type-textfield form-item-name"><label for="edit-name">' . t("Taxonomy Term Id: ") .'</label>'. $form['#entity']->tid . '</div>';
        }

        $changed = null;
        if ( !empty($form['#entity']) && isset($form['#entity']->changed) )
        {
            $changed = $form['#entity']->changed;
        } else if ( !empty($form['term_data']) && !empty($form['term_data']['#term'])  && isset($form['term_data']['#term']['changed']) ) {
            $changed = $form['term_data']['#term']['changed'];
        }
        if ( $changed )
        {
            $convert_to_date= gmdate("m-d-Y", $changed);
           /* $form['term_data']['last_chnaged_date'] = array(
              '#type' => 'markup',
              '#title' => t("Last changed on"),
              '#markup' => $convert_to_date,
              '#weight' => -80,
            );*/
            $form['name']['#prefix'] .= '<div class="form-item form-type-textfield form-item-name"><label for="edit-name">' . t("Last Changed Timestamp: ") .'</label>'. $convert_to_date . '</div>';
        }
});
