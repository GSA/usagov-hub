<?php

/**
 * Implements hook_rules_file_info().
 */
function cmp_soft_delete_rules_file_info() {
  $items = array();
  $items[] = 'cmp_soft_delete.rules';

  return $items;
}

/**
 * Implements hook_rules_condition_info().
 */
function cmp_soft_delete_rules_condition_info() {
  $items = array();

  $items['content_is_soft_deleted'] = array(
    'group' => t("Node"),
    'label' => t("Content is soft-deleted"),
    'base' => 'cmp_soft_delete_rules_condition_content_is_soft_deleted',
    'parameter' => array(
      'node' => array('type' => 'node', 'label' => t("Content")),
    ),
    'access callback' => 'rules_node_integration_access',
  );

  $items['content_requested_soft_delete'] = array(
    'group' => t("Node"),
    'label' => t("Soft Delete requested for this Content"),
    'base' => 'cmp_soft_delete_rules_condition_content_requested_soft_delete',
    'parameter' => array(
      'node' => array('type' => 'node', 'label' => t("Content")),
    ),
    'access callback' => 'rules_node_integration_access',
  );

  return $items;
}

/**
 * Condition: Check if the content is currently soft deleted.
 *
 * @param $node
 *   A node object
 *
 * @return
 *   TRUE/FALSE depending on if the content is currently soft deleted.
 */
function cmp_soft_delete_rules_condition_content_is_soft_deleted($node)
{
  if (!is_object($node)) {
    return FALSE;
  }

  $del = _cmp_soft_delete_get_node_stat($node->nid);
  if ( !empty($del['deletion_state']) && $del['deletion_state'] == 'soft' )
  {
      return TRUE;
  }

  return FALSE;
}

/**
 * Condition: Check if the content has requested a soft delete.
 *
 * @param $node
 *   A node object
 *
 * @return
 *   TRUE/FALSE depending on if the content has requested a soft delete.
 */
function cmp_soft_delete_rules_condition_content_requested_soft_delete($node)
{
  if (!is_object($node)) {
    return FALSE;
  }

  $del = _cmp_soft_delete_get_node_stat($node->nid);
  if ( !empty($del['deletion_state']) && $del['deletion_state'] == 'requested' )
  {
      return TRUE;
  }

  return FALSE;
}
