<?php

namespace ctac\ssg;

class ConfigLoader
{
    public static function loadConfig( $name )
    {
        /// if we are running on a commandline
        $configFile = realpath( getcwd().'/config' ) .'/'. trim(strtolower($name)).'.config.php';
        if ( file_exists($configFile) && is_readable($configFile) )
        {
            return self::loadFile($configFile);
        }
    }

  	public static function loadFile( $fileName=null )
  	{
        if ( file_exists($fileName) )
        {
            require($fileName);
            if ( !empty($config) )
            {
                if ( !empty($config['aws']['aws_access_key_id']) )
                {
                    putenv('AWS_ACCESS_KEY_ID='.$config['aws']['aws_access_key_id']);
                }
                if ( !empty($config['aws']['aws_secret_access_key']) )
                {
                    putenv('AWS_SECRET_ACCESS_KEY='.$config['aws']['aws_secret_access_key']);
                }
                if ( !empty($config['aws']['aws_session_token']) )
                {
                    putenv('AWS_SESSION_TOKEN='.$config['aws']['aws_session_token']);
                }
                return $config;
            } else {
                error_log('Cannot find config within file '.$fileName);
            }
        } else {
            error_log('Cannot find file '.$fileName);
        }
        return [];
  	}

    public static function loadDrupal()
    {
        return [
            'siteName' => 'USA.gov',
            'siteUrl'  => 'www.usa.gov',
            'permDir' => 's3://'.variable_get('s3fs_bucket').'/ssg',
            'tempDir' => '/tmp/ssg',
            'featuresPageBatchSize' => 5,
            'drupalAPI' => [
              'server'      => 'https://usa-cmp-stg.gsa.ctacdev.com',
              'redirectsUrl' => '/usaapi/redirects',
              'entitiesUrl'  => '/usaapi/entities',
              'batchSize'    => 100
            ],
            'templateSync' => [
              'repo_url'    => 'github.com/usagov/webtemplates.git',
              'repo_user'   => 'ctacBot',
              'repo_pass'   => 'af87f6dd2f8002ec9a6b3f4c6e4a8dc4bc240977',
              'repo_branch' => 'DataModel',
              'repo_template_dir' => 'components/00-Pages'
            ],
            'aws' => [
              'aws_access_key_id' => variable_get('awssdk2_access_key'),
              'aws_secret_access_key' => variable_get('awssdk2_secret_key'),
              'region'  =>  variable_get('s3fs_region'),
              'version' => 'latest',
              'bucket' => variable_get('s3fs_bucket')
            ]
        ];
    }
}
