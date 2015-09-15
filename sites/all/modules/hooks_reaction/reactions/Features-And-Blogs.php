<?php

hooks_reaction_add('HOOK_form_text_content_type_node_form_alter',

    function (&$form, &$form_state, $form_id) {

        global $user;

        if(!in_array('administrator', $user->roles) && !in_array('editor', $user->roles) && !in_array('content author', $user->roles) && !in_array('usa administrators', $user->roles)){

            foreach ($form['field_for_use_by_text']['und']['#options'] as $item) {
                switch ($item) {
                    case 'USA.gov':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                    case 'GobiernoUSA.gov':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                    case 'Kids.USA.gov':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                    case 'NCC Knowledge Base':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                    case 'Print CAH':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                    case 'Print Guia':
                        unset($form['field_for_use_by_text']['und']['#options'][$item]);
                        break;
                }
            }

        }
    }
);

