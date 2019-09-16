<?php
//
// JKH note: changed the "log" column type to LONGBLOB 08/09/19
//
namespace ctac\ssg;

// $GLOBALS['logMessage'] = '';

trait LoggingTrait
{
    public $ssg;

    public function runtimeEnvironment()
    {
        if ( function_exists('variable_get') )
        {
            return 'drupal';
        }
        return 'standalone';
    }

    public function log($msg,$debugOnly=true)
    {
        // $GLOBALS['logMessage']  .= $msg;

        if ( $this->runtimeEnvironment() == 'drupal' )
        {
            if ( isset($this->ssg) && !empty($this->ssg->uuid) )
            {
                $uuid = $this->ssg->uuid;
            } else if ( !empty($this->uuid) ) {
                $uuid = $this->uuid;
            }
            if ( !empty($uuid) )
            {
                $result = db_query("
                    UPDATE {ssg_builds} 
                    SET 
                        log=concat(ifnull(log,''), :log), 
                        updated=UNIX_TIMESTAMP() 
                    WHERE 
                        uuid=:uuid
                ",[
                    ':uuid'=>$uuid,
                    ':log'=>$msg
                ]);
                $msg = "SiteBuild:{$uuid} {$msg}";
            }
            if ( $debugOnly )
            {
                return;
            }
            error_log(preg_replace("/[\n\r\t\s]+$/",'',$msg));
        } else {
            echo "Not drupal " . $msg;
        }
    }

}