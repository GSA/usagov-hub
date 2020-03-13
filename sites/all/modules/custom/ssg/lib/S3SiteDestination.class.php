<?php

namespace ctac\ssg;

class S3SiteDestination
{
    use LoggingTrait;

    public $ssg;
    public $s3;
    public $source;
    public $dest;
    public $bads;
    public $s3Sync;
    public $s3Pull;
    public $sourceInventory;
    public $destInventory;

	public function __construct( $ssg )
	{
        $this->ssg = $ssg;
        
        $this->source = $this->ssg->siteDir;
        $this->dest   = 's3://'.trim($this->ssg->config['aws']['bucket']);
        
        $this->allowDeploy = true;

        // if ( !empty($this->ssg->config['aws']['siteRoot']) )

        // $inlineEnv = '';
        // if ( !empty($this->ssg->config['aws']['aws_access_key_id']) )
        // {
        //     $inlineEnv .= 'export AWS_ACCESS_KEY_ID='. $this->ssg->config['aws']['aws_access_key_id'] .'; ';
        // }
        // if ( !empty($this->ssg->config['aws']['aws_secret_access_key']) )
        // {
        //     $inlineEnv .= 'export AWS_SECRET_ACCESS_KEY='. $this->ssg->config['aws']['aws_secret_access_key'] .'; ';
        // }
        // if ( !empty($this->ssg->config['aws']['aws_session_token']) )
        // {
        //     $inlineEnv .= 'export AWS_SESSION_TOKEN='. $this->ssg->config['aws']['aws_session_token'] .'; ';
        // }

        // $this->s3Sync = "{$inlineEnv} aws s3 sync {$this->source} {$this->dest} --delete";
        // $this->s3Pull = "{$inlineEnv} aws s3 sync {$this->dest} {$this->source} --delete";

        // echo "aws s3 sync {$this->source} {$this->dest} --delete --exclude \"/analytics/raw-data/*\""."\n";

        $this->s3Sync = "aws s3 sync {$this->source} {$this->dest} --delete --acl public-read";
        $this->s3Pull = "aws s3 sync {$this->dest} {$this->source} --delete";

        $this->bads = [ 'command not found', 'usage', 'error' ];
    }

    public function sync()
    {
        if ( !$this->allowDeploy )
        {
            $this->log("Syncing to destination disabled\n");
            return true;
        }
        
        // if ( !$this->ssg->validateSite() ) {
        //     $this->log("Sync Files ... DENIED validation failed\n");
        //     return false;
        // }

        $this->log("Syncing to destination bucket\n");
        $filesSynced = $this->syncFilesCli();
        // $filesSynced = $this->syncFilesSdk();
        if (!$filesSynced)
        {
            $this->log("Sync Files ... failed\n");
            return false; 
        }
        return true;
    }

    public function syncFilesCli()
    {
        // JKH changed looksgood to retcode
        $retcode = true;

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

		// $this->log("delete me " . getenv('AWS_ACCESS_KEY_ID') . ", " . getenv('AWS_SECRET_ACCESS_KEY'), false);
		// JKH s3Sync is defined as ..., you can also pass --dryrun to this $result = `{$this->s3Sync} --dryrun`;
		// $this->s3Sync = "aws s3 sync {$this->source} {$this->dest} --delete --acl public-read";
		/// first pull down any files we want to preserve, then sync
		try {
			$this->log("Sync: aws s3 sync\n", false);
			$result = `{$this->s3Sync}`;
			// $this->log("result = " . $result . "\n", false);
			// $bad = 'command not found', 'usage', 'error'
			foreach ( $this->bads as $bad ) {
				// JKH added for empty response
				if ( stristr($bad,$result) || strlen($result)==0 ) {
					throw new \Exception('aws s3 sync fails');
				}
			}
			$this->log("Sync: aws s3 sync done\n", false);

			$this->log("Sync: uploading site manifest.\n", false);
  			$sourceFiles = $this->getFilesInDir($this->source,true);
			foreach ( $sourceFiles as &$file )
			{
				if ( !empty($file['ContentType']) )
				{
					$this->log("Sync: adjusting content-type for {$file['origKey']}\n", false);
					$this->ssg->s3->putObject([
						'Bucket' => $this->ssg->config['aws']['bucket'],
						'Key'    => $file['origKey'],
						'SourceFile' => $file['path'],
						'ContentType' => $file['ContentType']
					]);
				}
				unset($file['path']);
			}

			// JKH added
			$this->log("S3 file_put_contents()\n", false);
            file_put_contents($this->source.'/manifest.json',json_encode($sourceFiles));
            $sourceFiles['manifest.json'] = [ 'key'=>'manifest.json', 'md5'=>null, 'created'=>time() ];
			// JKH added 
			$jconfig = _s3fs_get_config();
			$jconfig['bucket']  = $this->ssg->config['aws']['bucket'];
			$jconfig['version'] = 'latest';
			$jconfig['awssdk2_access_key'] = $accessKey;
			$jconfig['awssdk2_secret_key'] = $secretKey; 
			// JKH added 
			$s3 = _s3fs_get_amazons3_client($jconfig);    
			$key = 'manifest.json';
			$file_path = $this->source . "/" . $key;
			$result = $s3->putObject([
				'Bucket' => $this->ssg->config['aws']['bucket'],
				'Key'    => $key,
				'SourceFile' => $file_path]);	
			// JKH added 
			// $this->log("putObject Result\n");
			// $this->log(serialize($result) . "\n");	
			// $this->log($result['ObjectURL'] . "\n");
			$this->log("Sync: putObject() succeeds\n");					

            // JKH added 
			if($retcode) { 
				$this->log("S3 object put!\n");
			}
        } catch (\Aws\S3\Exception\S3Exception $e) {
            $this->log("Sync: There was an error uploading Manifest file. ". $e->getMessage()."\n");
            // JKH added
            $retcode = false;
        } catch (\Exception $e) {
        	// JKH added 
        	$this->log("Sync: Exception ". $e->getMessage()."\n");
        	$retcode = false;
        }

        return $retcode;
    }

    public function getFilesInDir($targetDir,$md5=false)
    {
        // $this->log("Getting files in dir: $targetDir\n");
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($targetDir));
        $files    = [];

        // $finfo = new \finfo(FILEINFO_MIME);

        foreach ($iterator as $file)
        {
            if (!$file->isDir())
            {
                $path = $file->getPathname();
                // $this->log("Getting File : $path\n");
                $key = str_replace($targetDir.'/','',$path);
                // if ( preg_match('/index.html$/',$_key) && !preg_match('/^index.html/',$_key) )
                // {
                //     $key = dirname($_key);
                // }
                if ( $key == '.' || $key == '..' ) { continue; }    
                $files[$key] = [
                    'origKey'=>$key,
                    'keys'=>[$key],
                    'path'=>$path,
                    // 'ContentType'=>$finfo->file($path),
                    'md5'=> $md5 ? md5_file($path) : null
                ];

                /// if this is a json/rss file, then set it's mime type
                if ( !empty($this->ssg->contentTypeOverride[$key]) )
                {
                    $files[$key]['ContentType'] = $this->ssg->contentTypeOverride[$key];
                }
            }
        }
        ksort($files);
        return $files;
    }

    public function syncFilesSdk()
    {
        /// get local and remote file listings
        $removeFromDest = [];
        $this->log("Sync: getting source file list.\n");
        $sourceFiles = $this->getFilesInDir($this->source,true);

        $this->log("Sync: getting destination file list.\n");
        /// get old manifest
        if ( file_exists('s3://'.$this->ssg->config['aws']['bucket'].'/manifest.json') )
        {
            $this->log("Sync: downloading manifest from s3.\n");
            $destFileManifest = file_get_contents('s3://'.$this->ssg->config['aws']['bucket'].'/manifest.json');
            $destFiles = json_decode($destFileManifest,true);
        } else {
            $this->log("Sync: build manifest from s3 scrape.\n");
            /// don't grap md5, it's too expensive on a scrape like this
            /// it is quicker to reupload everything than to calc md5 for everything
            $destFiles = $this->getFilesInDir($this->dest);
        }

        /// remove any old files
        foreach ( $destFiles as $key=>$destFile )
        {
            /// if remote-destination has no local-source equiv
            ///     it should be removed from remote-destination
            if ( !array_key_exists($key,$sourceFiles) )
            {
                /// each file may have more than one key associated with it
                /// it may have the data file and a redirect location
                foreach ( $destFile['keys'] as $dkey )
                {
                    //$this->log("Remove from destination : $dkey\n");
                    $removeFromDest[] = $dkey;
                }
            }
        }
        /// delete all in one call
        $this->log("Sync: removing old files (".count($removeFromDest).")\n");
        if ( !empty($removeFromDest) )
        {
            $this->ssg->s3->deleteObjects([
                'Bucket'  => $this->ssg->config['aws']['bucket'],
                'Delete' => [
                    'Objects' => array_map(function ($key) {
                        return ['Key' => $key];
                    }, $removeFromDest)
                ],
            ]);
        }

        $this->log("Sync: uploading files.\n");

        /// add/update any new/changed files
        foreach ( $sourceFiles as $key=>$sourceFile )
        {
            // $html = file_get_contents($sourceFile['path']);
            $html = '';
            $handle = @fopen($sourceFile['path'], "r");
            if ($handle) {
                $html = fgets($handle, 1024);
                $html = "$html";
                fclose($handle);
            }

            $isRedirect  = false;
            $redirectTo  = null;
            // $contentType = null;
            // if ( stristr($html,'http-equiv="Content-Type"') ) 
            // {
            //     $c = [];
            //     preg_match("/http\-equiv=\"Content-Type\"\s+content=\"(.*?)\"\s*\/?\>/",$html,$c);
            //     if ( !empty(!$c[1]) )
            //     {
            //         $contentType = $c[1];
            //     } 
            // }
            if ( stristr($html,'http-equiv="refresh"') ) 
            {
                $m = [];            
                $isRedirect = preg_match("/http\-equiv=\"refresh\"\s+content=\"\d+;url=\'?(.*?)\'?\"\s*\/?\>/",$html,$m);
                if ( $isRedirect && !empty($m[1]) && preg_match('/^(http|\/)/',$m[1]) ) 
                { 
                    $redirectTo = preg_replace('/^\/+/','/',$m[1]);
                }
            }

            /// if local-source has no remote-destination equiv
            ///     it should be added to remote-destination
            if ( !array_key_exists($key,$destFiles) )
            {
                /// we want cleaned urls:
                /// so /path/to/file/index.html is what the file system has
                /// so /path/to/file/ should redirect
                /// to /path/to/file
                /// since we are dealing with index.html files locally
                /// we need to just assume an index.html should be 
                /// represented by the clean path in the s3 bucker 
                try {
                    if ( $isRedirect )
                    {
                        // $this->log("Sync: Redirect $key => $redirectTo\n");
                        $this->ssg->s3->putObject([
                            'Bucket' => $this->ssg->config['aws']['bucket'],
                            'Key'    => $key,
                            'WebsiteRedirectLocation' => $redirectTo,
                            'ACL'    => 'public-read'
                        ]);
                    } else {
                        if ( preg_match('/index.html$/',$key) && !preg_match('/^index.html/',$key) )
                        {
                            $cleanKey = dirname($key);
                            $this->ssg->s3->putObject([
                                'Bucket' => $this->ssg->config['aws']['bucket'],
                                'Key'    => $key,
                                'WebsiteRedirectLocation' => '/'.$cleanKey,
                                'ACL'    => 'public-read'
                            ]);
                            $sourceFiles[$key]['keys'][] = $cleanKey;
                            $key = $cleanKey;
                        }
                        //
                        // JKH added 
                        //  
                        $this->ssg->s3->putObject([
                            'Bucket' => $this->ssg->config['aws']['bucket'],
                            'Key'    => $key,
                            'Body'   => fopen($sourceFile['path'], 'r'),
                            'ACL'    => 'public-read'
                        ]);
                    }
                } catch (\Aws\S3\Exception\S3Exception $e) {
                    $this->log("Sync: There was an error creating the file $key.". $e->getMessage()."\n");
                }
            } else { /// this file exists on both places
                $destFile = $destFiles[$key];
                /// this file has changed
                if ( $destFile['md5'] != $sourceFile['md5'] ) 
                {
                    try {
                        if ( $isRedirect )
                        {
                            // $this->log("Sync: Update Redirect $key => $redirectTo\n");
                            $this->ssg->s3->putObject([
                                'Bucket' => $this->ssg->config['aws']['bucket'],
                                'Key'    => $key,
                                'WebsiteRedirectLocation' => $redirectTo,
                                'ACL'    => 'public-read'
                            ]);
                        } else {
                            // $this->log("Sync: Update $key\n");
                            $this->ssg->s3->putObject([
                                'Bucket' => $this->ssg->config['aws']['bucket'],
                                'Key'    => $key,
                                'Body'   => fopen($sourceFile['path'], 'r'),
                                'ACL'    => 'public-read'
                            ]);
                        }
                    } catch (\Aws\S3\Exception\S3Exception $e) {
                        $this->log("Sync: There was an error updating the file $key.". $e->getMessage()."\n");
                    }                    
                } else {
                    // $this->log("Sync: NoChange $key\n");
                }
            }
            //$sourceFiles[$_key]['path'] = str_replace($this->source,$sourceFile['path'],'/');
            unset($sourceFiles[$key]['path']);
        }
        // $this->log("\n");

        $this->log("Sync: uploading site manifest.\n");
        try {
            file_put_contents($this->source.'/manifest.json',json_encode($sourceFiles));
            $sourceFiles['manifest.json'] = [ 'key'=>'manifest.json', 'md5'=>null, 'created'=>time() ];
            $this->ssg->s3->putObject([
                'Bucket' => $this->ssg->config['aws']['bucket'],
                'Key'    => 'manifest.json',
                'Body'   => json_encode($sourceFiles),
                'ContentType' => 'application/json',
                'ACL'    => 'public-read',
            ]);
        } catch (\Aws\S3\Exception\S3Exception $e) {
            $this->log("Sync: There was an error uploading Manifest file. ". $e->getMessage()."\n");
        } 
        return true;
    }

    public function publicReadAllKeys()
    {
        $this->log("Sync ACL to PublicRead for all files ... \n");

        // $sdk = new \Aws\Sdk($this->ssg->config['aws']);
        // $s3 = $sdk->createS3();

        // try {
        //     $dirs = [];
        //     $objects = $s3->getPaginator('ListObjects', [
        //         'Bucket' => $this->ssg->config['aws']['bucket']
        //     ]);
        //     foreach ($objects as $object) 
        //     {
        //         print_r($object);
        //         JKH double checking that this die is commented out
        //         // if ( !empty($object['Key']) ) { print_r($object);die; }
        //         continue;
        //         try {
        //             $this->log("Sync: public ACL for key {$object['Key']}.\n");
        //             $s3->putObjectAcl([
        //                 'Bucket' => $this->ssg->config['aws']['bucket'],
        //                 'Key'    => $object['Key'],
        //                 'ACL'    => 'public-read'
        //             ]);
        //         } catch (\Aws\S3\Exception\S3Exception $e) {
        //             $this->log("Sync: There was an error setting ACL for {$object['Key']}.\n");
        //         }
        //         $lastDir = $object['Key'];
        //         $currDir = basedir($dir);
        //         while ( !empty($currDir) && $lastDir!==$currDir ) 
        //         {
        //             $dirs[$currDir] = false;
        //             $lastDir = $currDir;
        //             $currDir = basedir($currDir);
        //         }
        //     }
        //     /*
        //     foreach ($dirs as $dir=>$public) 
        //     {
        //         try {
        //             $this->log("Sync: public ACL for dir $dir.\n");
        //             $s3->putObjectAcl([
        //                 'Bucket' => $this->ssg->config['aws']['bucket'],
        //                 'Key'    => $dir,
        //                 'ACL'    => 'public-read'
        //             ]);
        //             $dirs[$dir] = true;
        //         } catch (\Aws\S3\Exception\S3Exception $e) {
        //             $this->log("Sync: There was an error setting ACL for dir {$dir}.\n");
        //         }
        //     }
        //     /** / 
        // } catch (\Aws\S3\Exception\S3Exception $e) {
        //     $this->log("Sync: There was an error listing bucket objects.\n");
        // }

        // $this->log("Sync ACL to PublicRead for all files ... done\n");

        $iterator = $this->ssg->s3->getIterator('ListObjects', array('Bucket' => $this->ssg->config['aws']['bucket']));
        $destFiles = [];

        foreach ($iterator as $object) 
        {
            try {
                echo " {$object['Key']}\n ";
                $this->ssg->s3->putObjectAcl([
                    'Bucket' => $this->ssg->config['aws']['bucket'],
                    'Key'    => $object['Key'],
                    'ACL'    => 'public-read'
                ]);
            } catch (\Aws\S3\Exception\S3Exception $e) {
                $this->log("Sync: There was an error setting ACL for $key.\n");
            }

            // $destFiles[$object['Key']] = false;
            // $lastDir = $object['Key'];
            // $currDir = dirname($lastDir);
            // while ( !empty($currDir) 
            //         && $lastDir!==$currDir 
            //         && $currDir!=='.' 
            //         && $currDir!=='..' )
            // {
            //     $currDir = rtrim($currDir,'/');
            //     $destFiles[$currDir]     = false;
            //     $destFiles[$currDir.'/'] = false;
            //     $lastDir = $currDir;
            //     $currDir = dirname($currDir);
            // }
        }
        // ksort($destFiles);
        // print_r($destFiles);

        //     $sdk = new \Aws\Sdk($this->ssg->config['aws']);
        //     $s3 = $sdk->createS3();

        //     $s3->registerStreamWrapper();

        //     $destDirs  = [];
        //     $destFiles = [];

        //     $targetDir = 's3://usagovdemo';

        //     $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($targetDir));
        //     $c = 0;
        //     foreach ($iterator as $file) 
        //     {
        //         $path = $file->getPathname();
        //         $key = str_replace($targetDir.'/','',$path);
        //         if ( $key == '.' || $key == '..' ) { continue; }    

        //         // if ( $c++ % 50 == 0 ) { echo " $c \n"; }
        //         // echo "."; 
        //         // echo " $key\n ";

        //         $destFiles[$key] = false;

        //         $lastDir = $key;
        //         $currDir = dirname($lastDir);
        //         while ( !empty($currDir) 
        //              && $lastDir!==$currDir 
        //              && $currDir!=='.' 
        //              && $currDir!=='..' )
        //         {
        //             // if ( $c++ % 50 == 0) { echo "\n"; }
        //             // echo "-"; 
        //             // echo " $currDir\n ";
        
        //             $destFiles[$currDir.'/'] = false;
        //             $lastDir = $currDir;
        //             $currDir = dirname($currDir);
        //         }
        //     }
        //     ksort($destFiles);

        //     foreach ( $destFiles as $key=>$destFile )
        //     {
        //         try {
        //             echo " $key\n ";
        //             $s3->putObjectAcl([
        //                 'Bucket' => $this->ssg->config['aws']['bucket'],
        //                 'Key'    => $key,
        //                 'ACL'    => 'public-read'
        //             ]);
        //             $dir = dirname($key);
        //         } catch (\Aws\S3\Exception\S3Exception $e) {
        //             $this->log("Sync: There was an error setting ACL for $key.\n");
        //         }
        //    }
    }


    public function syncRedirects()
    {
        // $rr = 0;
        foreach ( $this->ssg->source->redirects as $redirect )
        {
            $this->ssg->s3->putObject([
                'Bucket' => $this->ssg->config['aws']['bucket'],
                'Key'    => ltrim($redirect['source_path'],'/ '),
                'WebsiteRedirectLocation' => $redirect['target']
            ]);
            // $rr++;
        }
        // echo "\n\nsynced redirects: $rr\n\n";
        return true;
        /// assume renderer put an html file with a redirect in the html - honor those
        // $sourceFiles = $this->getFilesInDir($this->source);
        // foreach ( $sourceFiles as $key=>$sourceFile )
        // {
        //     $html = file_get_contents($sourceFile['path']);
        //     if ( !stristr($html,'http-equiv="refresh"') ) { continue; }
        //     $m = [];            
        //     $isRedirectPage = preg_match("/http\-equiv=\"refresh\"\s+content=\"\d+;url=\'?(.*?)\'?\" \/\>/",$html,$m);
        //     if ( !$isRedirectPage || empty($m[1]) ) { continue; }
        //     $dest = $m[1];
        //     if ( !preg_match('/^(http|\/)/',$dest) ) 
        //     { 
        //         $this->log("Sync Redirect invalid: $key => $dest\n");
        //         continue; 
        //     }
        //     $this->log("Sync Redirect: $key => {$dest}\n");
        //     $s3->putObject([
        //         'Bucket' => $this->ssg->config['aws']['bucket'],
        //         'Key'    => $key,
        //         'WebsiteRedirectLocation' => $dest
        //     ]);
        //     $rr++;
        // }
    }

}