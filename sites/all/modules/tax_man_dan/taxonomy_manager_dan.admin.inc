<?php

include_once DRUPAL_ROOT . "/modules/taxonomy/taxonomy.admin.inc";

function taxonomy_manager_dan_voc_list()
{
  $output  = l(t('Add new vocabulary'), 'admin/structure/taxonomy/add/vocabulary') . ' | ';
  $output .= l(t('Edit vocabulary settings'), 'admin/structure/taxonomy') . '<br /><br />';

  $vocabularies = taxonomy_get_vocabularies();
  $voc_list     = array();

  foreach ($vocabularies as $vocabulary)
  {
    $voc_list[] = l($vocabulary->name, 'admin/structure/taxonomy_manager/voc/' . $vocabulary->machine_name);
  }
  if (!count($voc_list))
  {
    $voc_list[] = t('No Vocabularies available');
  }

  $output .= theme('item_list', array('items' => $voc_list, 'title' => t('Vocabularies')));
  return $output;
}

function taxonomy_manager_dan_ui( $vocabulary=null, $term=null )
{
    $vocabulary_form = drupal_get_form('taxonomy_manager_dan_vocabulary_form',$vocabulary);
    $term_form       = drupal_get_form('taxonomy_manager_dan_term_form',$term);
}

/// left side tree
function taxonomy_manager_dan_vocabulary_form($form, &$form_state, $vocabulary=null)
{
}
function taxonomy_manager_dan_vocabulary_form_callback()
{
}

/// right side term form
function taxonomy_manager_dan_term_form($form, &$form_state, $term=null)
{
}
function taxonomy_manager_dan_term_form_callback()
{
}
