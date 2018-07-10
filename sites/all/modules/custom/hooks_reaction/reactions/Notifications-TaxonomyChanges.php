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
hooks_reaction_add(
    "menu",
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
hooks_reaction_add(
    "HOOK_taxonomy_term_delete",
    function ($term) {
        informPmTeamOfPageChange(SS_CHANGE_DEL, $term, false, $term);
    }
);

/**
 * Implements HOOK_taxonomy_term_insert
 */
hooks_reaction_add(
    "HOOK_taxonomy_term_insert",
    function ($term) {
        informPmTeamOfPageChange(SS_CHANGE_ADD, $term, false, $term);
    }
);


/**
 * Implements hook_taxonomy_term_delete
 *
 * Checks if an Asset-Topic taxonomy-term is being deleted, and if so, checks to see
 * which pages were altered by this action, and informs the appropriate users.
 */
hooks_reaction_add(
    "HOOK_taxonomy_term_delete",
    function ($term) {

        // We only carte about Asset-Topic tax-terms here
        if ($term->vocabulary_machine_name !== 'asset_topic_taxonomy') {
            return;
        }

        // Find all S.S-tax-terms that were using this Topic
        $loosingPages = db_query("
            SELECT entity_id
            FROM field_data_field_asset_topic_taxonomy
            WHERE
                entity_type = 'taxonomy_term'
                AND field_asset_topic_taxonomy_tid IN ({$term->tid})
        ")->fetchCol();

        // We only care about pages that will loose some assets due to this action
        foreach ($loosingPages as $loosingPageTid) {
            // We need to get the before and after snapshot of the S.S.-tax-term (of $loosingPageTid)
            /* It is important to note here that while the A-Topic term is deleted already, the
            S.S.-term still points to it (because that cleanup hasten happened yet)
            We will use this as an advantage to get the before&after asset associations */

            $ssTermBefore = taxonomy_term_load($loosingPageTid);
            $assetsBefore = getAssetsInSiteStructTerm($ssTermBefore, false, false);

            $ssTermAfter = taxonomy_term_load($loosingPageTid);
            $ssTermAfter = cleanSiteStructTerm_clearDeletedTopics($ssTermAfter); // this cleans out pointers to A-Topics that don't exist
            $assetsAfter = getAssetsInSiteStructTerm($ssTermAfter, false, false);

            // If this page did not loose any assets, OR, if it lost ALL of its assets...
            // NOTE: We don't care about a total-loss to assets because the Notifications-EmptyTaxonomy.php script will get that
            // We only care about pages that loose some, but NOT ALL assets here
            if (count($assetsBefore) == count($assetsAfter) && count($assetsAfter) !== 0) {
                // ...then we dont care about this page
                unset($loosingPages[$loosingPageTid]);
            }
        }

        // At this point $loosingPages should be a list of pages that are now empty with this action
        foreach ($loosingPages as $loosingPageTid) {
            error_log("S.S.taxonomy-term {$loosingPageTid} has lost some assets due to the "
                ."deletion of Asset-Topic {$term->tid}");

            informPmTeamOfPageChange(SS_CHANGE_ASSET, $ssTermAfter, $ssTermBefore, $ssTermAfter);
        }
    }
);

/**
 * void cleanSiteStructTerm_clearDeletedTopics(&$term)
 *
 * Given a loaded taxonomy-term, this function will check for Asset-Topics that
 * no longer exist anymore in the database, and remove them from the term
 */
function cleanSiteStructTerm_clearDeletedTopics($term)
{

    if (empty($term->field_asset_topic_taxonomy['und'])) {
        return $term;
    }
    foreach ($term->field_asset_topic_taxonomy['und'] as $index => $tidContainer) {
        $checkTid = $tidContainer['tid'];

        // If this Topic-taxonomy-term dosnt exist...
        $tidExsists = db_query("SELECT COUNT(tid) FROM taxonomy_term_data WHERE tid={$checkTid}")->fetchColumn();
        if (intval($tidExsists) === 0) {
            // ...then remove it from this S.S.-tax-term
            unset($term->field_asset_topic_taxonomy['und'][$index]);
        }
    }

    // Because we may have dissected elements out of the array - it may have skipping array keys
    $term->field_asset_topic_taxonomy['und'] = array_values($term->field_asset_topic_taxonomy['und']); // reset array keys

    return $term;
}

/**
 * Implements hook_taxonomy_term_presave
 *
 * Reacts when:
 *     page titles are changed
 *     page URLs are changed
 *     assets are added or deleted from a page
 */
hooks_reaction_add(
    "HOOK_taxonomy_term_presave",
    function ($term) {

        if (empty($term->tid)) {
            return;
        }

        $termOld = taxonomy_term_load($term->tid);
        $termNew = $term;

        // Check if the title is being changed
        if (property_exists($termOld, 'field_page_title') && property_exists($termNew, 'field_page_title')
             && ( empty($termOld->field_page_title) !== empty($termNew->field_page_title)
               || empty($termOld->field_page_title['und']) !== empty($termNew->field_page_title['und'])
               || empty($termOld->field_page_title['und'][0]) !== empty($termNew->field_page_title['und'][0])
               || trim($termOld->field_page_title['und'][0]['value']) !== trim($termNew->field_page_title['und'][0]['value']) )
        ) {
            informPmTeamOfPageChange(
                SS_CHANGE_TITLE,
                $termNew->field_page_title['und'][0]['value'],
                $termOld->field_page_title['und'][0]['value'],
                $termNew
            );
        }

        // Check if the URL is being changed
        if (property_exists($termOld, 'field_friendly_url') && property_exists($termNew, 'field_friendly_url')
             && (!empty($termOld->field_friendly_url['und'])             || !empty($termNew->field_friendly_url['und']) )
             && ( empty($termOld->field_friendly_url)                    !== empty($termNew->field_friendly_url)
               || empty($termOld->field_friendly_url['und'])             !== empty($termNew->field_friendly_url['und'])
               || empty($termOld->field_friendly_url['und'][0])          !== empty($termNew->field_friendly_url['und'][0])
               ||  trim($termOld->field_friendly_url['und'][0]['value']) !==  trim($termNew->field_friendly_url['und'][0]['value'])
            )
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
        $allAssetsNew = ( is_null($allAssetsNew) ? array() : $allAssetsNew );
        $allAssetsOld = getAssetsInSiteStructTerm($termOld, false);
        $allAssetsOld = ( is_null($allAssetsOld) ? array() : $allAssetsOld );
        // Check if the assets are being changed
        if (implode(',', $allAssetsNew) !== implode(',', $allAssetsOld)) {
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
 * Implements hook_workbench_moderation_transition
 *
 * Checks if a node is being removed from an Asset-Topic, and if/when so,
 * send a notifications about which pages are effected by this
 */
hooks_reaction_add(
    "HOOK_workbench_moderation_transition",
    function ($node, $previous_state, $new_state) {

        // We don't want to fire this functionality on newly created nodes
        if (empty($node->nid) || node_load($node->nid) === false) {
            return;
        }

        // We only want to send a notifications out when a node become published
        if ($new_state !== 'published') {
            return;
        }

        // We don't want to fire this functionality on nodes that don't have an Asset-Topic field
        if (!isset($node->field_asset_topic_taxonomy)) {
            return;
        }

        // Get the vid of the last node-revision that was published (but not including this one)
        $lastPubVid = db_query("
            SELECT vid
            FROM workbench_moderation_node_history
            WHERE
                InStr(state, 'pub') <> 0
                AND nid = {$node->nid}
                AND vid <> {$node->vid}
                ORDER BY stamp desc
                LIMIT 1;
        ")->fetchColumn();

        $nodeBefore = node_load($node->nid, $lastPubVid);
        $nodeAfter = $node;

        // Get the Asset topics this node is associated with (before save)
        $nodeOldTopics = array();
        if (!empty($nodeBefore->field_asset_topic_taxonomy['und'])) {
            foreach ($nodeBefore->field_asset_topic_taxonomy['und'] as $tidContainer) {
                $nodeOldTopics[] = $tidContainer['tid'];
            }
        }

        // Get the Asset topics this node is associated with (after save)
        $nodeNewTopics = array();
        if (!empty($nodeAfter->field_asset_topic_taxonomy['und'])) {
            foreach ($nodeAfter->field_asset_topic_taxonomy['und'] as $tidContainer) {
                $nodeNewTopics[] = $tidContainer['tid'];
            }
        }

        // If no topics are being changed, there is no notifications to send about this
        if (implode(',', $nodeOldTopics) == implode(',', $nodeNewTopics)) {
            return;
        }

        // Get the topic(s) that just lost, and gained, this asset
        $loosingTopics = array_diff($nodeOldTopics, $nodeNewTopics);
        $gainingTopics = array_diff($nodeNewTopics, $nodeOldTopics);
        // Debug reporting
        foreach ($loosingTopics as $loosingTopicId) {
            error_log("Asset-topic {$loosingTopicId} has just lost the association of node {$node->nid}");
        }
        foreach ($gainingTopics as $gainingTopicId) {
            error_log("Asset-topic {$gainingTopicId} has just gained the association of node {$node->nid}");
        }

        // Find all pages (SS-tax-terms) associated with these loosing topics
        if (count($loosingTopics) == 0) {
            $loosingPages = array();
        } else {
            $strLoosingTopics = implode(',', $loosingTopics);
            $loosingPages = db_query("
                SELECT entity_id
                FROM field_data_field_asset_topic_taxonomy
                WHERE
                    entity_type = 'taxonomy_term'
                    AND field_asset_topic_taxonomy_tid IN ({$strLoosingTopics})
            ")->fetchCol();
            $loosingPages = ( $loosingPages === false ? array() : $loosingPages );
        }

        // Find all pages (SS-tax-terms) associated with these gaining topics
        if (count($gainingTopics) == 0) {
            $gainingPages = array();
        } else {
            $strGainingTopics = implode(',', $gainingTopics);
            $gainingPages = db_query("
                SELECT entity_id
                FROM field_data_field_asset_topic_taxonomy
                WHERE
                    entity_type = 'taxonomy_term'
                    AND field_asset_topic_taxonomy_tid IN ({$strGainingTopics})
            ")->fetchCol();
            $gainingPages = ( $gainingPages === false ? array() : $gainingPages );
        }

        // Inform the SS_CHANGE_NOTIFY_ROLE team that the $loosingPages pages has lost $node
        informPmTeamAssetLoss($node, $loosingTopics, $gainingTopics, $loosingPages, $gainingPages);
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
if (!function_exists('getAssetsInSiteStructTerm')) {
    function getAssetsInSiteStructTerm($term, $loadAssets = false, $maintainSections = false, $ignoreTopicIds = array())
    {
        $ret = array();

        // Get the top-level-term name for this $term
        if (empty($term->tid)) {
            return array();
        }
        $tltName = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid=".$term->tid)->fetchColumn();
        if ($tltName === false) {
            return array();
        }

        if ($tltName === 'Kids.gov') {
            // These fields in S.S-taxonomy-terms hold pointers to nodes (assets)
            $assetFieldContainers = array(
                'field_asset_order_carousel',
                'field_asset_order_content',
                'field_asset_order_sidebar',
                'field_asset_order_bottom'
            );

            // Look in each of these fields for node-id references
            foreach ($assetFieldContainers as $assetFieldContainer) {
                if (!empty($term->{$assetFieldContainer}) && !empty($term->{$assetFieldContainer}['und'])) {
                    // Look for [multiple] node-id references in this field
                    foreach ($term->{$assetFieldContainer}['und'] as $targetContainer) {
                        if ($maintainSections) {
                            $regionName = strrev(strtok(strrev($assetFieldContainer), '_'));
                            if (!isset($ret[$regionName])) {
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
            if (!empty($term->field_asset_topic_taxonomy) && !empty($term->field_asset_topic_taxonomy['und'])) {
                foreach ($term->field_asset_topic_taxonomy['und'] as $topicIdContainer) {
                    if (!in_array($topicIdContainer['tid'], $ignoreTopicIds)) {
                        $arrTopicIds[] = $topicIdContainer['tid'];
                    }
                }
            }
            $strTopicIds = implode(',', $arrTopicIds);

            // Get all node-IDs that reference these $strTermIds
            if (trim($strTopicIds) === '') {
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

            if ($maintainSections) {
                $ret = array(
                    'content' => $ret
                );
            }
        }

        if (!$maintainSections) {
            sort($ret);
        }

        // Load the assets if requested
        if ($loadAssets) {
            if ($maintainSections) {
                foreach ($ret as &$section) {
                    foreach ($section as &$n) {
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

function notify_tax_change_form()
{

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
    if ($role === false) {
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
    if (count($mtMembers) === 0) {
        drupal_set_message(
            'The "'.SS_CHANGE_NOTIFY_ROLE.'" role does not have any users assigned to it. You can '
                .'not change any settings here until some users are assigned.',
            'warning'
        );
        return array();
    }

    foreach ($mtMembers as $mtMember) {
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

function notify_tax_change_form_submit($form, &$form_state)
{

    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();
    $mtMembers = user_load_multiple($uids);

    foreach ($mtMembers as $mtMember) {
        $key = "tax_no_notify_".$mtMember->uid;
        $noSend = ( intval($form_state['input'][$key]) === 1 );
        variable_set($key, $noSend);
    }

    drupal_set_message('Your settings have been saved', 'status');
}

/**
 * void informPmTeamAssetLoss()
 *
 * This function dispatches an email informing the SS_CHANGE_NOTIFY_ROLE users that
 * the given $node was altered in such a way that the given pages will gain/loose
 * this asset on them.
 */
function informPmTeamAssetLoss($node, $topicLossTids, $topicGainTids, $pageLossTids, $pageGainTids)
{

    // Get the role-id for the SS_CHANGE_NOTIFY_ROLE role
    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    if ($role === false) {
        return;
    }

    // Get a list of users to email (users in this role)
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();
    $mtMembers = user_load_multiple($uids);

    // Send a message to each member of the SS_CHANGE_NOTIFY_ROLE role
    $arrTo = array();
    foreach ($mtMembers as $uid => $mtMember) {
        // Do not send to users marked for no notifications
        if (variable_get("tax_no_notify_".$uid, false) !== true
            && strpos($mtMember->name, '@') !== false
            && strpos($mtMember->name, '.') !== false
        ) {
            $arrTo[] = $mtMember->name;
        }
    }
    $strTo = trim(implode(',', $arrTo), ',');

    // Email Subject
    $params['subject'] = 'CMP: Asset-Topic Alteration Notification, and pages effected.'._get_env_string();

    // Email body
    $nodeHref = "https://".$_SERVER['HTTP_HOST']."/node/".$node->nid."/edit";
    $nodeAnchor = l($node->title, $nodeHref);
    $msg = "This is an automated message to inform you that an asset has had its "
        ."associated-topic(s) changed on the CMP.<br/><br/>";

    // EMail body - topics lost
    if (count($topicLossTids) > 0) {
        $msg .= "The asset \"{$nodeAnchor}\" was disassociated with the topic(s): <br/>";
        $msg .= "<ul>";
        foreach ($topicLossTids as $topicLossTid) {
            $topicTerm = taxonomy_term_load($topicLossTid);
            $termHref = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$topicTerm->tid."/edit";
            $msg .= "<li>".l($topicTerm->name, $termHref)."</li>";
        }
        $msg .= "</ul><br/>";
    }

    // EMail body - topics gained
    if (count($topicGainTids) > 0) {
        $msg .= "The asset \"{$nodeAnchor}\" was associated with the topic(s): <br/>";
        $msg .= "<ul>";
        foreach ($topicGainTids as $topicGainTid) {
            $topicTerm = taxonomy_term_load($topicGainTid);
            $termHref = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$topicTerm->tid."/edit";
            $msg .= "<li>".l($topicTerm->name, $termHref)."</li>";
        }
        $msg .= "</ul><br/>";
    }

    // EMail body - pages gained
    if (count($pageLossTids) > 0) {
        $msg .= "This actions removes \"{$nodeAnchor}\" from the page(s): <br/>";
        $msg .= "<ul>";
        foreach ($pageLossTids as $pageLossTid) {
            $ssTerm = taxonomy_term_load($pageLossTid);
            $ii = 0;
            foreach($ssTerm->field_asset_order_content['und'] as $nodeId){

                if($nodeId['target_id'] == $node->nid){
                    unset($ssTerm->field_asset_order_content['und'][$ii]);
                }
                $ii++;
            }
            taxonomy_term_save($ssTerm);
            $termHref = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$ssTerm->tid."/edit";
            $msg .= "<li>".l($ssTerm->name, $termHref)."</li>";
        }
        $msg .= "</ul><br/>";
    }

    // EMail body - pages gained
    if (count($pageGainTids) > 0) {
        $msg .= "This actions adds \"{$nodeAnchor}\" to the page(s): <br/>";
        $msg .= "<ul>";
        foreach ($pageGainTids as $pageGainTid) {
            $ssTerm = taxonomy_term_load($pageGainTid);
            $termHref = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$ssTerm->tid."/edit";
            $msg .= "<li>".l($ssTerm->name, $termHref)."</li>";
        }
        $msg .= "</ul><br/>";
    }

    // EMail body
    $msg .= "<br/>You can edit this asset from: " . l($nodeHref, $nodeHref);
    $params['body'] = $msg;

    // Email headers
    $from = variable_get('site_mail', '');
    $params['from'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . $from . '>');
    $params['headers']['Reply-To'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . variable_get('site_mail', '') . '>');

        /* Based on the first parameter to drupal_mail(), notifyTaxonomyEmpty_mail() will
        be called and used to determine the email-message to send. */
    try {
        $res = drupal_mail(
            'cmp_misc',
            'taxonomy-notification',
            $strTo,
            language_default(),
            $params,
            $params['from']
        );
    } catch(Exception $e) {
      watchdog('cmp mailer',__FUNCTION__.' : '.$e->getMessage() );
      return;
    }
    if ($res["send"]) {
        drupal_set_message("Send taxonomy-update notification emails to: " . $strTo);
    }


    // } else {
    //     // then we are running on someone's local, do NOT send the email
    //     drupal_set_message("Notification email has NOT been sent because this environment is neither STAGE nor PROD."._get_env_string());
    // }
}

function informPmTeamOfPageChange($change, $newValue, $oldValue = false, $term = false)
{

    // Get the role-id for the SS_CHANGE_NOTIFY_ROLE role
    $role = user_role_load_by_name(SS_CHANGE_NOTIFY_ROLE);
    if ($role === false) {
        return;
    }

    // Get a list of users to email (users in this role)
    $uids = db_query("SELECT DISTINCT uid FROM users_roles WHERE rid = {$role->rid}")->fetchCol();

    $mtMembers = user_load_multiple($uids);

    // Send a message to each member of the SS_CHANGE_NOTIFY_ROLE role
    $arrTo = array();

    foreach ($mtMembers as $uid => $mtMember) {
        // Do not send to users marked for no notifications
        if (variable_get("tax_no_notify_".$uid, false) !== true
            && strpos($mtMember->mail, '@') !== false
            && strpos($mtMember->mail, '.') !== false
        ) {
            $arrTo[] = $mtMember->mail;
        }
    }
    $strTo = trim(implode(', ', $arrTo), ',');

    // Email Subject
    $params['subject'] = 'CMP: Site-Taxonomy Alteration Notifications';

    // Determin the human-friendly term's vocab-name
    $termVocab = ucwords(str_replace('_', ' ', $term->vocabulary_machine_name));
    $termVocab = trim(str_replace('Taxonomy', '', $termVocab));
    $termVocab = str_replace('Strucutre', 'Structure', $termVocab); // *sigh* the machine name is misspelled -_-
    $termVocab = str_replace(' ', '-', $termVocab);

    // Email message body
    global $user;
    $linkToTerm = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$term->tid."/edit";
    $msg = "This is an automated message to inform you that a taxonomy-change has been applied on the CMP.\n<br/>\n<br/>";
    switch ($change) {
        case SS_CHANGE_DEL:
            $msg .= "A {$termVocab} taxonomy-term by the name of \"{$term->name}\" was deleted from the system by {$user->name}.<br/>";
            break;
        case SS_CHANGE_ADD:
            $msg .= "A new {$termVocab} taxonomy-term (\"{$newValue->name}\") has been added to the system by {$user->name}. <br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_TITLE:
            $msg .= "The {$termVocab} taxonomy-term \"{$oldValue}\", has been renamed to \"{$newValue}\" by {$user->name}. <br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_URL:
            $msg .= "The {$termVocab} taxonomy-term \"{$term->name}\" has had its Friendly-URL field change ";
            $msg .= "from \"{$oldValue}\" to \"{$newValue}\" by {$user->name}.<br/>";
            $msg .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";
            break;
        case SS_CHANGE_ASSET:
            $msg .= "The {$termVocab} taxonomy-term \"<a href=\"{$linkToTerm}\">{$term->name}</a>\" has had its ";
            $msg .= "associated assets changed by {$user->name}.\n<br/>";
            $msg .= "\n<br/>";
            $msg .= "The assigned assets were originally:\n<br/>";
            $msg .= "\n<br/>";
            $assets = getAssetsInSiteStructTerm($oldValue, true, true);
            if (count($assets) === 0) {
                $msg .= "<ul><li><i>empty</i></li></ul>";
            } else {
                $msg .= "<ul>";
                foreach ($assets as $section => $nodes) {
                    $msg .= ucwords($section)." region:";
                    $msg .= "<ol>";
                    if (count($nodes) === 0) {
                        $msg .= '<li><i>empty</i></li>';
                    } else {
                        foreach ($nodes as $node) {
                            $nodeTitle = str_replace(array("\n","\r","\t","\f"), '', $node->title);
                            $msg .= "<li><a href=\"https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit\">{$nodeTitle}</a></li>";
                        }
                    }
                    $msg .= "</ol>";
                    $msg .= "<br/>";
                }
                $msg .= "</ul>";
            }
            $msg .= "\n";
            $msg .= "And now the asset assignment is:\n";
            $assets = getAssetsInSiteStructTerm($newValue, true, true);
            if (count($assets) === 0) {
                $msg .= "<ul><li><i>empty</i></li></ul>";
            } else {
                $msg .= "<ul>";
                foreach ($assets as $section => $nodes) {
                    $msg .= ucwords($section)." region:";
                    $msg .= "<ol>";
                    if (count($nodes) === 0) {
                        $msg .= '<li><i>empty</i></li>';
                    } else {
                        foreach ($nodes as $node) {
                            $nodeTitle = str_replace(array("\n","\r","\t","\f"), '', $node->title);
                            $msg .= "<li><a href=\"https://{$_SERVER['HTTP_HOST']}/node/{$node->nid}/edit\">{$nodeTitle}</a></li>";
                        }
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
    $params['from'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . $from . '>');
    $params['headers']['Reply-To'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . variable_get('site_mail', '') . '>');
    //$params['headers']['Content-Type'] = 'text/html; charset=\"utf-8\";';

    // We check and prevent developer's locals from sending emails here
    // $prodStageDomains = variable_get('udm_prod_domains', array());
    // if ( in_array($_SERVER['HTTP_HOST'], $prodStageDomains) ) {

        /* Based on the first parameter to drupal_mail(), notifyTaxonomyEmpty_mail() will
        be called and used to determine the email-message to send. */
    try {
        $res = drupal_mail(
            'cmp_misc',
            'taxonomy-change',
            trim($strTo),
            language_default(),
            $params
        );
    } catch(Exception $e) {
      watchdog('cmp mailer',__FUNCTION__.' : '.$e->getMessage() );
      return;
    }
    if ($res["send"]) {
        drupal_set_message("Sent taxonomy-update notification emails to: " . $strTo);
    }

    // } else {
    //     // then we are running on someone's local, do NOT send the email
    //     drupal_set_message("Notification email has NOT been sent because this environment is neither STAGE nor PROD.");
    // }
}
