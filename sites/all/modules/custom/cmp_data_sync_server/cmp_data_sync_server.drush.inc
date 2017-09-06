<?php

function cmp_data_sync_server_drush_command()
{

  $items = array();
  $items['cmp-data-sync-process'] = array(
    'description' => 'Process any queued sync items.',
    'aliases' => array('cdsp'),
    'callback' => '_cdss_drush_process_queue',
  );
  $items['cmp-data-sync-queue'] = array(
    'description' => 'Queue specified entity for syncing.',
    'aliases' => array('cdsq'),
    'callback' => '_cdss_add_entity_to_queue',
    'arguments' => array(
        'e_id'   => 'Entity Id',
        'e_type' => 'Entity Type [node|taxonomy_term].',
    ),
  );
  $items['cmp-data-sync-queue-nodes'] = array(
    'description' => 'Queue all nodes for syncing.',
    'aliases' => array('cdsqn'),
    'callback' => '_cdss_add_all_nodes_to_queue',
  );
  $items['cmp-data-sync-queue-terms'] = array(
    'description' => 'Queue all terms for syncing.',
    'aliases' => array('cdsqt'),
    'callback' => '_cdss_add_all_terms_to_queue',
  );
  return $items;
}

function _cdss_drush_process_queue()
{
    $minutes_to_process = 60;
    set_time_limit($minutes_to_process*60);
    ini_set('max_execution_time',$minutes_to_process*60);
    _cdss_process_queue();
}