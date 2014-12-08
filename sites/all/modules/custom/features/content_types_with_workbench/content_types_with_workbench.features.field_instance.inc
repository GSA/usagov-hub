<?php
/**
 * @file
 * content_types_with_workbench.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function content_types_with_workbench_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'node-directory_record_content_type-field_alpha_order_name'
  $field_instances['node-directory_record_content_type-field_alpha_order_name'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Name of agency used for alphabetization purposes',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 12,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_alpha_order_name',
    'label' => 'Alpha-order-name',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 44,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_city'
  $field_instances['node-directory_record_content_type-field_city'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'City for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 21,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_city',
    'label' => 'City',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 53,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_comments'
  $field_instances['node-directory_record_content_type-field_comments'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 9,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_comments',
    'label' => 'Comments',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 41,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_contact_links'
  $field_instances['node-directory_record_content_type-field_contact_links'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Links that can be used to contact the organization represented by the directory record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 33,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_contact_links',
    'label' => 'Contact links',
    'required' => 0,
    'settings' => array(
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 65,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_description'
  $field_instances['node-directory_record_content_type-field_description'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'A brief description about the content item asset',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_description',
    'label' => 'Description',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 33,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_directory_type'
  $field_instances['node-directory_record_content_type-field_directory_type'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'What type of directory record is the content item',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 14,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_directory_type',
    'label' => 'Directory type',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 46,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_donated_money'
  $field_instances['node-directory_record_content_type-field_donated_money'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Whether the entity represented by the directory record donated money to help fund the Consumer Action Handbook and/or the Guia',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 31,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_donated_money',
    'label' => 'Donated money',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 63,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_english_toggle'
  $field_instances['node-directory_record_content_type-field_english_toggle'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'For Spanish records, the directory record representing the same entity in English.',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 38,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_english_toggle',
    'label' => 'English toggle',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 70,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_english_translation_name'
  $field_instances['node-directory_record_content_type-field_english_translation_name'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'For Spanish directory records, the English name of the record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 13,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_english_translation_name',
    'label' => 'English Translation Name',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 45,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_for_use_by_'
  $field_instances['node-directory_record_content_type-field_for_use_by_'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 10,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_for_use_by_',
    'label' => 'For use by:',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 42,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_government_branch'
  $field_instances['node-directory_record_content_type-field_government_branch'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'What branch of government does the record belong too',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 30,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_government_branch',
    'label' => 'Government branch',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 62,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_group_by'
  $field_instances['node-directory_record_content_type-field_group_by'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'How to group the record in certain presentation outputs.',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 15,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_group_by',
    'label' => 'Group by',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 47,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_in_person_links'
  $field_instances['node-directory_record_content_type-field_in_person_links'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Links that can be used to contact the organization represented by the directory record in person',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 34,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_in_person_links',
    'label' => 'In-person links',
    'required' => 0,
    'settings' => array(
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 66,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_language'
  $field_instances['node-directory_record_content_type-field_language'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 7,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_language',
    'label' => 'Language',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 39,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_notify_marketing_team'
  $field_instances['node-directory_record_content_type-field_notify_marketing_team'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 8,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_notify_marketing_team',
    'label' => 'Notify Marketing Team',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 40,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_override_editor_approval'
  $field_instances['node-directory_record_content_type-field_override_editor_approval'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 11,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_override_editor_approval',
    'label' => 'Override editor approval',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 43,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_phone_number'
  $field_instances['node-directory_record_content_type-field_phone_number'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Phone numbers for the record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 25,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_phone_number',
    'label' => 'Phone number',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 57,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_scoap_member'
  $field_instances['node-directory_record_content_type-field_scoap_member'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Whether the entity represented by the directory record is a member of SOCAP',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 32,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_scoap_member',
    'label' => 'SCOAP member',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 64,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_see_also'
  $field_instances['node-directory_record_content_type-field_see_also'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Related record names',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 16,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_see_also',
    'label' => 'See also',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 48,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_show_on_az_index'
  $field_instances['node-directory_record_content_type-field_show_on_az_index'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Whether the directory record should be shown on A-Z indices',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 17,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_show_on_az_index',
    'label' => 'Show on AZ Index',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 49,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_sms_services'
  $field_instances['node-directory_record_content_type-field_sms_services'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Text services offered by the directory record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 28,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_sms_services',
    'label' => 'SMS services',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 60,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_spanish_toggle'
  $field_instances['node-directory_record_content_type-field_spanish_toggle'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'For English records, the directory record representing the same entity in Spanish.',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 39,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_spanish_toggle',
    'label' => 'Spanish toggle',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 71,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_state'
  $field_instances['node-directory_record_content_type-field_state'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'State for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 22,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_state',
    'label' => 'State',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 54,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_street_1'
  $field_instances['node-directory_record_content_type-field_street_1'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'First street address for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 19,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_street_1',
    'label' => 'Street 1',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 51,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_street_2'
  $field_instances['node-directory_record_content_type-field_street_2'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Second street address for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 20,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_street_2',
    'label' => 'Street 2',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 52,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_subdivision'
  $field_instances['node-directory_record_content_type-field_subdivision'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Subdivision for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 18,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_subdivision',
    'label' => 'Subdivision',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 50,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_synonym'
  $field_instances['node-directory_record_content_type-field_synonym'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 29,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_synonym',
    'label' => 'Synonym',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 61,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_tags'
  $field_instances['node-directory_record_content_type-field_tags'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Main keywords related to the content item ',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 3,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 35,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_taxonomy'
  $field_instances['node-directory_record_content_type-field_taxonomy'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Taxonomy location',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 4,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 36,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_title_long'
  $field_instances['node-directory_record_content_type-field_title_long'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The long version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_long',
    'label' => 'Title, long',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 31,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_title_short'
  $field_instances['node-directory_record_content_type-field_title_short'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The short version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_short',
    'label' => 'Title, short',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 32,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_toll_free_number'
  $field_instances['node-directory_record_content_type-field_toll_free_number'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Toll-free Phone numbers for the record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 26,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_toll_free_number',
    'label' => 'Toll free number',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 58,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_tty_number'
  $field_instances['node-directory_record_content_type-field_tty_number'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'TTY numbers for the record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 27,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tty_number',
    'label' => 'TTY number',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 59,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_website_links'
  $field_instances['node-directory_record_content_type-field_website_links'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Homepage links for the organization represented by the directory record',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 35,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_website_links',
    'label' => 'Website links',
    'required' => 0,
    'settings' => array(
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 67,
    ),
  );

  // Exported field_instance: 'node-directory_record_content_type-field_zip'
  $field_instances['node-directory_record_content_type-field_zip'] = array(
    'bundle' => 'directory_record_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Zip code for the record’s address',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 23,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_zip',
    'label' => 'Zip',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 55,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_comments'
  $field_instances['node-file_content_type-field_comments'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 9,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_comments',
    'label' => 'Comments',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 41,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_description'
  $field_instances['node-file_content_type-field_description'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'A brief description about the content item asset',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_description',
    'label' => 'Description',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 33,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_file'
  $field_instances['node-file_content_type-field_file'] = array(
    'bundle' => 'file_content_type',
    'deleted' => 0,
    'description' => 'A binary file, such as a PDF document or a Microsoft Word file',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'file',
        'settings' => array(),
        'type' => 'file_default',
        'weight' => 12,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_file',
    'label' => 'File',
    'required' => 1,
    'settings' => array(
      'description_field' => 0,
      'file_directory' => '',
      'file_extensions' => 'txt',
      'max_filesize' => '',
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'file',
      'settings' => array(
        'progress_indicator' => 'throbber',
      ),
      'type' => 'file_generic',
      'weight' => 45,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_file_type'
  $field_instances['node-file_content_type-field_file_type'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'What type of file does the content item represent',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 13,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_file_type',
    'label' => 'File Type',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 46,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_for_use_by_'
  $field_instances['node-file_content_type-field_for_use_by_'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 10,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_for_use_by_',
    'label' => 'For use by:',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 42,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_language'
  $field_instances['node-file_content_type-field_language'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 7,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_language',
    'label' => 'Language',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 39,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_notify_marketing_team'
  $field_instances['node-file_content_type-field_notify_marketing_team'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 8,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_notify_marketing_team',
    'label' => 'Notify Marketing Team',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 40,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_override_editor_approval'
  $field_instances['node-file_content_type-field_override_editor_approval'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 11,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_override_editor_approval',
    'label' => 'Override editor approval',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 43,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_tags'
  $field_instances['node-file_content_type-field_tags'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Main keywords related to the content item ',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 3,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 35,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_taxonomy'
  $field_instances['node-file_content_type-field_taxonomy'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Taxonomy location',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 4,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 36,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_title_long'
  $field_instances['node-file_content_type-field_title_long'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The long version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_long',
    'label' => 'Title, long',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 31,
    ),
  );

  // Exported field_instance: 'node-file_content_type-field_title_short'
  $field_instances['node-file_content_type-field_title_short'] = array(
    'bundle' => 'file_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The short version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_short',
    'label' => 'Title, short',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 32,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_comments'
  $field_instances['node-html_content_type-field_comments'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 9,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_comments',
    'label' => 'Comments',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 41,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_description'
  $field_instances['node-html_content_type-field_description'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'A brief description about the content item asset',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_description',
    'label' => 'Description',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 33,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_for_use_by_'
  $field_instances['node-html_content_type-field_for_use_by_'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 10,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_for_use_by_',
    'label' => 'For use by:',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 42,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_html'
  $field_instances['node-html_content_type-field_html'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The HTML code that makes up the content item',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 12,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_html',
    'label' => 'HTML',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 44,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_language'
  $field_instances['node-html_content_type-field_language'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 7,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_language',
    'label' => 'Language',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 39,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_notify_marketing_team'
  $field_instances['node-html_content_type-field_notify_marketing_team'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 8,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_notify_marketing_team',
    'label' => 'Notify Marketing Team',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 40,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_override_editor_approval'
  $field_instances['node-html_content_type-field_override_editor_approval'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 11,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_override_editor_approval',
    'label' => 'Override editor approval',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 43,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_tags'
  $field_instances['node-html_content_type-field_tags'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Main keywords related to the content item ',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 3,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 35,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_taxonomy'
  $field_instances['node-html_content_type-field_taxonomy'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Taxonomy location',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 4,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 36,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_title_long'
  $field_instances['node-html_content_type-field_title_long'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The long version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_long',
    'label' => 'Title, long',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 31,
    ),
  );

  // Exported field_instance: 'node-html_content_type-field_title_short'
  $field_instances['node-html_content_type-field_title_short'] = array(
    'bundle' => 'html_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The short version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_short',
    'label' => 'Title, short',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 32,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_alt_text'
  $field_instances['node-multimedia_content_type-field_alt_text'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Alt text describing the image',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 13,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_alt_text',
    'label' => 'Alt text',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 45,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_comments'
  $field_instances['node-multimedia_content_type-field_comments'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 9,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_comments',
    'label' => 'Comments',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 41,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_description'
  $field_instances['node-multimedia_content_type-field_description'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'A brief description about the content item asset',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_description',
    'label' => 'Description',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 33,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_embed_code'
  $field_instances['node-multimedia_content_type-field_embed_code'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'HTML code to embed a multimedia file onto a web page, such as from YouTube',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 15,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_embed_code',
    'label' => 'Embed Code',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 47,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_file'
  $field_instances['node-multimedia_content_type-field_file'] = array(
    'bundle' => 'multimedia_content_type',
    'deleted' => 0,
    'description' => 'A binary multimedia file (such as an image, video, or audio file)',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'file',
        'settings' => array(),
        'type' => 'file_default',
        'weight' => 12,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_file',
    'label' => 'File',
    'required' => 0,
    'settings' => array(
      'description_field' => 0,
      'file_directory' => '',
      'file_extensions' => 'txt doc docx xls xlsx pdf avi mov png jpg gif mp4',
      'max_filesize' => '',
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'file',
      'settings' => array(
        'progress_indicator' => 'throbber',
      ),
      'type' => 'file_generic',
      'weight' => 44,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_for_use_by_'
  $field_instances['node-multimedia_content_type-field_for_use_by_'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 10,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_for_use_by_',
    'label' => 'For use by:',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 42,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_language'
  $field_instances['node-multimedia_content_type-field_language'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 7,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_language',
    'label' => 'Language',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 39,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_media_type'
  $field_instances['node-multimedia_content_type-field_media_type'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'What type of multimedia is represented by the content item',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 16,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_media_type',
    'label' => 'Media Type',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 48,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_notify_marketing_team'
  $field_instances['node-multimedia_content_type-field_notify_marketing_team'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 8,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_notify_marketing_team',
    'label' => 'Notify Marketing Team',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 40,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_override_editor_approval'
  $field_instances['node-multimedia_content_type-field_override_editor_approval'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 11,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_override_editor_approval',
    'label' => 'Override editor approval',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 43,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_tags'
  $field_instances['node-multimedia_content_type-field_tags'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Main keywords related to the content item ',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 3,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 35,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_taxonomy'
  $field_instances['node-multimedia_content_type-field_taxonomy'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Taxonomy location',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 4,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 36,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_title_long'
  $field_instances['node-multimedia_content_type-field_title_long'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The long version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_long',
    'label' => 'Title, long',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 31,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_title_short'
  $field_instances['node-multimedia_content_type-field_title_short'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'The short version of the content item title',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_short',
    'label' => 'Title, short',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 32,
    ),
  );

  // Exported field_instance: 'node-multimedia_content_type-field_transcript'
  $field_instances['node-multimedia_content_type-field_transcript'] = array(
    'bundle' => 'multimedia_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Transcript of a video or audio file, or a detailed description of an infographic',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 14,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_transcript',
    'label' => 'Transcript',
    'required' => 0,
    'settings' => array(
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 46,
    ),
  );

  // Exported field_instance: 'node-text_content_type-body'
  $field_instances['node-text_content_type-body'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 11,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'body',
    'label' => 'Body',
    'required' => 1,
    'settings' => array(
      'display_summary' => 0,
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 20,
        'summary_rows' => 5,
      ),
      'type' => 'text_textarea_with_summary',
      'weight' => 54,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_comments'
  $field_instances['node-text_content_type-field_comments'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 8,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_comments',
    'label' => 'Comments',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 48,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_description'
  $field_instances['node-text_content_type-field_description'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_description',
    'label' => 'Description',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'rows' => 5,
      ),
      'type' => 'text_textarea',
      'weight' => 36,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_for_use_by_'
  $field_instances['node-text_content_type-field_for_use_by_'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 9,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_for_use_by_',
    'label' => 'For use by:',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 50,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_language'
  $field_instances['node-text_content_type-field_language'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 6,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_language',
    'label' => 'Language',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 44,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_notify_marketing_team'
  $field_instances['node-text_content_type-field_notify_marketing_team'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 7,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_notify_marketing_team',
    'label' => 'Notify Marketing Team',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 46,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_override_editor_approval'
  $field_instances['node-text_content_type-field_override_editor_approval'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
        'weight' => 10,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_override_editor_approval',
    'label' => 'Override editor approval',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 52,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_tags'
  $field_instances['node-text_content_type-field_tags'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 3,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 38,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_taxonomy'
  $field_instances['node-text_content_type-field_taxonomy'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 4,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => array(
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ),
      'type' => 'taxonomy_autocomplete',
      'weight' => 40,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_title_long'
  $field_instances['node-text_content_type-field_title_long'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_long',
    'label' => 'Title, long',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 32,
    ),
  );

  // Exported field_instance: 'node-text_content_type-field_title_short'
  $field_instances['node-text_content_type-field_title_short'] = array(
    'bundle' => 'text_content_type',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_title_short',
    'label' => 'Title, short',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'size' => 60,
      ),
      'type' => 'text_textfield',
      'weight' => 34,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('A binary file, such as a PDF document or a Microsoft Word file');
  t('A binary multimedia file (such as an image, video, or audio file)');
  t('A brief description about the content item asset');
  t('Alpha-order-name');
  t('Alt text');
  t('Alt text describing the image');
  t('Body');
  t('City');
  t('City for the record’s address');
  t('Comments');
  t('Contact links');
  t('Description');
  t('Directory type');
  t('Donated money');
  t('Embed Code');
  t('English Translation Name');
  t('English toggle');
  t('File');
  t('File Type');
  t('First street address for the record’s address');
  t('For English records, the directory record representing the same entity in Spanish.');
  t('For Spanish directory records, the English name of the record');
  t('For Spanish records, the directory record representing the same entity in English.');
  t('For use by:');
  t('Government branch');
  t('Group by');
  t('HTML');
  t('HTML code to embed a multimedia file onto a web page, such as from YouTube');
  t('Homepage links for the organization represented by the directory record');
  t('How to group the record in certain presentation outputs.');
  t('In-person links');
  t('Language');
  t('Links that can be used to contact the organization represented by the directory record');
  t('Links that can be used to contact the organization represented by the directory record in person');
  t('Main keywords related to the content item ');
  t('Media Type');
  t('Name of agency used for alphabetization purposes');
  t('Notify Marketing Team');
  t('Override editor approval');
  t('Phone number');
  t('Phone numbers for the record');
  t('Related record names');
  t('SCOAP member');
  t('SMS services');
  t('Second street address for the record’s address');
  t('See also');
  t('Show on AZ Index');
  t('Spanish toggle');
  t('State');
  t('State for the record’s address');
  t('Street 1');
  t('Street 2');
  t('Subdivision');
  t('Subdivision for the record’s address');
  t('Synonym');
  t('TTY number');
  t('TTY numbers for the record');
  t('Tags');
  t('Taxonomy');
  t('Taxonomy location');
  t('Text services offered by the directory record');
  t('The HTML code that makes up the content item');
  t('The long version of the content item title');
  t('The short version of the content item title');
  t('Title, long');
  t('Title, short');
  t('Toll free number');
  t('Toll-free Phone numbers for the record');
  t('Transcript');
  t('Transcript of a video or audio file, or a detailed description of an infographic');
  t('Website links');
  t('What branch of government does the record belong too');
  t('What type of directory record is the content item');
  t('What type of file does the content item represent');
  t('What type of multimedia is represented by the content item');
  t('Whether the directory record should be shown on A-Z indices');
  t('Whether the entity represented by the directory record donated money to help fund the Consumer Action Handbook and/or the Guia');
  t('Whether the entity represented by the directory record is a member of SOCAP');
  t('Zip');
  t('Zip code for the record’s address');

  return $field_instances;
}
