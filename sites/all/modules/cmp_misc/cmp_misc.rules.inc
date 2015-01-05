<?php

/**
 * Implements hook_rules_file_info().
 */
function cmp_misc_rules_file_info() {
  $items = array();
  $items[] = 'cmp_misc.rules';

  return $items;
}

/**
 * Implements hook_rules_condition_info().
 */
function cmp_misc_rules_condition_info() {
  $items = array();

  $items['content_has_ever_been_published'] = array(
    'group' => t("Node"),
    'label' => t("Content has ever been published"),
    'base' => 'cmp_misc_rules_condition_content_has_ever_been_published',
    'parameter' => array(
      'node' => array('type' => 'node', 'label' => t("Content")),
    ),
    'access callback' => 'rules_node_integration_access',
  );

  return $items;
}

/**
 * Condition: Check if the content has ever been published.
 *
 * @param $node
 *   A node object
 *
 * @return
 *   TRUE/FALSE depending on if the content has ever been in a published state.
 */
function cmp_misc_rules_condition_content_has_ever_been_published($node) {
  if (!is_object($node)) {
    return FALSE;
  }
  return cmp_misc_node_ever_published();
}

