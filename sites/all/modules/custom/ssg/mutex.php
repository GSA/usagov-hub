<?php
/**
 * mutex.php
 *
 * php mutex for SSG
 * @author Jeff Hendrickson JKH <jhendrickson@ctacorp.com>
 * @version 1.0
 * @package SSG
 */

class Mutex {

   var $writeablePath = '';
   var $lockName = '';
   var $fileHandle = null;

   public function __construct($lockName, $writeablePath = null) {
      $this->lockName = preg_replace('/[^a-z0-9\-]/', '', $lockName);
      if ($writeablePath == null) {
         $this->writeablePath = sys_get_temp_dir();
      }
      else {
         $this->writeablePath = $writeablePath;
      }
   }

   public function getLock() {
      return flock($this->getFileHandle() , LOCK_EX);
   }

   public function getFileHandle() {
      if ($this->fileHandle == null) {
         $this->fileHandle = fopen($this->getLockFilePath() , 'c');
      }
      return $this->fileHandle;
   }

   public function releaseLock() {
      $success = flock($this->getFileHandle() , LOCK_UN);
      fclose($this->getFileHandle());
      return $success;
   }

   public function getLockFilePath() {
      return $this->writeablePath . DIRECTORY_SEPARATOR . $this->lockName;
   }

   public function isLocked() {
      $fileHandle = fopen($this->getLockFilePath() , 'c');
      $canLock = flock($fileHandle, LOCK_EX | LOCK_NB);
      if ($canLock) {
         flock($fileHandle, LOCK_UN);
         fclose($fileHandle);
         return false;
      }
      else {
         fclose($fileHandle);
         return true;
      }
   }
}

