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
    
	// JKH moved this to here...
    _ssgCreateBuildStatus($site->uuid);
    _ssg_finish_request();
        
    // JKH added acquire mutex
    $site->log("SSG Checking instance...\n",false);
	$_ssg_mutex = new Mutex("ssg-mutex"); 
	if($_ssg_mutex->isLocked()) { 
		$site->log("SSG instance is busy!\n",false);
		_ssgUpdateBuildStatus($site->uuid,'6 busy');
		return; 	
	}
    $site->log("SSG Acquiring instance...\n",false); 	
	if(!$_ssg_mutex->getLock()) { 
		$site->log("SSG instance failed to lock!\n",false);
		_ssgUpdateBuildStatus($site->uuid,'-1 lock fails');
		return; 
	} 
    try {
    	_ssg_build_and_deploy_site($site);
    } catch (\Exception $e) {
		// JKH added 
		$site->log("_ssg_build_and_deploy_site(): Exception ". $e->getMessage()."\n",false);
	}
    // JKH release mutex
    $site->log("SSG Releasing instance...\n",false);
    $_ssg_mutex->releaseLock();
    
    
}