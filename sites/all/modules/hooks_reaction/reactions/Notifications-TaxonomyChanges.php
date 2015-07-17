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
            || trim($termOld->field_page_title['und'][0]['value']) !== trim($termNew->field_page_title['und'][0]['value'])
        ) {

            if ( trim($termOld->field_page_title['und'][0]['value']) !== trim($termNew->field_page_title['und'][0]['value']) ) {

                informPmTeamOfPageChange(
                    SS_CHANGE_TITLE,
                    $termNew->field_page_title['und'][0]['value'],
                    $termOld->field_page_title['und'][0]['value'],
                    $termNew
                );
            }
        }

        // Check if the URL is being changed
        if (
            empty($termOld->field_friendly_url) !== empty($termNew->field_friendly_url)
            || empty($termOld->field_friendly_url['und']) !== empty($termNew->field_friendly_url['und'])
            || empty($termOld->field_friendly_url['und'][0]) !== empty($termNew->field_friendly_url['und'][0])
            || $termOld->field_friendly_url['und'][0]['value'] !== $termNew->field_friendly_url['und'][0]['value']
        ) {

            if ( $termOld->field_friendly_url['und'][0]['value'] !== $termNew->field_friendly_url['und'][0]['value'] ) {
                
                informPmTeamOfPageChange(
                    SS_CHANGE_URL,
                    $termNew->field_friendly_url['und'][0]['value'],
                    $termOld->field_friendly_url['und'][0]['value'],
                    $termNew
                );
            }
        }

        // Get a list of all assets in order to check if the assets are being changed
        $allAssetsNew = getAssetsInSiteStructTerm($termNew, false);
        $allAssetsNew = ( is_null($allAssetsNew) ? array() : $allAssetsNew );
        $allAssetsOld = getAssetsInSiteStructTerm($termOld, false);
        $allAssetsOld = ( is_null($allAssetsOld) ? array() : $allAssetsOld );

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
if ( !function_exists('getAssetsInSiteStructTerm') ) {
    function getAssetsInSiteStructTerm($term, $loadAssets = false, $maintainSections = false) {
        
        $ret = array();

        // Get the top-level-term name for this $term
        if ( empty($term->tid) ) {
            return array();
        }
        $tltName = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid=".$term->tid)->fetchColumn();
        if ( $tltName === false ) {
            return array();
        }

        if ( $tltName === 'Kids.gov' ) {

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

                        if ( $maintainSections ) {
                            $regionName = strrev(strtok(strrev($assetFieldContainer), '_'));
                            if ( !isset($ret[$regionName]) ) {
                                $ret[$regionName] = array();
                            }
                            $ret[$regionName][] = $targetContainer['target_id'];
                        } else {
                            $ret[] = $targetContainer['target_id'];
                        }
                    }
                }
            }

        } else {

            /* NON-Kids site logic (lookup based on Asset-Topic assignment) */

            // Get all topic-ids this $term references
            $arrTopicIds = array();
            if ( !empty($term->field_asset_topic_taxonomy) && !empty($term->field_asset_topic_taxonomy['und']) ) {
                foreach ( $term->field_asset_topic_taxonomy['und'] as $topicIdContainer ) {
                    $arrTopicIds[] = $topicIdContainer['tid'];
                }
            }
            $strTopicIds = implode(',', $arrTopicIds);

            // Get all node-IDs that reference these $strTermIds
            if ( trim($strTopicIds) === '' ) {

                // There are no Topics selected, so there can't be any assets associated
                $ret  = array();

            } else {

                // Query MySQL to get all node-IDs that reference these $strTermIds
                $ret = db_query("
                    SELECT entity_id
                    FROM field_data_field_asset_topic_taxonomy 
                    WHERE 
                        field_asset_topic_taxonomy_tid in ({$strTopicIds}) 
                        AND entity_type='node'
                ")->fetchCol();
            }

            if ( $maintainSections ) {
                $ret = array(
                    'content' => $ret
                );
            }

        }

        if ( !$maintainSections ) {
            sort($ret);
        }

        // Load the assets if requested
        if ( $loadAssets ) {
            if ( $maintainSections ) {
                foreach ($ret as &$section) {
                    foreach ( $section as &$n ) {
                        $n = node_load($n);
                    }
                }
            } else {
                foreach ($ret as &$n) {
                    $n = node_load($n);
                }
            }
        }

        return ( is_null($ret) ? array() : $ret);
    }
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
    $arrTo = array();
    foreach ($mtMembers as $uid => $mtMember) {

        // Do not send to users marked for no notifications
        if (
            variable_get("tax_no_notify_".$uid, false) !== true 
            && strpos($mtMember->name, '@') !== false
            && strpos($mtMember->name, '.') !== false
        ) {
            $arrTo[] = $mtMember->name;
        }
    }
    $strTo = trim(implode(',', $arrTo), ',');

    // Email Subject
    $params['subject'] = 'CMP: Site-Taxonomy Alteration Notifications';

    // Email message body
    global $user;
    $linkToTerm = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$term->tid."/edit";
    $msg = "This is an automated message to inform you that a taxonomy-change has been applied on the CMP.\n<br/>\n<br/>";
    switch ($change) {
        case SS_CHANGE_DEL:
            $msg .= "A taxonomy-term by the name of \"{$term->name}\" was deleted from the system by {$user->name}.<br/>";
            break;
        case SS_CHANGE_ADD:
            $msg .= "A new taxonomy-term (\"{$newValue->name}\") has been added to the system by {$user->name}. <br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_TITLE:
            $msg .= "The taxonomy-term \"{$oldValue}\", has been renamed to \"{$newValue}\" by {$user->name}. <br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_URL:
            $msg .= "The taxonomy-term \"{$term->name}\" has had its Friendly-URL field change ";
            $msg .= "from \"{$oldValue}\" to \"{$newValue}\" by {$user->name}.<br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_ASSET:
            $msg .= "The taxonomy-term \"<a href=\"{$linkToTerm}\">{$term->name}</a>\" has had its ";
            $msg .= "associated assets changed by {$user->name}.\n<br/>";
            $msg .= "\n<br/>";
            $msg .= "The assigned assets were originally:\n<br/>";
            $msg .= "\n<br/>";
            $assets = getAssetsInSiteStructTerm($oldValue, true, true);
            if ( count($assets) === 0 ) {
                $msg .= "<ul><li><i>empty</i></li></ul>";
            } else {
                $msg .= "<ul>";
                foreach ( $assets as $section => $nodes ) {
                    $msg .= ucwords($section)." region:";
                    $msg .= "<ol>";
                    foreach ( $nodes as $node ) {
                        $nodeTitle = str_replace(array("\n","\r","\t","\f"), '', $node->title);
                        $msg .= "<li><a href=\"https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit\">{$nodeTitle}</a></li>";
                    }
                    $msg .= "</ol>";
                    $msg .= "<br/>";
                }
                $msg .= "</ul>";
            }
            $msg .= "\n";
            $msg .= "And now the asset assignment is:\n";
            $assets = getAssetsInSiteStructTerm($newValue, true, true);
            if ( count($assets) === 0 ) {
                $msg .= "<ul><li><i>empty</i></li></ul>";
            } else {
                $msg .= "<ul>";
                foreach ( $assets as $section => $nodes ) {
                    $msg .= ucwords($section)." region:";
                    $msg .= "<ol>";
                    foreach ( $nodes as $node ) {
                        $nodeTitle = str_replace(array("\n","\r","\t","\f"), '', $node->title);
                        $msg .= "<li><a href=\"https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit\">{$nodeTitle}</a></li>";
                    }
                    $msg .= "</ol>";
                    $msg .= "<br/>";
                }
                $msg .= "</ul>";
            }
            $msg .= "<br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
    }
    $params['body'] = $msg;

    // Email headers
    $from = variable_get('site_mail', '');
    $params['from'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . $from . '>');
    $params['headers']['Reply-To'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . variable_get('site_mail', '') . '>');

    // We check and prevent developer's locals from sending emails here
    $prodStageDomains = variable_get('udm_prod_domains', array());
    if ( in_array($_SERVER['HTTP_HOST'], $prodStageDomains) ) {

        /* Based on the first parameter to drupal_mail(), notifyTaxonomyEmpty_mail() will 
        be called and used to determine the email-message to send. */
        $res = drupal_mail(
            'cmp_misc',
            'scanning_content',
            $strTo,
            language_default(),
            $params,
            $params['from']
        );
        if ($res["send"]) {
            drupal_set_message("Send taxonomy-update notification emails to: " . $strTo);
        }

    } else {
        // then we are running on someone's local, do NOT send the email
        drupal_set_message("Notification email has NOT been sent because this environment is neither STAGE nor PROD.");
    }

}
