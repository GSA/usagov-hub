<?php

namespace ctac\ssg;

class DataSource
{
    use LoggingTrait;

	public $ssg;
	public $entities;
	public $redirects;
	public $freshData;
    public $updateData;
    public $dataPullTime;

	public function __construct( &$ssg )
	{
		$this->ssg          = $ssg;
		$this->entities     = [];
		$this->redirects    = [];
		$this->freshData    = false;
        $this->updateData   = true;
	}

	public function pull( $since=0 )
	{
        // if ( !$this->getEntities($since) )
        // {
        //     return false;
        // }
        $this->getEntities($since);
        $this->getRedirects();
        return true;
	}

	public function getEntities( $since=0 )
	{
		$this->entities     = [];
        return true;
	}

	public function getRedirects()
	{
        $this->redirects    = [];
        return true;
	}


    public function loadData()
    {
        $success    = false;
        $sourceFail = false;
        // JKH look at the comment below, I don't think that this question was answered....
        // so because the deletes are not working, for the time being I'm just going 
        // to put a flag here so that it updates every time...
        if ( $this->freshData || true)
        {
            /// if we want data from source - we might only need to update
            /// how do we know if we want totally new data or just updated
            $this->log("Data: loading fresh from source ... ");
            if ( $this->loadDataFromSource() ) 
            {
                $this->log("done\n");
            } else {
                $sourceFail = true;
            }
        }

        $this->log("Data: loading from cache ... ");
        if ( $this->loadDataFromCache()  ) 
        { 
            $this->log("done\n");
            $success = true;
        } else {
            $this->log("not found\n");
            if ( !$sourceFail )
            {   
                $this->log("Data: loading from source ... ");
                if ( $this->loadDataFromSource() ) 
                {
                    $this->log("done\n");
                } else {
                    $this->log("fail\n");
                }
            }
        }

        if ( $this->updateData )
        {
            $this->log("Data: updating\n");
            if ( $this->updateDataFromSource() ) 
            {
                $this->log("Data: updating ... done\n");
                return true;
            } else {
                $this->log("Data: updating ... fail\n");
                return false;
            }
        }
        
        return true;
    }
    public function updateDataFromSource()
    {
        $pulled = $this->pull($this->dataPullTime);
        if ( !$pulled )
        {
            return false;
        }
        return $this->storeDataInCache();
    }
    public function loadDataFromSource()
    {
        $pulled = $this->pull();
        if ( !$pulled )
        {
            return false;
        }
        return $this->storeDataInCache();
    }
    public function loadDataFromCache()
    {
        $cacheFile = $this->ssg->cacheDir.'/'.$this->ssg->config['siteName'].'.cache';
        if ( !file_exists($cacheFile) || !is_readable($cacheFile) ) { return false; }

        $lock = fopen($cacheFile, 'rb');
        @flock($lock, LOCK_SH);
        $cache = unserialize(file_get_contents($cacheFile));
        @flock($lock, LOCK_UN);
        fclose($lock);

        if ( empty($cache) || !array_key_exists('entities',$cache) ) { return false; }
        $this->dataPullTime = !empty($cache['time']) ? $cache['time'] : 0;
        $this->entities     = $cache['entities'];
        if ( array_key_exists('redirects', $cache) )
        {
            $this->redirects     = $cache['redirects'];
        }
        return true;
	}
	
	public function storeDataInCache()
    {
        $cacheFile = $this->ssg->cacheDir.'/'.$this->ssg->config['siteName'].'.cache';
        if ( !file_exists($cacheFile) )
        {
            touch($cacheFile);
        }
        if ( !is_writable($cacheFile) ) 
        { 
            chmod($cacheFile,0644);
        }
        $cache = serialize([
            'time'         => $this->dataPullTime,
            'entities'     => $this->entities, 
            'redirects'    => $this->redirects
        ]);
        $bytes = file_put_contents($cacheFile, $cache, LOCK_EX);
        return !empty( $bytes );
    }
}
