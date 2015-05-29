<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to notify the PM-Team when pages are:
        * deleted; 
        * newly added
        * page titles are changed
        * page URLs are changed
        * assets are added or deleted from a page

    [--] TICKET HISTORY [--]

    2015-05-20 - Created to resolve ticket: usagov-100379: "PM team notifications when page events occur"
        
*/

define("SS_CHANGE_NOTIFY_ROLE", 'pm team');
define("SS_CHANGE_DEL", 0);
define("SS_CHANGE_ADD", 1);
define("SS_CHANGE_TITLE", 2);
define("SS_CHANGE_URL", 3);
define("SS_CHANGE_ASSET", 4);

/**
 * Implements HOOK_menu().
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        $menuArr['admin/config/notifications/taxonomy-alter'] = array(
            'title' => 'Members who receive taxonomy notifications',
            'description' => 'Control which users receive taxonomy-alteration notifications.',
            'page callback' => 'drupal_get_form',
            'page arguments' => array('notify_tax_change_form'),
            'access arguments' => array('access administration pages'),
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

/**
 * Implements HOOK_taxonomy_term_delete
 */
hooks_reaction_add("HOOK_taxonomy_term_delete",
    function ($term) {
        informPmTeamOfPageChange(SS_CHANGE_DEL, $term, false, $term);
    }
);

/**
 * Implements HOOK_taxonomy_term_insert
 */
hooks_reaction_add("HOOK_taxonomy_term_insert",
    function ($term) {
        informPmTeamOfPageChange(SS_CHANGE_ADD, $term, false, $term);
    }
);

/**
 * Implements hook_taxonomy_term_presave
 *
 * Reacts when:
 *     page titles are changed
 *     page URLs are changed
 *     assets are added or deleted from a page
 */
hooks_reaction_add("HOOK_taxonomy_term_presave",
    function ($term) {

        $termOld = taxonomy_term_load($term->tid);
        $termNew = $term;

        // Check if the title is being changed
        if (
            empty($termOld->field_page_title) !== empty($termNew->field_page_title)
            || empty($termOld->field_page_title['und']) !== empty($termNew->field_page_title['und'])
            || empty($termOld->field_page_title['und'][0]) !== empty($termNew->field_page_title['und'][0])
            || $termOld->field_page_title['und'][0]['value'] !== $termNew->field_page_title['und'][0]['value']
        ) {
            informPmTeamOfPageChange(
                SS_CHANGE_TITLE,
                $termNew->field_page_title['und'][0]['value'],
                $termOld->field_page_title['und'][0]['value'],
                $termNew
            );
        }

        // Check if the URL is being changed
        if (
            empty($termOld->field_friendly_url) !== empty($termNew->field_friendly_url)
            || empty($termOld->field_friendly_url['und']) !== empty($termNew->field_friendly_url['und'])
            || empty($termOld->field_friendly_url['und'][0]) !== empty($termNew->field_friendly_url['und'][0])
            || $termOld->field_friendly_url['und'][0]['value'] !== $termNew->field_friendly_url['und'][0]['value']
        ) {
            informPmTeamOfPageChange(
                SS_CHANGE_URL,
                $termNew->field_friendly_url['und'][0]['value'],
                $termOld->field_friendly_url['und'][0]['value'],
                $termNew
            );
        }

        // Get a list of all assets in order to check if the assets are being changed
        $allAssetsNew = getAssetsInSiteStructTerm($termNew, false);
        $allAssetsOld = getAssetsInSiteStructTerm($termOld, false);

        // Check if the assets are being changed
        if ( implode(',', $allAssetsNew) !== implode(',', $allAssetsOld) ) {
            informPmTeamOfPageChange(
                SS_CHANGE_ASSET,
                $termNew,
                $termOld,
                $termNew
            );
        }

    }
);

/**
 * array getAssetsInSiteStructTerm($term[, $loadAssets = false])
 *
 * Given a loaded Site-Structure taxonomy-term, this function will find all the 
 * assets assigned to this node.
 *
 * Returns an array of node-IDs, or array of loaded nodes (based on the seconds argument).
 */
function getAssetsInSiteStructTerm($term, $loadAssets = false) {

    $ret = array();

    // These fields in S.S-taxonomy-terms hold pointers to nodes (assets)
    $assetFieldContainers = array(
        'field_asset_order_carousel',
        'field_asset_order_content',
        'field_asset_order_sidebar',
        'field_asset_order_bottom'
    );

    // Look in each of these fields for node-id references
    foreach ( $assetFieldContainers as $assetFieldContainer ) {
        if ( !empty($term->{$assetFieldContainer}) && !empty($term->{$assetFieldContainer}['und']) ) {

            // Look for [multiple] node-id references in this field
            foreach ( $term->{$assetFieldContainer}['und'] as $targetContainer ) {

                $ret[] = $targetContainer['target_id'];
            }
        }
    }

    sort($ret);

    // Load the assets if requested
    if ( $loadAssets ) {
        foreach ($ret as &$n) {
            $n = node_load($n);
        }
    }

    return $ret;
}

function notify_tax_change_form() {

    $form = array();

    $form['assetfix'] = array(
        '#markup' => 'Note: By default, all members with the "'.SS_CHANGE_NOTIFY_ROLE.'" role will receive '
            .'a notification when a Site-Structure Taxonomy-term is changed.<br/>'
            .'To ensure a particular user of this role <b>does not</b> receive these '
            .'messages, tick the appropriate checkbox below.<br/><br/>',
    );

    $form['nonotify'] = array(
        '#type' => 'fieldset', 
        '#title' => 'Do not send notifications to:',
        '#collapsible' => false, 
        '#collapsed' => false,
    );

    // Get the role-id for SS_CHANGE_NOTIFY_ROLE
    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    if ( $role === false ) {
        drupal_set_message(
            'The "'.SS_CHANGE_NOTIFY_ROLE.'" role does not exsist in this system. Please create '
                .'this role and assign users to it.',
            'error'
        );
        return array();
    }

    // Get all the users assigned to this role
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();
    $mtMembers = user_load_multiple($uids);
    if ( count($mtMembers) === 0 ) {
        drupal_set_message(
            'The "'.SS_CHANGE_NOTIFY_ROLE.'" role does not have any users assigned to it. You can '
                .'not change any settings here until some users are assigned.',
            'warning'
        );
        return array();
    }

    foreach ( $mtMembers as $mtMember ) {
        $key = "tax_no_notify_".$mtMember->uid;
        $form["nonotify"][$key] = array(
            '#type' => 'checkbox', 
            '#title' => 'User: '.$mtMember->name,
            '#default_value' => variable_get($key, false)
        );
    }

    $form['nonotify']['delete'] = array(
        '#type' => 'submit',
        '#value' => 'Save Changes',
    );

    return $form;
}

function notify_tax_change_form_submit($form, &$form_state) {
    
    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();
    $mtMembers = user_load_multiple($uids);

    foreach ( $mtMembers as $mtMember ) {
        $key = "tax_no_notify_".$mtMember->uid;
        $noSend = ( intval($form_state['input'][$key]) === 1 );
        variable_set($key, $noSend);
    }

    drupal_set_message('Your settings have been saved', 'status');
}

function informPmTeamOfPageChange($change, $newValue, $oldValue = false, $term = false) {

    // Get the role-id for the SS_CHANGE_NOTIFY_ROLE role
    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    if ( $role === false ) {
        return;
    }

    // Get a list of users to email (users in this role)
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();
    $mtMembers = user_load_multiple($uids);

    // Send a message to each member of the SS_CHANGE_NOTIFY_ROLE role
    foreach ($mtMembers as $uid => $mtMember) {

        // Do not send to users marked for no notifications
        if ( variable_get("tax_no_notify_".$uid, false) == true ) {
            unset($mtMembers[$uid]);
        } else {

            /* Based on the first parameter to drupal_mail(), notifyTaxonomyChange_mail() will 
            be called and used to determin the email-message to send. */
            error_log("Sending email to {$mtMember->name}");
            drupal_mail(
                'notifyTaxonomyChange',
                'taxnotice',
                $mtMember->name,
                'und',
                array(
                    'newValue' => $newValue,
                    'oldValue' => $oldValue,
                    'term' => $term,
                    'change' => $change,
                    'Content-Type' => 'text/plain;'
                )
            );

        }

    }

}

function notifyTaxonomyChange_mail($key, &$message, $params) {

    $message['subject'] = 'CMP: Site-Taxonomy Alteration Notifications';

    $msg = "This is an automated message to inform you that a taxonomy-change has been applied on the CMP.\n\n";
    switch ($params['change']) {
        case SS_CHANGE_DEL:
            $msg .= "A taxonomy-term by the name of \"{$params['term']->name}\" was deleted from the system.";
            break;
        case SS_CHANGE_ADD:
            $msg .= "A new taxonomy-term (\"{$params['newValue']}\") has been added to the system.";
            $msg .= "You can edit this taxonomy-term from: https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$params['term']->tid."/edit";
            break;
        case SS_CHANGE_TITLE:
            $msg .= "The taxonomy-term \"{$params['oldValue']}\", has been renamed to \"{$params['newValue']}\". ";
            $msg .= "You can edit this taxonomy-term from: https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$params['term']->tid."/edit";
            break;
        case SS_CHANGE_URL:
            $msg .= "The taxonomy-term \"{$params['term']->name}\" has had its Friendly-URL field change from \"{$params['oldValue']}\" to \"{$params['newValue']}\".";
            $msg .= "You can edit this taxonomy-term from: https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$params['term']->tid."/edit";
            break;
        case SS_CHANGE_ASSET:
            $msg .= "The taxonomy-term \"{$params['term']->name}\" has had its associated assets changed.\n";
            $msg .= "\n";
            $msg .= "The assigned assets were originally:\n";
            $msg .= "\n";
            foreach ( getAssetsInSiteStructTerm($params['oldValue'], true) as $node ) {
                $msg .= "\t* {$node->title} ( https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit )\n";
            }
            $msg .= "\n";
            $msg .= "And now the asset assignment is:\n";
            foreach ( getAssetsInSiteStructTerm($params['newValue'], true) as $node ) {
                $msg .= "\t* {$node->title} ( https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit )\n";
            }
            $msg .= "\n";
            $msg .= "You can edit this taxonomy-term from: https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$params['term']->tid."/edit";
            break;
    }
    $message['body'][] = $msg;
}