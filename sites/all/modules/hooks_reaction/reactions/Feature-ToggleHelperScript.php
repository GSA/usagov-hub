<?php /*

    [--] PURPOSE [--]
    
    @TODO

    [--] TECHNICAL NOTES [--]

    @TODO

*/

$GLOBALS['FeatureToggHelper_updateRefNid'] = null;
$GLOBALS['FeatureToggHelper_noPostProc'] = false;
$GLOBALS['FeatureToggHelper_ignoreNids'] = array();


hooks_reaction_add('form_text_content_type_node_form_alter',
    function (&$form, &$form_state, $form_id) {

        //drupal_add_css('.field-name-field-feature-toggle { display: none; }', 'inline');

    }
);

hooks_reaction_add('HOOK_node_presave',
    function ($node) {

        // We only care about Text-Asset nodes here
        if ( $node->type !== 'text_content_type' ) {
            return;
        }

        // This is needed in order to prevent infinite loops (see later code)
        if ( $GLOBALS['FeatureToggHelper_noPostProc'] ) {
            return;
        }
        if ( in_array(intval($node->nid), $GLOBALS['FeatureToggHelper_ignoreNids']) ) {
            return;
        }

        $nodeNew = $node;
        $nodeOld = ( empty($node->original) ? false : $node->original );

        // If this $node's toggle-reference is unchanged in this operation, then there is nothing to do here
        if ( $nodeOld !== false && _featureToggleGetTargetReference($nodeNew) ===  _featureToggleGetTargetReference($nodeOld) ) {
            return;
        }

        // If this $node is not referencing a toggle...
        $targetRelationNodeId = _featureToggleGetTargetReference($nodeNew);
        if ( $targetRelationNodeId == false ) {

            // Erase the hidden field_feature_toggle field
            $node->field_feature_toggle = array();
            error_log("ToggleHelperScript: Toggle-Ref is empty, emptying the field_feature_toggle field for node: ".$node->title);

            // ....and if it previously was....
            if ( $nodeOld !== false && _featureToggleGetTargetReference($nodeOld) !== false ) {
                if ( $GLOBALS['FeatureToggHelper_noPostProc'] === false ) {

                    // then we should create a new revision of that node with the relation removed
                    $nodeRef = _featureToggle_nodeLoadRecent( _featureToggleGetTargetReference($nodeOld) );
                    unset($nodeRef->vid);
                    $nodeRef->revision = 1; // save a new revision of this $nodeRef

                    // unless that node is no longer pointing to this one (bug killer) - this should never really be the case though
                    $refRefNid = _featureToggleGetTargetReference($nodeRef);
                    if ( $refRefNid !== intval($node->nid) ) {

                        error_log("ToggleHelperScript: Odd... {$refRefNid} !== {$node->nid}");

                    } else {

                        // While savng it in the needs_review (workflow) state 
                        $nodeRef->workbench_moderation_state_new = 'needs_review';

                        // With this #ref pointing to nothing
                        $nodeRef->field_feature_toggle_ref = array();
                        $nodeRef->field_feature_toggle = array();

                        // And remember that we will trigger this same HOOK_node_presave with node_save()
                        // So we'll set a global No-Process flag to prevent infinite loops
                        error_log("ToggleHelperScript: Emptying the field_feature_toggle field in new revision for node: ".$nodeRef->title);
                        $GLOBALS['FeatureToggHelper_noPostProc'] = true;
                        $GLOBALS['FeatureToggHelper_ignoreNids'][] = intval($nodeRef->nid);
                        node_save($nodeRef);
                        $GLOBALS['FeatureToggHelper_noPostProc'] = false;

                        drupal_set_message(
                            "Note: Since you have removed the relation to \"{$nodeRef->title}\", a new revision "
                                ."of \"{$nodeRef->title}\" has been created, in the <i>Needs Approval</i> state "
                                ."with the relation to \"{$node->title}\" removed.",
                            "warning",
                            FALSE
                        );
                    }

                }
            }

            // And now we are done here
            return;
        }

        // We now will want to determine what data we are going to write into the $node->field_feature_toggle field
        // The data to write there will be the referenced-nodes's title
        $refNodeTitleValue = db_query("SELECT title FROM node WHERE nid = {$targetRelationNodeId}")->fetchColumn();

        // Update the field_feature_toggle field as per the entity-reference
        error_log("ToggleHelperScript: Setting Toggle-Text to \"{$refNodeTitleValue}\" for node: ".$node->title);
        $node->field_feature_toggle = array(
            'und' => array(
                0 => array(
                    'value' => $refNodeTitleValue,
                    'format' => null,
                    'safe_value' => $refNodeTitleValue,
                )
            )
        );

        // Now this this $node points to #ref, we want a bidirectional relation where #ref points back to $node
        $nodeRef = _featureToggle_nodeLoadRecent($targetRelationNodeId);

        // So lets save a new revision of this $nodeRef
        unset($nodeRef->vid);
        $nodeRef->revision = 1;

        // While savng it in the needs_review (workflow) state 
        $nodeRef->workbench_moderation_state_new = 'needs_review';

        // With this #ref pointing back to this $node
        error_log("ToggleHelperScript: Setting Toggle-Ref to {$node->nid} in new revision for node: ".$nodeRef->title);
        $nodeRef->field_feature_toggle_ref = array(
            'und' => array(
                0 => array(
                    'target_id' => $node->nid
                )
            )
        );
        $nodeRef->field_feature_toggle = array(
            'und' => array(
                0 => array(
                    'value' => $node->title,
                    'format' => null,
                    'safe_value' => $node->title,
                )
            )
        );

        // And remember that we will trigger this same HOOK_node_presave with node_save()
        // So we'll set a global No-Process flag to prevent infinite loops
        $GLOBALS['FeatureToggHelper_noPostProc'] = true;
        $GLOBALS['FeatureToggHelper_ignoreNids'][] = intval($nodeRef->nid);
        node_save($nodeRef);
        $GLOBALS['FeatureToggHelper_noPostProc'] = false;

        drupal_set_message(
            "Note: Since you have added a relation to \"{$nodeRef->title}\", a new revision "
                ."of \"{$nodeRef->title}\" has been created, in the <i>Needs Approval</i> state "
                ."with the relation to \"{$node->title}\" added.",
            "warning",
            FALSE
        );

    } // End Hook: node_presave

); // End hooks_reaction_add() call

function _featureToggleGetTargetReference($node) {

    if ( $node === false ) {
        error_log('Unexpected input for _featureToggleGetTargetReference()');
        return false;
    }

    // Load the node if we were given an nid
    if ( !is_object($node) && is_numeric($node) ) {
        $node = _featureToggle_nodeLoadRecent($node);
    }

    if ( empty($node->field_feature_toggle_ref['und']) ) {
        return false;
    }

    if ( empty($node->field_feature_toggle_ref['und']) ) {
        return false;
    }

    if ( empty($node->field_feature_toggle_ref['und'][0]) ) {
        return false;
    }

    if ( empty($node->field_feature_toggle_ref['und'][0]['target_id']) ) {
        return false;
    }

    $ret = intval( $node->field_feature_toggle_ref['und'][0]['target_id'] );
    return ( $ret === 0 ? false : $ret );

}

/* Loads the most recent revision of a node, regardless of weather the most 
recent revision is published or not. */
function _featureToggle_nodeLoadRecent($nid) {

    $vid = db_query("SELECT vid FROM node_revision WHERE nid={$nid} ORDER BY vid DESC LIMIT 1")->fetchColumn();
    return node_load($nid, $vid);

}