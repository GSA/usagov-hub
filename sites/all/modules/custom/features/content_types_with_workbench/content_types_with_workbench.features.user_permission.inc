<?php
/**
 * @file
 * content_types_with_workbench.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function content_types_with_workbench_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'access workbench'.
  $permissions['access workbench'] = array(
    'name' => 'access workbench',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench',
  );

  // Exported permission: 'access workbench access by role'.
  $permissions['access workbench access by role'] = array(
    'name' => 'access workbench access by role',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_access',
  );

  // Exported permission: 'administer workbench'.
  $permissions['administer workbench'] = array(
    'name' => 'administer workbench',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench',
  );

  // Exported permission: 'administer workbench access'.
  $permissions['administer workbench access'] = array(
    'name' => 'administer workbench access',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_access',
  );

  // Exported permission: 'administer workbench moderation'.
  $permissions['administer workbench moderation'] = array(
    'name' => 'administer workbench moderation',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'assign workbench access'.
  $permissions['assign workbench access'] = array(
    'name' => 'assign workbench access',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_access',
  );

  // Exported permission: 'batch update workbench access'.
  $permissions['batch update workbench access'] = array(
    'name' => 'batch update workbench access',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_access',
  );

  // Exported permission: 'bypass workbench moderation'.
  $permissions['bypass workbench moderation'] = array(
    'name' => 'bypass workbench moderation',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'create directory_record_content_type content'.
  $permissions['create directory_record_content_type content'] = array(
    'name' => 'create directory_record_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'create file_content_type content'.
  $permissions['create file_content_type content'] = array(
    'name' => 'create file_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'create html_content_type content'.
  $permissions['create html_content_type content'] = array(
    'name' => 'create html_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'create multimedia_content_type content'.
  $permissions['create multimedia_content_type content'] = array(
    'name' => 'create multimedia_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'create text_content_type content'.
  $permissions['create text_content_type content'] = array(
    'name' => 'create text_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete any directory_record_content_type content'.
  $permissions['delete any directory_record_content_type content'] = array(
    'name' => 'delete any directory_record_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete any file_content_type content'.
  $permissions['delete any file_content_type content'] = array(
    'name' => 'delete any file_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete any html_content_type content'.
  $permissions['delete any html_content_type content'] = array(
    'name' => 'delete any html_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete any multimedia_content_type content'.
  $permissions['delete any multimedia_content_type content'] = array(
    'name' => 'delete any multimedia_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete any text_content_type content'.
  $permissions['delete any text_content_type content'] = array(
    'name' => 'delete any text_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete own directory_record_content_type content'.
  $permissions['delete own directory_record_content_type content'] = array(
    'name' => 'delete own directory_record_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own file_content_type content'.
  $permissions['delete own file_content_type content'] = array(
    'name' => 'delete own file_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own html_content_type content'.
  $permissions['delete own html_content_type content'] = array(
    'name' => 'delete own html_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own multimedia_content_type content'.
  $permissions['delete own multimedia_content_type content'] = array(
    'name' => 'delete own multimedia_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own text_content_type content'.
  $permissions['delete own text_content_type content'] = array(
    'name' => 'delete own text_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit any directory_record_content_type content'.
  $permissions['edit any directory_record_content_type content'] = array(
    'name' => 'edit any directory_record_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit any file_content_type content'.
  $permissions['edit any file_content_type content'] = array(
    'name' => 'edit any file_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit any html_content_type content'.
  $permissions['edit any html_content_type content'] = array(
    'name' => 'edit any html_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit any multimedia_content_type content'.
  $permissions['edit any multimedia_content_type content'] = array(
    'name' => 'edit any multimedia_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit any text_content_type content'.
  $permissions['edit any text_content_type content'] = array(
    'name' => 'edit any text_content_type content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit own directory_record_content_type content'.
  $permissions['edit own directory_record_content_type content'] = array(
    'name' => 'edit own directory_record_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own file_content_type content'.
  $permissions['edit own file_content_type content'] = array(
    'name' => 'edit own file_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own html_content_type content'.
  $permissions['edit own html_content_type content'] = array(
    'name' => 'edit own html_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own multimedia_content_type content'.
  $permissions['edit own multimedia_content_type content'] = array(
    'name' => 'edit own multimedia_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own text_content_type content'.
  $permissions['edit own text_content_type content'] = array(
    'name' => 'edit own text_content_type content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'moderate content from draft to needs_review'.
  $permissions['moderate content from draft to needs_review'] = array(
    'name' => 'moderate content from draft to needs_review',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'moderate content from needs_review to draft'.
  $permissions['moderate content from needs_review to draft'] = array(
    'name' => 'moderate content from needs_review to draft',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'moderate content from needs_review to published'.
  $permissions['moderate content from needs_review to published'] = array(
    'name' => 'moderate content from needs_review to published',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'moderate content from published to expired'.
  $permissions['moderate content from published to expired'] = array(
    'name' => 'moderate content from published to expired',
    'roles' => array(),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'use workbench_media add form'.
  $permissions['use workbench_media add form'] = array(
    'name' => 'use workbench_media add form',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_media',
  );

  // Exported permission: 'use workbench_moderation my drafts tab'.
  $permissions['use workbench_moderation my drafts tab'] = array(
    'name' => 'use workbench_moderation my drafts tab',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'use workbench_moderation needs review tab'.
  $permissions['use workbench_moderation needs review tab'] = array(
    'name' => 'use workbench_moderation needs review tab',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'view all unpublished content'.
  $permissions['view all unpublished content'] = array(
    'name' => 'view all unpublished content',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'view moderation history'.
  $permissions['view moderation history'] = array(
    'name' => 'view moderation history',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'view moderation messages'.
  $permissions['view moderation messages'] = array(
    'name' => 'view moderation messages',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_moderation',
  );

  // Exported permission: 'view workbench access information'.
  $permissions['view workbench access information'] = array(
    'name' => 'view workbench access information',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_access',
  );

  // Exported permission: 'view workbench taxonomy pages'.
  $permissions['view workbench taxonomy pages'] = array(
    'name' => 'view workbench taxonomy pages',
    'roles' => array(
      'administrator' => 'administrator',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'workbench_access',
  );

  return $permissions;
}
