<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to provide an example on how to create reactions files in 
    this "reactions" directory. In your [newly created] reactions file(s), please follow this file as a template - please 
    include a "PURPOSE" section at the top of your file.
    
    Generally this area should contain a high-level, non-technical, description as to why this script/file was made. 

    [--] TECHNICAL NOTES [--]

    In your [newly created] reactions file(s), please also include this area in the first comment block as well.
    This is the same thing as the "purpose" section, but should be more technical.

    [!!] WARNING [!!]

    If you have any important information that that other developers must know about this script, please 
    include it in a [!!] WARNING [!!] section, also, please list this section ABOVE the "purpose" and 
    "technical notes" section.
        
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
 * Add a submit handler/function to the form.
 *
 * This will add a completion message to the screen when the
 * form successfully processes
 */
function searchReplaceOwnerForm_submit($form, &$form_state) {
    
    $ownerToReplace = $form_state['input']['ownersearch'];
    $replaceWith = $form_state['input']['ownerreplace'];

    if(!empty($ownerToReplace) && strlen($ownerToReplace) != 0 && !empty($replaceWith) && strlen($replaceWith) != 0 ){

         $result = db_query("UPDATE {field_data_field_owner}
                            SET {field_data_field_owner}.field_owner_target_id = (SELECT uid FROM {users} WHERE name LIKE '%$replaceWith%' LIMIT 1)
                            WHERE {field_data_field_owner}.field_owner_target_id = (SELECT uid FROM {users} WHERE name LIKE '%$ownerToReplace%' LIMIT 1);");

        drupal_set_message("'{$ownerToReplace}' has been replaced with '{$replaceWith}'", 'status');      
     
    } else {
        drupal_set_message("Please fill out both fields", 'status'); 
    }
}
?>
