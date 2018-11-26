<?php

namespace ctac\ssg;

class ConfigLoader
{
    use LoggingTrait;

    public function loadConfig( $name )
    {
        /// if we are running on a commandline
        $configFile = realpath( getcwd().'/config' ) .'/'. trim(strtolower($name)).'.config.php';
        if ( file_exists($configFile) && is_readable($configFile) )
        {
            return $this->loadFile($configFile);
        } else {
            return $this->loadDrupal();
        }
    }

  	public function loadFile( $fileName=null )
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
                $this->log('Cannot find config within file '.$fileName);
            }
        } else {
            $this->log('Cannot find file '.$fileName);
        }
        return [];
  	}

    public static function loadDrupal()
    {
        /// super basic check for being inside drupal
        if ( !function_exists('variable_get') )
        {
            return [];
        }
        /// prod env should already have these
        /// but local env may not, so we try and set them here
        /// with proper config this should not be necessary
        $envAccessKey = getenv('AWS_ACCESS_KEY_ID');
        $accessKey    = getenv('CMP_AWS_ACCESS_KEY');
        if ( empty($envAccessKey) && !empty($accessKey) )
        {
            putenv('AWS_ACCESS_KEY_ID='.$accessKey);
        }
        $envSecretKey = getenv('AWS_SECRET_ACCESS_KEY');
        $secretKey    = getenv('CMP_AWS_SECRET_KEY');
        if ( empty($envSecretKey) && !empty($secretKey) )
        {
            putenv('AWS_SECRET_ACCESS_KEY='.$secretKey);
        }

        /// these must all be turned into arrays
        $arrayValues = [ 
            'ssg_allowedForUseBy'=>[], 
            'ssg_templateSync_repo_asset_dirs'=>[], 
            'ssg_templateSync_repo_static_dirs'=>[] 
        ];
        foreach ( array_keys($arrayValues) as $key )
        {
            $arrayValues[$key] = variable_get($key);
            if ( is_string($arrayValues[$key]) )
            {
                $arrayValues[$key] = preg_split("/\s*,\s*/",$arrayValues[$key]);
            }
            // failsafe default case
            if ( !is_array($arrayValues[$key]) )
            {
                $arrayValues[$key] = [];
            }
        }

        $config = [
            'siteName'    => variable_get('ssg_siteName'),
            'siteUrl'     => variable_get('ssg_siteUrl'),
            'allowedForUseBy' => $arrayValues['ssg_allowedForUseBy'],
            'permDir'     => variable_get('ssg_permDir'),
            'tempDir'     => variable_get('ssg_tempDir'),
            'featuresPageBatchSize' => variable_get('ssg_featuresPageBatchSize'),
            'drupalAPI' => [
              'server'       => variable_get('ssg_drupalAPI_server'),
              'redirectsUrl' => variable_get('ssg_drupalAPI_redirectsUrl'),
              'entitiesUrl'  => variable_get('ssg_drupalAPI_entitiesUrl'),
              'batchSize'    => variable_get('ssg_drupalAPI_batchSize')
            ],
            'templateSync' => [
              'repo_url'    => variable_get('ssg_templateSync_repo_url'),
              'repo_user'   => variable_get('ssg_templateSync_repo_user'),
              'repo_pass'   => variable_get('ssg_templateSync_repo_pass'),
              'repo_branch' => variable_get('ssg_templateSync_repo_branch'),
              'repo_template_dir' => variable_get('ssg_templateSync_repo_template_dir'),
              'repo_asset_base'   => variable_get('ssg_templateSync_repo_asset_base'),
              'repo_asset_dirs'   => $arrayValues['ssg_templateSync_repo_asset_dirs'],
              'repo_static_base'  => variable_get('ssg_templateSync_repo_static_base'),
              'repo_static_dirs'  => $arrayValues['ssg_templateSync_repo_static_dirs'],
            ],
            'aws' => [
                'aws_access_key_id' => getenv('CMP_AWS_ACCESS_KEY'),
                'aws_secret_access_key' => getenv('CMP_AWS_SECRET_KEY'),
                'region'  => 'usa-east-1',
                'version' => 'latest',
                'bucket'  => getenv('CMP_AWS_S3_BUCKET_2'),
                'credentials' => [
                    'key'    => getenv('CMP_AWS_ACCESS_KEY'),
                    'secret' => getenv('CMP_AWS_SECRET_KEY'),
                ]
            ]
        ];
        return $config;
    }
}
