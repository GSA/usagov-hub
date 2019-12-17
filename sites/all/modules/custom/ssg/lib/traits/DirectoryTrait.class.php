<?php

namespace ctac\ssg;

trait DirectoryTrait
{

    public function prepareDir( &$path )
    {
        // error_log("\nprepare $path\n");
        // return $this->prepareDirShell($path);
        return $this->prepareDirPhp($path);
    }
    public function prepareDirPhp( &$path )
    {
        if ( empty($path) )
        {
            return false;
        }
        if ( !is_dir($path) )
        {
	        // JKH added to trace path ...
            // tracetofile(__FILE__,__LINE__,"path= $path\n");
            mkdir($path, 0744, true);
        }
        if ( !is_writable($path) )
        {
            chmod($path, 0744 );
        }
        $real_path = realpath($path);
        // $real_path = $path;
        if ( empty($real_path) )
        {
            return false;
        }
        if ( !is_dir($real_path) || !is_writable($real_path) )
        {
            return false;
        }
        // $path = $real_path;
        return true;
    }
    public function prepareDirShell( &$path )
    {
        if ( empty($path) )
        {
            return false;
        }
        $mkdir_cmd = "mkdir -p {$path}";
        $rslt = `{$mkdir_cmd} 2>&1`;

        $chmod_cmd = "chmod -R 744 {$path}";
        $rslt = `{$chmod_cmd} 2>&1`;

        if ( !is_dir($path) || !is_writable($path) )
        {
            return false;
        }

        return true;
    }

    public function rmDir( $path )
    {
        // error_log("\nremove $path\n");
        // return $this->rmDirShell($path);
        return $this->rmDirPhp($path);
    }
    public function rmDirPhp( $path )
    {
        if ( empty($path) )
        {
            return false;
        }
        $real_path = realpath($path);    
        if ( empty($real_path) ) { 
            return false;
        }
        
        if (is_dir($real_path)) {
            foreach (scandir($real_path) as $file) {
                if ($file != '.' && $file != '..') {
                    $this->rmDirPhp("$real_path/$file");
                }
            }
            rmdir($real_path);
        } elseif ( is_file($real_path) ) {
            unlink($real_path);
        } else {
            $this->log("WARNING: Cannot delete $real_path (unknown file type)\n");
            return false;
        }
        return true;
    }
    public function rmDirShell( $path )
    {
        if ( empty($path) )
        {
            return false;
        }
        $real_path = realpath($path);    
        if ( empty($real_path) || $real_path == '/' ) {
            return;
        }
        $remove_cmd = "rm -rf {$real_path}";
        // $this->log($remove_cmd."\n",false);
        $rslt = `{$remove_cmd} 2>&1`; //  > /dev/null
        return true;
    }


    public function copyDir($src, $dst, $perm=null)
    {
        // error_log("\ncopy $src $dst $perm\n");
        // return $this->copyShell($src,$dst,$perm);
        return $this->copyPhp($src,$dst,$perm);
    }
    public function copyPhp($src, $dst, $perm=null)
    {
        if ( empty($src) ) { 
            return;
        } else if (is_link($src)) {
            symlink(readlink($src), $dst);
        } elseif (is_dir($src)) {
            if ( !is_dir($dst) ) {
                mkdir($dst,0744,true);
            }
            if ( $perm ) { 
                chmod($dst,$perm); 
            }
            foreach (scandir($src) as $file) {
                if ($file != '.' && $file != '..') {
                    $this->copyPhp("$src/$file", "$dst/$file");
                }
            }
        } elseif ( is_file($src) ) {
            if ( !is_file($dst) ) {
                if ( !is_dir(dirname($dst)) ) {
                    mkdir(dirname($dst),0744,true);
                }
                touch($dst);
            }
            copy($src, $dst);
            if ( $perm ) { 
                chmod($dst,$perm); 
            }
        } else {
            $this->log("WARNING: Cannot copy $src (unknown file type)\n");
        }
    }
    public function copyShell($src, $dst)
    {
        $src = realpath($src);
        $dst = realpath($dst);

        if ( empty($src) ) { 
            return;
        }

        rtrim($src,'/ ');
        rtrim($dst,'/ ');

        $cp_cmd = "cp -Rf {$src}/* {$dst}/";
        $rslt = `{$cp_cmd} 2>&1`;
    }


    public function chmodDir($path, $perm)
    {
        // error_log("\nchmod $path $perm\n");
        // return $this->chmodShell($path,$perm);
        return $this->chmodPhp($path,$perm);
    }
    public function chmodPhp($path, $perm)
    {
        if ( empty($path) ) { 
            return;
        } else if (is_link($path)) {
            return;
        } elseif (is_dir($path)) {
            chmod($path,$perm);
            foreach (scandir($path) as $file) {
                if ($file != '.' && $file != '..') {
                    $this->chmodPhp("$path/$file",$perm);
                }
            }
        } elseif (is_file($path)) {
            chmod($path,$perm);
        } else {
            $this->log("WARNING: Cannot apply permissions to $path (unknown file type)\n");
        }
    }
    public function chmodShell($path, $perm)
    {
        $path = realpath($path);

        $chmod_cmd = "chmod -R {$perm} {$path}";
        $rslt = `{$chmod_cmd} 2>&1`;
    }

    public function chownDir($path)
    {
        // error_log("\nchown $path\n");
        // return $this->chownShell($path);
        return $this->chownPhp($path);
    }
    public function chownPhp($path)
    {
        $userid    = posix_geteuid();
        $userinfo  = posix_getpwuid($userid);
        $username  = $userinfo['name'];

        $groupid   = posix_getegid();
        $groupinfo = posix_getgrgid($groupid);
        $groupname = $groupinfo['name'];

        $path = realpath($path);

        if ( empty($path) ) { 
            return;
        } else if (is_link($path)) {
            return;
        } elseif (is_dir($path)) {
            @chown($path,$username);
            @chgrp($path,$groupname);
            foreach (scandir($path) as $file) {
                if ($file != '.' && $file != '..') {
                    $this->chownPhp("$path/$file");
                }
            }
        } elseif (is_file($path)) {
            @chown($path,$username);
            @chgrp($path,$groupname);
        } else {
            $this->log("WARNING: Cannot apply ownership to $path (unknown file type)\n");
        }
    }
    public function chownShell($path)
    {
        $userid    = posix_geteuid();
        $userinfo  = posix_getpwuid($userid);
        $username  = $userinfo['name'];

        $groupid   = posix_getegid();
        $groupinfo = posix_getgrgid($groupid);
        $groupname = $groupinfo['name'];

        $path = realpath($path);

        $chown_cmd = "chown -R {$username}:{$groupname} {$path}";
        $rslt = `{$chown_cmd} 2>&1`;
    }

}
