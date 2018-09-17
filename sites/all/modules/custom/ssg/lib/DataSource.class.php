<?php

namespace ctac\ssg;

class DataSource
{
	public $ssg;
	public $entities;
	public $entitiesById;
	public $redirects;
	public $freshData;
    public $updateData;
    public $dataPullTime;

	public function __construct( &$ssg )
	{
		$this->ssg          = $ssg;
		$this->entities     = [];
   		$this->entitiesById = [ 'tid'=>[], 'nid'=>[] ];
		$this->redirects    = [];
		$this->freshData    = false;
		$this->updateData   = true;
	}

	public function pull( $since=0 )
	{
		$this->getEntities($since);
		$this->getRedirects();
	}

	public function getEntities( $since=0 )
	{
		$this->entities     = [];
		$this->entitiesById = [ 'tid'=>[], 'nid'=>[] ];
	}

	public function getRedirects()
	{
		$this->redirects    = [];
	}


    public function loadData()
    {
        if ( $this->freshData )
        {
            /// if we want data from source - we might only need to update
            /// how do we know if we want totally new data or just updated
            $this->ssg->log("Data: loading fresh from source ... ");
            if ( $this->loadDataFromSource() ) 
            {
                $this->ssg->log("done\n");
            }
        }

        $this->ssg->log("Data: loading from cache ... ");
        if ( $this->loadDataFromCache()  ) 
        { 
            $this->ssg->log("done\n");
        } else {
            $this->ssg->log("not found\n");
            if ( !$sourceFail )
            {   
                $this->ssg->log("Data: loading from source ... ");
                if ( $this->loadDataFromSource() ) 
                {
                    $this->ssg->log("done\n");
                } else {
                    $this->ssg->log("fail\n");
                }
            }
        }

        if ( $this->updateData )
        {
            $this->ssg->log("Data: updating\n");
            if ( $this->updateDataFromSource() ) 
            {
                $this->ssg->log("Data: updating ... done\n");
            } else {
                $this->ssg->log("Data: updating ... fail\n");
            }
        }
        return false;
    }
    public function updateDataFromSource()
    {
        $this->pull($this->dataPullTime);
        return $this->storeDataInCache();
    }
    public function loadDataFromSource()
    {
        $this->pull();
        return $this->storeDataInCache();
    }
    public function loadDataFromCache()
    {
        $cacheFile = $this->ssg->cacheDir.'/'.$this->ssg->siteName.'.cache';
        if ( !file_exists($cacheFile) || !is_readable($cacheFile) ) { return false; }

        $lock = fopen($cacheFile, 'rb');
        @flock($lock, LOCK_SH);
        $cache = unserialize(file_get_contents($cacheFile));
        @flock($lock, LOCK_UN);
        fclose($lock);

        if ( empty($cache)
            || !array_key_exists('entities',     $cache)
            || !array_key_exists('entitiesById', $cache)
        ) { return false; }
        $this->dataPullTime = !empty($cache['time']) ? $cache['time'] : 0;
        $this->entities     = $cache['entities'];
        $this->entitiesById = $cache['entitiesById'];
        if ( array_key_exists('redirects', $cache) )
        {
            $this->redirects     = $cache['redirects'];
        }
        return true;
	}
	
	public function storeDataInCache()
    {
        $cacheFile = $this->ssg->cacheDir.'/'.$this->ssg->siteName.'.cache';
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
            'entitiesById' => $this->entitiesById,
            'redirects'    => $this->redirects
        ]);
        $bytes = file_put_contents($cacheFile, $cache, LOCK_EX);
        return !empty( $bytes );
    }
}
