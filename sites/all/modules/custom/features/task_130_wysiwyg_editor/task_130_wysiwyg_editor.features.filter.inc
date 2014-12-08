<?php
/**
 * @file
 * task_130_wysiwyg_editor.features.filter.inc
 */

/**
 * Implements hook_filter_default_formats().
 */
function task_130_wysiwyg_editor_filter_default_formats() {
  $formats = array();

  // Exported format: Standard Editor.
  $formats['standard_editor'] = array(
    'format' => 'standard_editor',
    'name' => 'Standard Editor',
    'cache' => 1,
    'status' => 1,
    'weight' => 0,
    'filters' => array(),
  );

  return $formats;
}
