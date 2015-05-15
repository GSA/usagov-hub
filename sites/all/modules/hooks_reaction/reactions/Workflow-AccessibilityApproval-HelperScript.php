<?php /*

    [--] PURPOSE [--]
    
        BACKGROUND INFORMATION:
            Only for Multimedia-Assets, the workflow is supposed to be different such that;
            Instead of a workflow of: Draft ➞ Needs Approval ➞ Published
            MultiMedia-Assets need to follow: Draft ➞ Needs Approval ➞ Needs Accessibility Approval  ➞ Published

        WHY THIS SCRIPT IS NEEDED:
            The configurations in Drupal get us mostly there, but does not supply a way for us to stop the Editors from 
            being able to move Assets (nodes) from the "Needs Approval" state to the "Publish[ing]" state FOR ONLY MULTIMEDIA
            NODES.
            Hence why we need some code to remove these options from some forms, in this very specific situation.

    [--] TICKET HISTORY [--]

        2015-05-14 - Created to resolve ticket: usagov-100367 Would like to modify workflow so that accessibility team [...]
        
*/

/**
 * Implements hook_form_FORM_ID_alter() for altering the forms:
 *     multimedia_content_type_node_form
 *     text_content_type_node_form
 *     html_content_type_node_form
 *
 * Alters the form on pages like: <site>/node/186774/edit
 *
 * #1
 * The non-Accessibility-Team members should not be abel to move a Multi-Media 
 * node from the "Needs Approval" state to the "Published" state, since that 
 * would skip over the "Needs Accessibility Approval" state.
 *
 * #2
 * ONLY MultiMedia Assets should have the ability to be moved into the "Needs Accessibility Approval" state.
 *
 */
hooks_reaction_add(
    array(
        "HOOK_form_multimedia_content_type_node_form_alter",
        "HOOK_form_text_content_type_node_form_alter",
        "HOOK_form_html_content_type_node_form_alter",
    ),
    function (&$form, &$form_state) {

        // We really only cares about non-Accessibility-Team members
        if ( !in_array('accessibility team', $GLOBALS['user']->roles) ) {
            
            // If this is a MultiMedia node...
            if ( $form['#node']->type === 'multimedia_content_type' ) {
                
                // and it is in the "Needs Approval" state
                if ( $form['#node']->workbench_moderation['current']->state === 'needs_review' ) {

                    /* Remove the Publishing option from the "Revision Information" => "Moderation State" drop-down since 
                    we dont want to let non-Accessibility-Team members to be abel to skip over "Needs Accessibility Approval" */
                    unset( $form['revision_information']['workbench_moderation_state_new']['#options']['scheduled_for_publication'] );

                }

            } else { /*  ELSE (this is NOT MultiMedia node) */

                /* Remove the "Needs Accessibility Approval" option, since this "Needs Accessibility Approval" step 
                is meant ONLY for MultiMedia-Assets */
                unset( $form['revision_information']['workbench_moderation_state_new']['#options']['needs_acc_approval'] );

            }
        }
    }
);

/**
 * Implements hook_form_FORM_ID_alter() for altering the form: workbench_moderation_moderate_form
 *
 * Alters the form on pages like: <site>/node/186774/moderation
 * Also alters the form on pages like: <site>/node/186774 or <site>/content/american-presidency
 *
 * #1
 * The non-Accessibility-Team members should not be abel to move a Multi-Media 
 * node from the "Needs Approval" state to the "Published" state, since that 
 * would skip over the "Needs Accessibility Approval" state.
 *
 * #2
 * ONLY MultiMedia Assets should have the ability to be moved into the "Needs Accessibility Approval" state.
 *
 */
hooks_reaction_add("form_workbench_moderation_moderate_form_alter",
    function (&$form, &$form_state) {
        
        // This helper function really only cares about non-Accessibility-Team members
        if ( !in_array('accessibility team', $GLOBALS['user']->roles) ) {

            // If this is a MultiMedia node...
            if ( $form['node']['#value']->type === 'multimedia_content_type' ) {
                
                // and it is in the "Needs Approval" state
                if ( $form['node']['#value']->workbench_moderation['current']->state === 'needs_review' ) {

                    /* Remove the Publishing option from the "Set moderation state" drop-down since 
                    we dont want to let non-Accessibility-Team members to be abel to skip 
                    over "Needs Accessibility Approval" */
                    unset($form['state']['#options']['scheduled_for_publication']);
                }

            } else { /*  ELSE (this is NOT MultiMedia node) */

                /* Remove the "Needs Accessibility Approval" option, since this 
                "Needs Accessibility Approval" step is meant ONLY for MultiMedia-Assets */
                unset($form['state']['#options']['needs_acc_approval']);
            }

        }

    }
);

/**
 * Implements THEME_links via HOOK_preprocess_HOOK().
 *
 * Alters the "Set moderation state" View-column on pages like: <site>/admin/workbench/needs-approval
 *
 * #1
 * The non-Accessibility-Team members should not be abel to move a Multi-Media 
 * node from the "Needs Approval" state to the "Published" state, since that 
 * would skip over the "Needs Accessibility Approval" state.
 *
 * #2
 * ONLY MultiMedia Assets should have the ability to be moved into the "Needs Accessibility Approval" state.
 *
 */
hooks_reaction_add("preprocess_links",
    function (&$variables) {

        // This helper function really only cares about non-Accessibility-Team members
        if ( in_array('accessibility team', $GLOBALS['user']->roles) ) {
            return;
        }

        // If this theme('links', [...]) call actually has links in it...
        if ( !empty($variables['links']) && is_array($variables['links']) ) {

            // Loop through each link in this list...
            foreach ($variables['links'] as $linkIndex => $linkInfo ) {

                // If we can get the node-id (based on the link-target)
                if ( $nid = intval( strtok(strtok($linkInfo['href'], '/')) ) ) {

                    $n = node_load($nid);

                    // If this node is a MultiMedia node, currently in the "Needs Approval" state...
                    if ( $n->type === 'multimedia_content_type' ) {

                        if ( $n->workbench_moderation['current']->state === 'needs_review' ) {

                            // If this link will move a node into the Publishing [workflow] state
                            if (
                                strpos($linkInfo['title'], 'Ready For Publication') !== false
                                && strpos($linkInfo['href'], '/change-state/scheduled_for_publication') !== false
                            ) {

                                /*...then we will want to remove this Publishing link for this 
                                non-Accessibility-Team members */
                                unset($variables['links'][$linkIndex]);
                            }
                        }

                    } else { /*  ELSE (this is NOT MultiMedia node) */

                        // If this link will move a node into the "Accessibility Approval" [workflow] state
                        if (
                            strpos($linkInfo['title'], 'Needs Accessibility Approval') !== false
                            && strpos($linkInfo['href'], '/change-state/needs_acc_approval') !== false
                        ) {

                            /*...then we will want to remove this "[Set] Accessibility Approval" link 
                            for this node that isn't even a Multimedia-Asset */
                            unset($variables['links'][$linkIndex]);
                        }
                    }

                }
            }
        }

        // Assuming we may have removed items from this link-list, reset the array-indexes
        $variables['links'] = array_values($variables['links']);

    }
);