<?php

/**
 * @file
 * The PHP page that serves all page requests on a Drupal installation.
 *
 * The routines here dispatch control to the appropriate handler, which then
 * prints the appropriate page.
 *
 * All Drupal code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt.
 */

// Test to see if the request is for a static .css/.js file
$ext = substr($_SERVER['REQUEST_URI'], -3);
if ( $ext === '.js' || $ext === '.css' ) {

    // Now test if the file exists
    /* KEEP THIS TEST CONDITION SEPARATE - I am assuming a disk-ping is 
    slower than string manipulation/comparison */
    $ruri = ltrim($_SERVER['REQUEST_URI'], '/');
    if ( file_exists($ruri) ) {

        // Set headers
        switch ( $ext ) {
            case '.js':
                header('Content-Type: application/javascript', true);
                break;
            case 'css':
                header("Content-type: text/css", true); 
                break;
        }

        readfile($ruri);
        exit();
    }
}

/**
 * Root directory of Drupal installation.
 */
define('DRUPAL_ROOT', getcwd());

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
menu_execute_active_handler();
