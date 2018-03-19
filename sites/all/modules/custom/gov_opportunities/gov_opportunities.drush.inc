<?php

function gov_opportunities_drush_command()
{

  $items = array();
  $items['govopp-elasticsearch-validate'] = array(
    'description' => 'Check Elasticsearch for Valid indexes.',
    'aliases' => array('goev'),
    'callback' => '_govopp_drush_validate_elasticsearch',
  );
  $items['govopp-elasticsearch-setup'] = array(
    'description' => 'Setup Elasticsearch indexes.',
    'aliases' => array('goes'),
    'callback' => '_govopp_drush_setup_elasticsearch',
  );
  $items['govopp-elasticsearch-rebuild'] = array(
    'description' => 'Rebuild Elasticsearch indexes.',
    'aliases' => array('goer'),
    'callback' => '_govopp_drush_rebuild_elasticsearch',
  );
  $items['govopp-clean-data'] = array(
    'description' => 'Remove old and closed opportunities.',
    'aliases' => array('gocd'),
    'callback' => '_govopp_drush_clean_data',
  );
  $items['govopp-pull-fbopen-full'] = array(
    'description' => 'Queue specified entity for syncing.',
    'aliases' => array('gopff'),
    'callback' => '_govopp_drush_pull_fbo_full',
  );
  $items['govopp-pull-fbopen-daily'] = array(
    'description' => 'Queue specified entity for syncing.',
    'aliases' => array('gopfd'),
    'callback' => '_govopp_drush_pull_fbo_daily',
    'arguments' => array(
        'date'   => 'YYYYMMDD',
    ),
  );
  return $items;
}

/// action functions
function _govopp_drush_validate_elasticsearch()
{
    _govopp_long_running_process();
    $result = _govopp_validate_elasticsearch();
    echo "Elasticsearch: ";
    print_r($result);
}

function _govopp_drush_setup_elasticsearch()
{
    _govopp_long_running_process();
    $result = _govopp_validate_elasticsearch();
    if (!empty($result['server']) && empty($result['index'])) {
        $result = _govopp_setup_elasticsearch();
        if ( !is_bool($result) ) {
          print_r($result);
        }
    }
    _govopp_drush_validate_elasticsearch();
}

function _govopp_drush_rebuild_elasticsearch()
{
    _govopp_long_running_process();

    _govopp_teardown_elasticsearch();
    _govopp_drush_setup_elasticsearch();
}

function _govopp_drush_clean_data($dateString = null)
{
    _govopp_long_running_process();

    $fbo = new FBOXMLImport();
    $fbo->setElasticsearchHost(_govopp_elasticsearch_server());
    $fbo->removeClosedOpportunities();
    $fbo->removeOldOpportunities();
    $fbo->removeOldDownloadedFiles();

}

function _govopp_drush_pull_fbo_full()
{
    _govopp_long_running_process();
    $t = time();

    $fbo = new FBOXMLImport();
    $fbo->setElasticsearchHost(_govopp_elasticsearch_server());
    $fbo->setFilename('Full');
    $fbo->setCommandline(true);

    if ( !$fbo->remoteFileExists() ) {
      echo 'File not found: '.$fbo->filename."\n";
      return;
    }

    $fbo->processFile();
    $fbo->removeClosedOpportunities();
    $fbo->removeOldOpportunities();
    $fbo->removeOldDownloadedFiles();

    echo "\n";
    echo "ITEMS  : ". (count($fbo->opportunities)+count($fbo->mods)+count($fbo->awards)) ."\n";
    echo "MEMORY : ". $fbo->getNiceSize(memory_get_peak_usage(),TRUE) ."\n";
    echo "TIME   : ". (time()-$t) ." seconds \n";

}

function _govopp_drush_pull_fbo_daily($dateString=null)
{
    _govopp_long_running_process();
    $t = time();

    if ( $dateString===null ) {
      $dateString = date('Ymd',strtotime('yesterday'));
    }

    $dateString = str_ireplace('FBOFeed', '', $dateString);
    $time = strtotime($dateString);
    if ($time === false) {
        echo "No Date Found\n";
        return;
    }
    $fbo = new FBOXMLImport();
    $fbo->setElasticsearchHost(_govopp_elasticsearch_server());
    $fbo->setFilename('FBOFeed' . date('Ymd', $time));
    $fbo->setCommandline(true);
    if (!$fbo->remoteFileExists()) {
        echo 'File not found: '.$fbo->filename."\n";
        return;
    }

    $fbo->processFile();
    $fbo->removeClosedOpportunities();
    $fbo->removeOldOpportunities();
    $fbo->removeOldDownloadedFiles();

    echo "\n";
    echo "ITEMS  : ". ( count($fbo->opportunities) + count($fbo->mods) + count($fbo->awards) ) ."\n";
    echo "MEMORY : ". $fbo->getNiceSize(memory_get_peak_usage(),TRUE) ."\n";
    echo "TIME   : ". (time()-$t) ." seconds \n";
}
