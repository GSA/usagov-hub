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
            foreach ( $term->field_asset_topic_taxonomy['und'] as $topicIdContainer ) {
                $arrTopicIds[] = $topicIdContainer['tid'];
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

function informPmTeamOfEmptyPage($term) {

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

    // Email Subject
    $params['subject'] = "Empty Page: ".$term->name;

    // Email message body
    $linkToTerm = $linkToTerm = "https://".$_SERVER['HTTP_HOST']."/taxonomy/term/".$term->tid."/edit";
    $params['body'] = 'This is an automated message to inform/remind you that the following '
        .'page is empty: <a href="' . $linkToTerm . '">' . $term->name . '</a> <br/>';
    if ( !empty($term->field_page_intro['und'][0]['value']) ) {
        $params['body'] .= '<b>Summary</b> - ' . $term->field_page_intro['und'][0]['value'] . ' <br/>';
    }
    $params['body'] .= '<b>Last updated on </b>' . date('Y-m-d - H:i').'<br/>';
    $params['body'] .= "<br/>";
    $params['body'] .= "You can edit this taxonomy-term from: <a href=\"{$linkToTerm}\">{$linkToTerm}</a>";

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
            drupal_set_message("Notified about Empty page creation. Notification email has been sent to: " . $strTo);
        }

    } else {
        // then we are running on someone's local, do NOT send the email
        drupal_set_message("Notified about Empty page creation. Notification email has NOT been sent because it is NOT STAGE or PROD environment." . $to);
    }

}