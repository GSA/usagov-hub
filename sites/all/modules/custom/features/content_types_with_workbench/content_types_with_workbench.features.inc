<?php
/**
 * @file
 * content_types_with_workbench.features.inc
 */

/**
 * Implements hook_node_info().
 */
function content_types_with_workbench_node_info() {
  $items = array(
    'directory_record_content_type' => array(
      'name' => t('Directory Record Content Type'),
      'base' => 'node_content',
      'description' => t('The CMS must support content types – a named collection of data fields to be completed by CMS users when working with content in the CMS.  Users can then create a new content item based on the available content types for publication to the API. A preliminary list of content types and the fields contained are listed below (see CMS 2014 Requirements Document.docx).  However, this list may change once we enter the design and implementation phase of the project.  For example, new fields or new content types may be added if it’s determined by the implementation team that that would be the easiest way to implement a specific design requirement.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'file_content_type' => array(
      'name' => t('File Content Type'),
      'base' => 'node_content',
      'description' => t('The CMS must support content types – a named collection of data fields to be completed by CMS users when working with content in the CMS.  Users can then create a new content item based on the available content types for publication to the API. A preliminary list of content types and the fields contained are listed below (see CMS 2014 Requirements Document.docx).  However, this list may change once we enter the design and implementation phase of the project.  For example, new fields or new content types may be added if it’s determined by the implementation team that that would be the easiest way to implement a specific design requirement.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'html_content_type' => array(
      'name' => t('HTML Content Type'),
      'base' => 'node_content',
      'description' => t('The CMS must support content types – a named collection of data fields to be completed by CMS users when working with content in the CMS.  Users can then create a new content item based on the available content types for publication to the API. A preliminary list of content types and the fields contained are listed below (see CMS 2014 Requirements Document.docx).  However, this list may change once we enter the design and implementation phase of the project.  For example, new fields or new content types may be added if it’s determined by the implementation team that that would be the easiest way to implement a specific design requirement.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'multimedia_content_type' => array(
      'name' => t('Multimedia Content Type'),
      'base' => 'node_content',
      'description' => t('The CMS must support content types – a named collection of data fields to be completed by CMS users when working with content in the CMS.  Users can then create a new content item based on the available content types for publication to the API. A preliminary list of content types and the fields contained are listed below (see CMS 2014 Requirements Document.docx).  However, this list may change once we enter the design and implementation phase of the project.  For example, new fields or new content types may be added if it’s determined by the implementation team that that would be the easiest way to implement a specific design requirement.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'text_content_type' => array(
      'name' => t('Text Content Type'),
      'base' => 'node_content',
      'description' => t('The CMS must support content types – a named collection of data fields to be completed by CMS users when working with content in the CMS.  Users can then create a new content item based on the available content types for publication to the API. A preliminary list of content types and the fields contained are listed below (see CMS 2014 Requirements Document.docx).  However, this list may change once we enter the design and implementation phase of the project.  For example, new fields or new content types may be added if it’s determined by the implementation team that that would be the easiest way to implement a specific design requirement.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
