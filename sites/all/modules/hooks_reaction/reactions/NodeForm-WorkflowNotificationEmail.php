<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to turn the "Workflow Notification Email" field on node creation/edit forms into
    a autocomplete textbox.

    [--] TICKET HISTORY [--]

    2015-05-20 - Created to resolve ticket: usagov-100369: "Convert the workflow e-mail field from a free-form text field[...]"
        
*/

/**
 * Implements HOOK_menu().
 *
 * Implements HOOK_menu item for ajax-callback
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register http://YourWebSite.com/ajax/auto-complete/workflow-notify
        $menuArr['ajax/auto-complete/workflow-notify'] = array(
            'title' => 'Auto-Complete handeler for the Workflow-Notification-Email field',
            'description' => 'Auto-Complete handeler for the Workflow-Notification-Email field.',
            'page callback' => 'ajaxRespondWorkflowNotificationEmail',
            'access arguments' => array('access administration pages'),
            'type' => MENU_CALLBACK,
        );

        return $menuArr;
    }
);

/**
 * Implements HOOK_form_FORM_ID_alter() to edit the forms:
 *  form_text_content_type_node_form_alter
 *  form_multimedia_content_type_node_form_alter
 *  form_html_content_type_node_form_alter
 *  form_directory_record_content_type_node_form_alter
 *
 * This will turn the "Workflow Notification Email" field into a autocomplete textbox.
 */
hooks_reaction_add(
    array(
        "form_text_content_type_node_form_alter",
        "form_multimedia_content_type_node_form_alter",
        "form_html_content_type_node_form_alter",
        "form_directory_record_content_type_node_form_alter",
    ),
    function (&$form, &$form_state, $form_id) {
        
        if ( !empty($form['field_workflow_notification_emai']['und'][0]['value']) ) {
            
            $form['field_workflow_notification_emai']['und'][0]['value']['#autocomplete_path'] = 'ajax/auto-complete/workflow-notify';
            if ( !empty($form['field_workflow_notification_emai']['und'][0]['value']['#attributes']) ) {

            }
        }

    }
);

/**
 * void ajaxRespondWorkflowNotificationEmail()
 *
 * Finds All users in system (Replace With Field)
 * WARNING: This function terminates the PHP-thread.
 */
function ajaxRespondWorkflowNotificationEmail($string) {

    // Get a list of users based on the search string
    $ret = array();
    foreach( db_query("SELECT name FROM users WHERE name LIKE '%{$string}%' LIMIT 10") as $row ) {
        $ret[$row->name] = check_plain($row->name);
    }

    // Kill anything Drupal has tried printing so far (if anything at all)
    ob_end_clean();
    while ( @ob_end_clean() );

    drupal_json_output($ret);
    exit();
}