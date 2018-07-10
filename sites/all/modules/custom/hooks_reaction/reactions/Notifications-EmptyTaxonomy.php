<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to notify the PM-Team when a taxonomy-term has had its associated assets
    removed from it.

    [--] TICKET HISTORY [--]

    -------- Forwarded Message --------
    Subject:    Fwd: Empty Page: Learn About Life in the United States
    Date:   Fri, 5 Jun 2015 11:01:06 -0400
    From:   Russell O'Neill - XACC <russell.oneill@gsa.gov>
    To:     Dale Frey <dfrey@ctacorp.com>

    Hey Dale,

    Can you limit who's in the PM team role in Staging so that folks aren't
    confused by these?

    Thank you!
    Russell

*/

define("SS_EMPTY_NOTIFY_ROLE", 'ux member');

/**
 * Implements hook_taxonomy_term_presave
 *
 * Checks if a S.S.-taxonomy-term is no longer assigned any assets, and
 * messages the PM team if so.
 */
hooks_reaction_add("HOOK_taxonomy_term_presave",
    function ($term) {

        // We don't want to fire this functionality on newly created terms [I am assuming]
        if ( empty($term->tid) || taxonomy_term_load($term->tid) === false ) {
            return;
        }

        // We don't want to fire this functionality on non-"Content Page"s
        if (
            empty($term->field_type_of_page_to_generate)
            || empty($term->field_type_of_page_to_generate['und'])
            || empty($term->field_type_of_page_to_generate['und'][0])
            || empty($term->field_type_of_page_to_generate['und'][0]['value'])
            || $term->field_type_of_page_to_generate['und'][0]['value'] !== 'generic-content-page'
        ) {
            return;
        }

        // If there are no assets assigned to this term, them message the PM team
        $assets = getAssetsInSiteStructTerm($term);
        if ( count($assets) === 0 ) {
            informPmTeamOfEmptyPage($term);
        }

    }
);

/**
 * Implements hook_taxonomy_term_delete
 *
 * Checks if an Asset-Topic taxonomy-term is being deleted, and if so, checks
 * to see if this empties any pages - sends a notification when so.
 */
hooks_reaction_add("HOOK_taxonomy_term_delete",
    function ($term) {

        // We only carte about Asset-Topic tax-terms here
        if ( $term->vocabulary_machine_name !== 'asset_topic_taxonomy' ) {
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

        // We only care about pages that will BECOME empty due to this action
        foreach ($loosingPages as $loosingPageTid ) {

            $ssTerm = taxonomy_term_load($loosingPageTid);
            $assetsBefore = getAssetsInSiteStructTerm($ssTerm, false, false);
            $assetsAfter = getAssetsInSiteStructTerm($ssTerm, false, false, array($term->tid));

            // If this page was empty before, or it still has assets with this action...
            if ( count($assetsBefore) == 0 || count($assetsAfter) > 0 ) {
                // ...then we dont care about this page
                unset($loosingPages[$loosingPageTid]);
            }
        }

        // At this point $loosingPages should be a list of pages that are now empty with this action
        foreach ($loosingPages as $loosingPageTid) {

            error_log("S.S.taxonomy-term {$loosingPageTid} no longer has any assets with the "
                ."deletion of Asset-Topic {$term->tid}");

            informPmTeamOfEmptyPage( $term );
        }

    }
);

/**
 * Implements hook_workbench_moderation_transition
 *
 * Checks if a node is being removed from an Asset-Topic, and if/when so,
 * checks to see if the Asset-Topic has become empty.
 */
hooks_reaction_add("HOOK_workbench_moderation_transition",
    function ($node, $previous_state, $new_state) {

        // We don't want to fire this functionality on newly created nodes
        if ( empty($node->nid) || node_load($node->nid) === false ) {
            return;
        }

        // We only want to send a notifications out when a node become published
        if ( $new_state !== 'published' ) {
            return;
        }

        // We don't want to fire this functionality on nodes that don't have an Asset-Topic field
        if ( !isset($node->field_asset_topic_taxonomy) ) {
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
        if ( !empty($nodeBefore->field_asset_topic_taxonomy['und']) ) {
            foreach ($nodeBefore->field_asset_topic_taxonomy['und'] as $tidContainer ) {
                $nodeOldTopics[] = $tidContainer['tid'];
            }
        }

        // Get the Asset topics this node is associated with (after save)
        $nodeNewTopics = array();
        if ( !empty($nodeAfter->field_asset_topic_taxonomy['und']) ) {
            foreach ($nodeAfter->field_asset_topic_taxonomy['und'] as $tidContainer ) {
                $nodeNewTopics[] = $tidContainer['tid'];
            }
        }

        // If no topics are being removed, we are done here
        if ( count($nodeOldTopics) <= count($nodeNewTopics) ) {
            return;
        }

        // Get the topic(s) that just lost this asset
        $loosingTopics = array_diff($nodeOldTopics, $nodeNewTopics);

        // Now get a list of which of these topic(s) have become empty
        foreach ($loosingTopics as $index => $loosingTopicId ) {

            // Get a count of how many assets are assigned to this topic
            // (minus this node)
            $topicContainsAssetCount = db_query("
                SELECT COUNT(entity_id)
                FROM field_data_field_asset_topic_taxonomy
                WHERE
                    entity_type = 'node'
                    AND field_asset_topic_taxonomy_tid = {$loosingTopicId}
                    AND entity_id <> {$node->nid}
            ")->fetchColumn();

            // If this topic still contains assets...
            if ( intval($topicContainsAssetCount) > 0 ) {

                // ...then it is not going to be empty and we dont care about it
                unset($loosingTopics[$index]);
            }

        }

        // If none of the $loosingTopics [Asset-Topics] are empty, then we are fine, bail
        if ( count($loosingTopics) === 0 ) {
            return;
        }

        // At this point, the $loosingTopics array contains topics that are becoming empty
        foreach ($loosingTopics as $loosingTopicId ) {
            error_log("Asset-topic {$loosingTopicId} has become empty with the disassociation of node {$node->nid}");
        }

        // Find all pages (SS-tax-terms) associated with these [now-empty] topics
        $strLoosingTopics = implode(',', $loosingTopics);
        $loosingPages = db_query("
            SELECT entity_id
            FROM field_data_field_asset_topic_taxonomy
            WHERE
                entity_type = 'taxonomy_term'
                AND field_asset_topic_taxonomy_tid IN ({$strLoosingTopics})
        ")->fetchCol();
        $loosingPages = ( $loosingPages === false ? array() : $loosingPages );

        // Filter $loosingPages to find pages that are now empty
        foreach ( $loosingPages as $index => $loosingPageTid ) {

            // Get the assets associated with this given page (assets assoc w/ SS-tax-term $loosingPageTid)
            $ssTerm = taxonomy_term_load($loosingPageTid);
            $assetsOnThisPage = getAssetsInSiteStructTerm($ssTerm, false, false);

            // But ignore a node asset with the node-ID of {$node->nid} since it is being removed
            $killIndex = array_search($node->nid, $assetsOnThisPage);
            if ( $killIndex !== false ) {
                unset($assetsOnThisPage[$killIndex]);
            }

            // If this SS-term still has assets associated with it...
            if ( count($assetsOnThisPage) > 0 ) {

                // ...then we don't care about it anymore.
                unset($loosingPages[$index]);
            }

            unset( $ssTerm ); // free memory
        }

        // At this point, the $loosingPages array contains term-IDs to ChildSite pages that are now empty
        foreach ($loosingPages as $loosingPageTid ) {

            error_log("Site-Structure taxonomy-term {$loosingPageTid} no longer has any assets assigned to "
                ."it, with the disassociation of node {$node->nid}");

            // Dispatch a notification email about this page now being emptied
            $ssTerm = taxonomy_term_load($loosingPageTid);
            informPmTeamOfEmptyPage($ssTerm, $node);
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
    function getAssetsInSiteStructTerm($term, $loadAssets = false, $maintainSections = false, $ignoreTopicIds = array()) {

        $ret = array();

        // Get the top-level-term name for this $term
        if ( empty($term->tid) ) {
            return array();
        }
        $tltName = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid=".$term->tid)->fetchColumn();
        if ( $tltName === false ) {
            return array();
        }

        //if ( $tltName === 'Kids.gov' ) {

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

        //} else {

            /* NON-Kids site logic (lookup based on Asset-Topic assignment)

            // Get all topic-ids this $term references
            $arrTopicIds = array();
            if ( !empty($term->field_asset_topic_taxonomy) && !empty($term->field_asset_topic_taxonomy['und']) ) {
                foreach ( $term->field_asset_topic_taxonomy['und'] as $topicIdContainer ) {
                    if ( !in_array($topicIdContainer['tid'], $ignoreTopicIds) ) {
                        $arrTopicIds[] = $topicIdContainer['tid'];
                    }
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
        }*/

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

function informPmTeamOfEmptyPage($term, $pendingChange = false) {

    // The $term given MUST be a Site-Structure taxonomy-term, if the term is from any other Vocabulary, then this function was called in error
    if ( $term->vocabulary_machine_name !== 'site_strucutre_taxonomy' ) {
        return; // bail
    }

    // Get the role-id for the SS_CHANGE_NOTIFY_ROLE role
    $role = user_role_load_by_name(SS_EMPTY_NOTIFY_ROLE);
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
        if ( strpos($mtMember->name, '@') !== false && strpos($mtMember->name, '.') !== false ) {
            $arrTo[] = $mtMember->name;
        }
    }
    $strTo = trim(implode(',', $arrTo), ',');

    // Determin the human-friendly term's vocab-name
    $termVocab = ucwords( str_replace('_', ' ', $term->vocabulary_machine_name) );
    $termVocab = trim( str_replace('Taxonomy', '', $termVocab) );
    $termVocab = str_replace('Strucutre', 'Structure', $termVocab); // *sigh* the machine name is misspelled -_-
    $termVocab = str_replace(' ', '-', $termVocab);

    // Email Subject
    $params['subject'] = "Empty Page: ".$term->name . _get_env_string();

    // Email message body
    $linkToTerm = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$term->tid."/edit";
    if ( $pendingChange === false ) {
        $params['body'] = 'This is an automated message to inform/remind you that the following '
            .'page is empty: <a href="' . $linkToTerm . '">' . $term->name . '</a> <br/><br/>';
    } else {
        $linkToPending = "https://".$_SERVER['HTTP_HOST']."/node/".$pendingChange->nid."/edit";

        $params['body'] =
            'This is an automated message to inform you that the "<a href="' . $linkToTerm . '">' .
            $term->name . '</a>" page has become empty since its last asset, "'
            .l($pendingChange->title, $linkToPending) . '", has been removed from this page.'
            .'<br/><br/>';
    }
    if ( !empty($term->field_page_intro['und'][0]['value']) ) {
        $params['body'] .= '<b>Summary</b> - ' . $term->field_page_intro['und'][0]['value'] . ' <br/>';
    }
    $params['body'] .= '<b>Last updated on </b>' . date('Y-m-d - H:i').'<br/>';
    $params['body'] .= "<br/>";
    $params['body'] .= "You can edit this {$termVocab} taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a><br/>";

    if ( $pendingChange !== false ) {
        $params['body'] .= "You can edit the Asset being removed from: <a href=\"{$linkToPending}\">{$linkToPending}</a><br/>";
    }

    // Email headers
    $from = variable_get('site_mail', '');
    // $params['from'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . $from . '>');
    // $params['headers']['Reply-To'] = trim(mime_header_encode(variable_get('site_name', "CMP USA.gov")) . ' <' . variable_get('site_mail', '') . '>');
    $params['from'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . $from . '>');
    $params['headers']['Reply-To'] = trim(variable_get('site_name', "CMP USA.gov") . ' <' . variable_get('site_mail', '') . '>');

    // We check and prevent developer's locals from sending emails here
    //$prodStageDomains = variable_get('udm_prod_domains', array());
    //if ( in_array($_SERVER['HTTP_HOST'], $prodStageDomains) ) {

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
            drupal_set_message("Empty-Page notification has been sent to: " . $strTo ._get_env_string());
        }
        //drupal_set_message("Turned off taxonomy notification. It has to be turned on after html asset conversion.");

    //} else {
        // then we are running on someone's local, do NOT send the email
        //drupal_set_message("Notified about Empty page creation. Notification email has NOT been sent because it is NOT STAGE or PROD environment." . $to. _get_env_string());
    //}

}
