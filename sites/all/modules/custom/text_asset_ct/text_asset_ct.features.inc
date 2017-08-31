<?php
/**
 * @file
 * text_asset_ct.features.inc
 */

/**
 * Implements hook_node_info().
 */
function text_asset_ct_node_info() {
  $items = array(
    'text_asset' => array(
      'name' => t('Text Asset'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
