<?php

/**
 * Implements hook_views_plugins().
 */
function relation_add_views_views_plugins() {
  $path = drupal_get_path('module', 'relation_add_views');

  return array(
    'display' => array(
      'relationaddviews' => array(
        'title' => t('Relation add view'),
        'admin' => t('Relation add view Source'),
        'help' => 'Selects relation entities for an relation add field',
        'handler' => 'relation_add_views_plugin_display',
        'uses hook menu' => FALSE,
        'use ajax' => FALSE,
        'use pager' => FALSE,
        'accept attachments' => FALSE,
        // Custom property, used with views_get_applicable_views() to retrieve
        // all views with a 'Relation add view' display.
        'relation_add_views display' => TRUE,
      ),
    ),
    'style' => array(
      'relation_add_view' => array(
        'title' => t('Relation add view'),
        'help' => t('Contains rows in contexts.'),
        'handler' => 'relation_add_views_plugin_style',
        'path' => $path . '/views',
        'theme file' => 'theme.inc',
        'theme path' => $path . '/themes',
        'theme' => 'views_view_unformatted',
        'uses row plugin' => TRUE,
        'uses fields' => TRUE,
        'uses grouping' => TRUE,
        'uses options' => TRUE,
        'uses hook menu' => FALSE,
        'use ajax' => FALSE,
        'use pager' => FALSE,
        'type' => 'normal',
        'even empty' => TRUE,
      ),
    ),
    'row' => array(
      'relation_add_views_fields' => array(
        'title' => t('Inline fields'),
        'help' => t('Displays the fields with an optional template.'),
        'handler' => 'relation_add_views_plugin_row_fields',
        'theme' => 'views_view_fields',
        'theme path' => drupal_get_path('module', 'views') . '/theme',
        'theme file' => 'theme.inc',
        'uses fields' => TRUE,
        'uses options' => TRUE,
        'type' => 'normal',
      ),
    ),
  );
}
