<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to create a page that allows users to search and replace the owner field value
    with another user.
            
*/

/**
 * Implements HOOK_menu().
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register http://YourWebSite.com/admin/find-replace/owner
        $menuArr['admin/find-replace/owner'] = array(
            'title' => 'Search and Replace Owners',
            'description' => 'A page that allows the user to search and replace the owner field values on all assets',
            'page callback' => 'searchReplaceOwnersPage',
            'access arguments' => array('access administration pages'),
            'type' => MENU_NORMAL_ITEM,
        );


        // Register http://YourWebSite.com/admin/find-replace/owner/autocomplete
        $menuArr['admin/find-replace/owner/ownersearch'] = array(
            'title' => 'AutoComp Menu',
            'page callback' => 'searchOwners',
            'access arguments' => array('access administration pages'),
            'type' => MENU_CALLBACK,
        );

        // Register http://YourWebSite.com/admin/find-replace/owner/autocomplete
        $menuArr['admin/find-replace/owner/ownerreplace'] = array(
            'title' => 'AutoComp Menu',
            'page callback' => 'replaceOwners',
            'access arguments' => array('access administration pages'),
            'type' => MENU_CALLBACK,
        );

        return $menuArr;
    }
);

/**
 * A callback function for http://YourWebSite.com/admin/find-replace/owner
 */
function searchReplaceOwnersPage() {
    return drupal_render(drupal_get_form('searchReplaceOwnerForm'));
}


/**
 * Creates the search and replace form
 */
function searchReplaceOwnerForm() {

    $form['ownersearch'] = array(
        '#type' => 'textfield',
        '#title' => 'Search For Owner',
        '#maxlength' => 128,
        '#autocomplete_path' => 'admin/find-replace/owner/ownersearch',
        '#required' => TRUE
    );

    $form['ownerreplace'] = array(
        '#type' => 'textfield',
        '#title' => 'Replace With',
        '#maxlength' => 128,
        '#autocomplete_path' => 'admin/find-replace/owner/ownerreplace',
        '#required' => TRUE
    );
    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => 'Update Owner Fields',
    );
    return $form;

}


/**
 * Finds Owners of Assets (Search For Owner Field)
 */
function searchOwners($string) {
    $result = db_query("SELECT DISTINCT {users}.name FROM {users}
                        inner join {field_data_field_owner}
                        on  {users}.uid = {field_data_field_owner}.field_owner_target_id 
                        WHERE {users}.name Like '%$string%' LIMIT 10");
    $matches = array();
    foreach($result as $row) {
        $matches[$row->name] = check_plain($row->name);
    }
    drupal_json_output($matches);
    exit;
}


/**
 * Finds All users in system (Replace With Field)
 */
function replaceOwners($string) {
    $result = db_query("SELECT name FROM {users} WHERE name LIKE '%$string%' LIMIT 10");
    $matches = array();
    foreach($result as $row) {
        $matches[$row->name] = check_plain($row->name);
    }
    drupal_json_output($matches);
    exit;
}

/**
 * Add a validation handler/function to the form.
 *
 * Validates the searchReplaceOwnerForm form.
 */
function searchReplaceOwnerForm_validate($form, &$form_state) {

    
    $ownerToReplace = $form_state['input']['ownersearch'];
    $replaceWith = $form_state['input']['ownerreplace'];
    
    $replaceWithUserId = db_query("SELECT uid FROM users WHERE name = '{$ownerToReplace}' LIMIT 1")->fetchColumn();
    if ( intval($replaceWithUserId) === 0 ) {
        form_set_error('Form Error', 'Invalid user supplied for the "Search for Owner" field.');
    }

    $replaceWithUserId = db_query("SELECT uid FROM users WHERE name = '{$replaceWith}' LIMIT 1")->fetchColumn();
    if ( intval($replaceWithUserId) === 0 ) {
        form_set_error('Form Error', 'Invalid user supplied for the "Replace With" field.');
    }
}

/**
 * Add a submit handler/function to the form.
 *
 * This will add a completion message to the screen when the
 * form successfully processes
 */
function searchReplaceOwnerForm_submit($form, &$form_state) {
    
    $ownerToReplace = $form_state['input']['ownersearch'];
    $replaceWith = $form_state['input']['ownerreplace'];

     $result = db_query("UPDATE {field_data_field_owner}
                        SET {field_data_field_owner}.field_owner_target_id = (SELECT uid FROM {users} WHERE name = '%$replaceWith%' LIMIT 1)
                        WHERE {field_data_field_owner}.field_owner_target_id = (SELECT uid FROM {users} WHERE name = '%$ownerToReplace%' LIMIT 1);");

    drupal_set_message("'{$ownerToReplace}' has been replaced with '{$replaceWith}'", 'status');      

}

?>