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

    $resultRevisions = db_query("SELECT DISTINCT {users}.name FROM {users}
                        inner join {field_revision_field_owner}
                        on  {users}.uid = {field_revision_field_owner}.field_owner_target_id 
                        WHERE {users}.name Like '%$string%' LIMIT 10");
    $matches = array();
    foreach($result as $row) {
        $matches[$row->name] = check_plain($row->name);
    }

    foreach($resultRevisions as $row) {
        if(!in_array(check_plain($row->name), $matches))
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

    $nidsEffected = array();
    
    // Get the data to find
    $ownerToReplaceUserName = $form_state['input']['ownersearch'];
    $ownerToReplaceUserId = db_query("SELECT uid FROM users WHERE name = '{$ownerToReplaceUserName}' LIMIT 1")->fetchColumn();

    // Get the data to replace with
    $replaceWithUserName = $form_state['input']['ownerreplace'];
    $replaceWithUserId = db_query("SELECT uid FROM users WHERE name = '{$replaceWithUserName}' LIMIT 1")->fetchColumn();

    // We shall search/replace across these tables
    $tableFields = array(
        'field_data_field_owner' => 'field_owner_target_id',
        'field_revision_field_owner' => 'field_owner_target_id',
    );

    // Run through the nessesary tables
    foreach ( $tableFields as $table => $field ) {

        // First we want to node what node-IDs will be effected
        $foundTargets = db_query("SELECT entity_id FROM {$table} WHERE {$field} = {$ownerToReplaceUserId}")->fetchCol();
        foreach ( $foundTargets as $foundTarget ) {
            $nidsEffected[$foundTarget] = $foundTarget;
        }

        // Do the actual find/replace
        db_query("UPDATE {$table} SET {$field} = {$replaceWithUserId} WHERE {$field} = {$ownerToReplaceUserId}");
    }

    // Clear the Drupal cache so the database changes show up on the UI
    cache_clear_all('*', 'cache_field', TRUE);

    // For each node effected, push it up to the elastic-search index
    foreach ( $nidsEffected as $nidEffected ) {
        searchReplaceOwner_pushNodesLatestRevisionIntoSearchIndex($nidEffected);
    }

    drupal_set_message("'{$ownerToReplaceUserName}' has been replaced with '{$replaceWithUserName}'", 'status');      

}

function searchReplaceOwner_pushNodesLatestRevisionIntoSearchIndex($nid) {

    // Get the latest revision-id for this node
    $n = node_load($nid);
    $nodeRevisions = array_keys( node_revision_list($n) );
    $latestRevisonId = $nodeRevisions[0];

    // Load the correct revision of this entity
    $entities = array_values(entity_load(
        'node',
        array($nid),
        array('vid' => $latestRevisonId)
    ));
    $entity = $entities[0];

    /* Trigger HOOK_entity_update() within the search_api module. Effectively making 
    the search_api module think that THIS $entity has been modified and that this $entity
    should be pushed into the search index. */
    search_api_entity_update($entity, 'node');
}

?>