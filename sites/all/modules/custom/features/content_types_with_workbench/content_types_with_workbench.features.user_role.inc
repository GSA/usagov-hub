<?php
/**
 * @file
 * content_types_with_workbench.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function content_types_with_workbench_user_default_roles() {
  $roles = array();

  // Exported role: content author.
  $roles['content author'] = array(
    'name' => 'content author',
    'weight' => 6,
  );

  // Exported role: editor.
  $roles['editor'] = array(
    'name' => 'editor',
    'weight' => 3,
  );

  // Exported role: marketing team.
  $roles['marketing team'] = array(
    'name' => 'marketing team',
    'weight' => 5,
  );

  return $roles;
}
