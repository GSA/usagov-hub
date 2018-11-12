<?php /*

    [--] PURPOSE [--]

    @TODO

    [--] TECHNICAL NOTES [--]

    @TODO

*/

$GLOBALS['DirRecordHelperEnTogg_updateRefNid'] = null;
$GLOBALS['DirRecordHelperEnTogg_noPostProc'] = false;
$GLOBALS['DirRecordHelperEnTogg_ignoreNids'] = array();

hooks_reaction_add('HOOK_node_postsave',
    function ($node) {

        // We only care about Text-Asset nodes here
        if ( $node->type !== 'directory_record_content_type' ) {
            return;
        }

        // This is needed in order to prevent infinite loops (see later code)
        if ( $GLOBALS['DirRecordHelperEnTogg_noPostProc'] ) {
            return;
        }
        if ( in_array(intval($node->nid), $GLOBALS['DirRecordHelperEnTogg_ignoreNids']) ) {
            return;
        }

        $nodeNew = $node;
        $nodeOld = ( empty($node->original) ? false : $node->original );

        if (!empty($nodeNew->field_english_toggle_en['und'][0]['target_id']) && $nodeNew->field_english_toggle_en['und'][0]['target_id'] != $nodeOld->field_english_toggle_en['und'][0]['target_id']) {

            // we found referenced node
            $nodeRef = node_load($nodeNew->field_english_toggle_en['und'][0]['target_id']);
            $nodeRef->field_spanish_toggle_en['und'][0]['target_id'] = $nodeNew->nid;

            if (!empty($nodeRef)) {
                // And remember that we will trigger this same HOOK_node_presave with node_save()
                // So we'll set a global No-Process flag to prevent infinite loops
                $GLOBALS['DirRecordHelperEnTogg_noPostProc'] = true;
                $GLOBALS['DirRecordHelperEnTogg_ignoreNids'][] = intval($nodeRef->nid);
                node_save($nodeRef);
                $GLOBALS['DirRecordHelperEnTogg_noPostProc'] = false;

                drupal_set_message(
                    "Note: Since you have updated \"{$node->title}\" asset, referenced toggle field on \"{$nodeRef->title}\" has been updated",
                    "warning",
                    FALSE
                );
            }
        }

    } // End Hook: node_presave

); // End hooks_reaction_add() call
