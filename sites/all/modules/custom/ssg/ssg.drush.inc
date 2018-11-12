<?php

function ssg_drush_command()
{
  $items = array();
  $items['ssg-build'] = array(
    'description' => 'Static Site Generator.',
    'aliases' => array('ssgb'),
    'callback' => '_ssg_run_drush',
    'options' => [
       'fresh-data'      => 'Pull fresh data.',
       'fresh-templates' => 'Pull fresh templates.',
       'deploy'          => 'Deploy to destination.'
    ],
  );
  return $items;
}

function _ssg_run_drush()
{
    $site = new \ctac\ssg\StaticSiteGenerator();

    if ( drush_get_option('fresh-data', false) )
    {
        $site->source->freshData = true;
    } else {
        $site->source->freshData = false;
    }
    if ( drush_get_option('fresh-templates', false) )
    {
        $site->templates->freshTemplates = true;
    } else {
        $site->templates->freshTemplates = false;
    }
    if ( drush_get_option('deploy', false) )
    {
        $site->destination->allowDeploy = true;
    } else {
        $site->destination->allowDeploy = false;
    }
    
    _ssg_build_and_deploy_site($site);
    
}