<?php

/**
 * @file
 * Handles incoming requests to fire off regularly-scheduled tasks (cron jobs).
 */

// Inform this Dev that cron has started
dispatchCronEmail('dfrey@ctacorp.com', 'dfrey@ctacorp.com', 'CMP Cron', 'Cron Started');

/**
 * Root directory of Drupal installation.
 */
define('DRUPAL_ROOT', getcwd());

include_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

if (!isset($_GET['cron_key']) || variable_get('cron_key', 'drupal') != $_GET['cron_key']) {
  watchdog('cron', 'Cron could not run because an invalid key was used.', array(), WATCHDOG_NOTICE);
  drupal_access_denied();
}
elseif (variable_get('maintenance_mode', 0)) {
  watchdog('cron', 'Cron could not run because the site is in maintenance mode.', array(), WATCHDOG_NOTICE);
  drupal_access_denied();
}
else {
  drupal_cron_run();
}

// Inform this Dev that cron has started
dispatchCronEmail('dfrey@ctacorp.com', 'dfrey@ctacorp.com', 'CMP Cron', 'Cron Ended');



function dispatchCronEmail($to, $sendermail, $subject, $message, $files = array()) {
    
    // Debugging verbosity
    if ( strpos($_SERVER['REQUEST_URI'], '-DEBUG-DISPATCHEMAIL-STARTFIN-WATCH-') !== false ) {
        dsm("dispatchEmail triggered");
    }
    
    // State if this message is comming from an REI environment or not
    if ( function_exists('version_awareness_environment_isproduction') && version_awareness_environment_isproduction() !== true ) {
        $message = 
            '<span style="color: red;">NOTICE: The following message was dispatched from the ' . version_awareness_env() . ' environment.<br/>' . 
            'This notice will not be prepended when the message comes from the production/staging environment</span>' . 
            '<br/><hr/><br/>' . 
            $message;
    }
    
    ini_set('sendmail_from', $sendermail);
    
    // email fields: to, from, subject, and so on
    $from = "BusinessUSA <".$sendermail.">"; 
    $headers = "From: $sendermail";
 
    // boundary 
    $semi_rand = md5(time()); 
    $mime_boundary = "==Multipart_Boundary_x{$semi_rand}x"; 
 
    // headers for attachment 
    $headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\""; 
 
    // multipart boundary 
    $message = "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"iso-8859-1\"\n" .
    "Content-Transfer-Encoding: 7bit\n\n" . $message . "\n\n"; 
 
    // preparing attachments
    for ( $i = 0 ; $i < count($files) ; $i++ ) {
        if ( is_file($files[$i]) ) {
            $message .= "--{$mime_boundary}\n";
            $fp =    @fopen($files[$i], "rb");
            $data =    @fread( $fp, filesize($files[$i]) );
            @fclose($fp);
            $data = chunk_split( base64_encode($data) );
            $message .= "Content-Type: application/octet-stream; name=\"".basename($files[$i])."\"\n" . 
            "Content-Description: ".basename($files[$i])."\n" .
            "Content-Disposition: attachment;\n" . " filename=\"".basename($files[$i])."\"; size=".filesize($files[$i]).";\n" . 
            "Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
        }
    }
    $message .= "--{$mime_boundary}--";
    
    if ( !function_exists('version_awareness_environment_isproduction') || version_awareness_environment_isproduction() !== true ) {
        $returnpath = "-f" . $sendermail;
    }
    
    // Dispatch email - debugging and verbosity
    $debug['mail-arguments'] = array(
        'to' => $to, 
        'subject' => $subject, 
        'message' => $message, 
        'headers' => $headers, 
        'returnpath' => $returnpath
    );
    
    // Dispatch email - trigger the native PHP function: mail() 
    $ok = @mail($to, $subject, $message, $headers, $returnpath);
    $debug['mail-return'] = $ok;

    // Further debug and verbosity
    if ( strpos($_SERVER['REQUEST_URI'], '-DEBUG-DISPATCHEMAIL-VERBOSE-') !== false ) {
        dsm($debug);
    }
    
    if ( strpos($_SERVER['REQUEST_URI'], '-DEBUG-DISPATCHEMAIL-STARTFIN-WATCH-') !== false ) {
        dsm("dispatchEmail will return $ok");
    }
    
    return $debug;
}