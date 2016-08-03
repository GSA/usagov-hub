<?php

function repo_sync_drush_command() {

  $items['usagov-sync'] = array(
    'description' => 'Sync up the repos.',
  );

  return $items;
}

function drush_repo_sync_usagov_sync()
{
  echo __FUNCTION__."\n\n";
  repo_sync_triggerSync();
}
