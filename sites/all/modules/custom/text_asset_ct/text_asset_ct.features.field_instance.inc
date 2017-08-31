<?php
/**
 * @file
 * text_asset_ct.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function text_asset_ct_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'node-text_asset-field_description'
  $field_instances['node-text_asset-field_description'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'This is a description of the asset.  It should be 1 or 2 sentences, and should be written as if it may be published somewhere, though it won’t be published on USA.gov or GobiernoUSA.gov. This text is helpful for developers using our API.',
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
    'label' => 'Summary',
    'required' => 1,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'maxlength_js' => 160,
        'maxlength_js_enforce' => 0,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
        'maxlength_js_truncate_html' => 0,
        'rows' => 3,
      ),
      'type' => 'text_textarea',
      'weight' => 1,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_language'
  $field_instances['node-text_asset-field_language'] = array(
    'bundle' => 'text_asset',
    'default_value' => array(
      0 => array(
        'value' => 'English',
      ),
    ),
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
      'settings' => array(
        'content_taxonomy_opt_groups' => FALSE,
      ),
      'type' => 'options_select',
      'weight' => 3,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_notes'
  $field_instances['node-text_asset-field_notes'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'You can enter any notes you want into this field.  They will not be migrated into the final Platform Management System, and not made available to the public.  You might use this field to add reminders for yourself about the asset, for example.',
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
    'field_name' => 'field_notes',
    'label' => 'Notes',
    'required' => 0,
    'settings' => array(
      'text_processing' => 0,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'maxlength_js' => '',
        'maxlength_js_enforce' => 0,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
        'maxlength_js_truncate_html' => 0,
        'rows' => 3,
      ),
      'type' => 'text_textarea',
      'weight' => 9,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_priority'
  $field_instances['node-text_asset-field_priority'] = array(
    'bundle' => 'text_asset',
    'default_value' => array(
      0 => array(
        'value' => 'normal',
      ),
    ),
    'deleted' => 0,
    'description' => 'This field helps determine the order of content on a page.  High priority is for assets that we know are in highest demand.  Everything else is “normal”.  Most content should be “normal”.',
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
    'field_name' => 'field_priority',
    'label' => 'Priority',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(
        'content_taxonomy_opt_groups' => FALSE,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
      ),
      'type' => 'options_select',
      'weight' => 6,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_review_in_progress'
  $field_instances['node-text_asset-field_review_in_progress'] = array(
    'bundle' => 'text_asset',
    'default_value' => array(
      0 => array(
        'value' => 0,
      ),
    ),
    'deleted' => 0,
    'description' => 'This box will be checked if an editor has started reviewing the asset.',
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
    'field_name' => 'field_review_in_progress',
    'label' => 'Review in Progress',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(
        'display_label' => 1,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
      ),
      'type' => 'options_onoff',
      'weight' => 8,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_sharepoint_content_for_top'
  $field_instances['node-text_asset-field_sharepoint_content_for_top'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'For agent-only content being copied into the migration tool, this field can be used to indicate which topic desk might be best assigned to the content for long-term maintenance in the new platform.',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'list',
        'settings' => array(),
        'type' => 'list_default',
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
    'field_name' => 'field_sharepoint_content_for_top',
    'label' => 'Sharepoint content for topic desk',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(
        'content_taxonomy_opt_groups' => FALSE,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
      ),
      'type' => 'options_select',
      'weight' => 7,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_tags'
  $field_instances['node-text_asset-field_tags'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '<p>Use tags to indicate if the content is related to a particular agency. As you type into the text field, the system will auto-complete available agencies for you.  This field is used for internal reporting purposes.</p>
<p>You can find a full list of the available agency tags in <a href="https://docs.google.com/a/gsa.gov/spreadsheet/ccc?key=0Aocz1kEXwKRBdE9lWlNESUpHVDBrWk12akk1SW5RZ0E&usp=drive_web#gid=0" target="_blank">this Google Doc</a>.</p>',
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
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 0,
      'module' => 'autocomplete_deluxe',
      'settings' => array(
        'autocomplete_deluxe_path' => 'autocomplete_deluxe/taxonomy',
        'autocomplete_path' => 'taxonomy/autocomplete',
        'content_taxonomy_autocomplete_new_terms' => 'deny',
        'content_taxonomy_opt_groups' => FALSE,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
        'size' => 60,
      ),
      'type' => 'autocomplete_deluxe_taxonomy',
      'weight' => 5,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_taxonomy'
  $field_instances['node-text_asset-field_taxonomy'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '<p>Use the taxonomy tree to indicate where the asset should appear.  You can (but don’t have to) choose more than one location. All content will automatically go to the contact center. If you select “ONLY for call center usage”, it will not publish on usa.gov or gobiernousa.gov.</p>
<p>You can find a copy of the taxonomy that\'s presented in the tool in <a href="https://docs.google.com/a/gsa.gov/document/d/1JThYZS3apxwdx__SCbAYX0y3EQDNFkJjxXNp99YMyBk/edit" target="_blank">this Google Doc</a>.</p>',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
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
    'field_name' => 'field_taxonomy',
    'label' => 'Taxonomy',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'term_reference_tree',
      'settings' => array(
        'cascading_selection' => 0,
        'filter_view' => '',
        'leaves_only' => 1,
        'max_depth' => '',
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
        'parent_term_id' => '',
        'select_parents' => 0,
        'start_minimized' => 1,
        'token_display' => '',
        'track_list' => 1,
      ),
      'type' => 'term_reference_tree',
      'weight' => 4,
    ),
  );

  // Exported field_instance: 'node-text_asset-field_text_asset_body'
  $field_instances['node-text_asset-field_text_asset_body'] = array(
    'bundle' => 'text_asset',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'This is where you write the asset.  Use the WYSIWYG tools to format your text.  You can edit: bold, bullets, number list, italics, sub-heading, sub-sub heading, or embed links. Don’t worry about formatting options like font, or text color or text size. Those things are determined by the style sheets. Don’t go into the source code field, just rely on the WYSIWYG editor. You can copy and paste text into the WYSIWYG box, but the formatting won’t follow - you’ll have to reformat it yourself. This field is used to create and display the text asset.

Please do not change the text format option from "filtered HTML."',
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
    'field_name' => 'field_text_asset_body',
    'label' => 'Text Asset Body',
    'required' => 1,
    'settings' => array(
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'text',
      'settings' => array(
        'maxlength_js' => '',
        'maxlength_js_enforce' => 0,
        'maxlength_js_label' => 'Content limited to @limit characters, remaining: <strong>@remaining</strong>',
        'maxlength_js_truncate_html' => 0,
        'rows' => 20,
      ),
      'type' => 'text_textarea',
      'weight' => 2,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('<p>Use tags to indicate if the content is related to a particular agency. As you type into the text field, the system will auto-complete available agencies for you.  This field is used for internal reporting purposes.</p>
<p>You can find a full list of the available agency tags in <a href="https://docs.google.com/a/gsa.gov/spreadsheet/ccc?key=0Aocz1kEXwKRBdE9lWlNESUpHVDBrWk12akk1SW5RZ0E&usp=drive_web#gid=0" target="_blank">this Google Doc</a>.</p>');
  t('<p>Use the taxonomy tree to indicate where the asset should appear.  You can (but don’t have to) choose more than one location. All content will automatically go to the contact center. If you select “ONLY for call center usage”, it will not publish on usa.gov or gobiernousa.gov.</p>
<p>You can find a copy of the taxonomy that\'s presented in the tool in <a href="https://docs.google.com/a/gsa.gov/document/d/1JThYZS3apxwdx__SCbAYX0y3EQDNFkJjxXNp99YMyBk/edit" target="_blank">this Google Doc</a>.</p>');
  t('For agent-only content being copied into the migration tool, this field can be used to indicate which topic desk might be best assigned to the content for long-term maintenance in the new platform.');
  t('Language');
  t('Notes');
  t('Priority');
  t('Review in Progress');
  t('Sharepoint content for topic desk');
  t('Summary');
  t('Tags');
  t('Taxonomy');
  t('Text Asset Body');
  t('This box will be checked if an editor has started reviewing the asset.');
  t('This field helps determine the order of content on a page.  High priority is for assets that we know are in highest demand.  Everything else is “normal”.  Most content should be “normal”.');
  t('This is a description of the asset.  It should be 1 or 2 sentences, and should be written as if it may be published somewhere, though it won’t be published on USA.gov or GobiernoUSA.gov. This text is helpful for developers using our API.');
  t('This is where you write the asset.  Use the WYSIWYG tools to format your text.  You can edit: bold, bullets, number list, italics, sub-heading, sub-sub heading, or embed links. Don’t worry about formatting options like font, or text color or text size. Those things are determined by the style sheets. Don’t go into the source code field, just rely on the WYSIWYG editor. You can copy and paste text into the WYSIWYG box, but the formatting won’t follow - you’ll have to reformat it yourself. This field is used to create and display the text asset.

Please do not change the text format option from "filtered HTML."');
  t('You can enter any notes you want into this field.  They will not be migrated into the final Platform Management System, and not made available to the public.  You might use this field to add reminders for yourself about the asset, for example.');

  return $field_instances;
}
