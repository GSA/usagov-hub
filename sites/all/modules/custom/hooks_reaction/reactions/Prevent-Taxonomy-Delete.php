<?php

hooks_reaction_add(
    "menu",
    function () {

        $menuArr = array();

        $menuArr['admin/config/taxonomy-delete/prevent'] = array(
            'title' => 'Prevent Terms from deletion',
            'description' => 'Control which terms cannot be deleted',
            'page callback' => 'drupal_get_form',
            'page arguments' => array('prevent_term_deletion_form'),
            'access arguments' => array('access administration pages'),
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);
function prevent_term_deletion_form()
{
    $form = array();
    $form['prevent_term_deletion'] = array(
        '#type' => 'textarea',
        '#title' => 'Prevent Terms from deletion',
        '#description'=> 'Please define term id in comma separated',
        '#default_value' => variable_get('prevent_term_deletion', '3062,3067,11272')
    );

    $form['delete'] = array(
        '#type' => 'submit',
        '#value' => 'Save Changes',
    );

    return $form;
}
function prevent_term_deletion_form_submit($form, &$form_state)
{
    variable_set('prevent_term_deletion', $form_state['values']['prevent_term_deletion']);

    drupal_set_message('Your settings have been saved', 'status');
}

hooks_reaction_add(array("hook_form_taxonomy_form_term_alter"),
    function (&$form, &$form_state, $form_id) {

        $tids = explode(',',variable_get('prevent_term_deletion', false));
        foreach($tids as $tid) {
            if ($form['tid']['#value'] == trim($tid)) {
                // hide delete button
                $form['actions']['delete']['#disabled'] = TRUE;
            }
        }
    });
