<?php /*

    [--] PURPOSE [--]

    @TODO

    [--] TECHNICAL NOTES [--]

    @TODO

*/

$GLOBALS['DirRecordHelperParent_updateRefNid'] = null;
$GLOBALS['DirRecordHelperParent_noPostProc'] = false;
$GLOBALS['DirRecordHelperParent_ignoreNids'] = array();

hooks_reaction_add('HOOK_node_postsave',
    function ($node) {

        // We only care about Text-Asset nodes here
        if ( $node->type !== 'directory_record_content_type' ) {
            return;
        }

        // This is needed in order to prevent infinite loops (see later code)
        if ( $GLOBALS['DirRecordHelperParent_noPostProc'] ) {
            return;
        }
        if ( in_array(intval($node->nid), $GLOBALS['DirRecordHelperParent_ignoreNids']) ) {
            return;
        }

        $nodeNew = $node;
        $nodeOld = ( empty($node->original) ? false : $node->original );

        if (!empty($nodeNew->field_parent_record_en['und'][0]['target_id']) && $nodeNew->field_parent_record_en['und'][0]['target_id'] != $nodeOld->field_parent_record_en['und'][0]['target_id']) {

            // we found referenced node
            $nodeRef = node_load($nodeNew->field_parent_record_en['und'][0]['target_id']);


            if (!empty($nodeRef)) {
                $found = false;

                if (isset($nodeRef->field_child_records_en['und'])) {
                    foreach ($nodeRef->field_child_records_en['und'] as $nchild) {
                        if ($nchild['target_id'] == $nodeNew->nid) {
                            $found = true;
                            break;
                        }
                    }
                    $ind = count($nodeRef->field_child_records_en['und'])+1;
                }
                else{
                    $ind =0;
                }

                if (!$found){

                    $nodeRef->field_child_records_en['und'][$ind]['target_id'] = $nodeNew->nid;
                }
                // And remember that we will trigger this same HOOK_node_presave with node_save()
                // So we'll set a global No-Process flag to prevent infinite loops
                $GLOBALS['DirRecordHelperParent_noPostProc'] = true;
                $GLOBALS['DirRecordHelperParent_ignoreNids'][] = intval($nodeRef->nid);
                node_save($nodeRef);
                $GLOBALS['DirRecordHelperParent_noPostProc'] = false;

                drupal_set_message(
                    "Note: Since you have updated \"{$node->title}\" asset, referenced toggle field on \"{$nodeRef->title}\" has been updated",
                    "warning",
                    FALSE
                );
            }
        }

    } // End Hook: node_presave

); // End hooks_reaction_add() call
