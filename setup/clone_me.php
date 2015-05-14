<?php /*

    [!!] WARNING [!!]

    This script MUST exist (expects to be) in the <DrupalRoot>/setup folder

    [--] PURPOSE [--]

    This script is used by other Drupal environments that wish to clone themselves from this one.
    Essentially all this script does is print out a MySQL dump of the Drupal database

    [--] DEV NOTES [--]

    This script can be run in or outside of Drupal. Code in this script should assume this 
    possibility, and not be dependant on Drupal.

*/


// If this script was executed from the command-line-interface
if ( php_sapi_name() == "cli" ) {

    // then automatically run printMySqlDumpForCloningMe()
    printMySqlDumpForCloningMe();

} else {

    /* otherwise Drupal is probably bootstrapped, and we just want to declare 
    the printMySqlDumpForCloningMe() function */
}


/**
 * void printMySqlDumpForCloningMe()
 *
 * Prints a MySQL dump of this Drupal database to StdOut/the-browser
 * This function is not dependant on Drupal.
 */
function printMySqlDumpForCloningMe() {

    // Assuming bootstrap, kill anything that Drupal tried to print so far (if anything)
    @ob_end_clean();
    while ( @ob_end_clean() );

    // Because we can't guarantee Drupal is bootstrapped, change directory to Drupal-root, and include settings.php
    chdir( dirname(__DIR__) ); // Changes directory up one from this running script - from ~/setup into ~/
    include_once('sites/default/settings.php');

    // HTTP Response Headers
    header('Content-Type: text');
    header('Content-Disposition: attachment; filename="Drupal_'.date('Y-m-d').'.sql"');

    // Get the MySQL connection information for this Drupal database (loaded from settings.php)
    $dbAuth = $GLOBALS["databases"]["default"]["default"];
    $dbHost = $dbAuth["host"];
    $dbUser = $dbAuth["username"];
    $dbPass = $dbAuth["password"];
    $dbDatabase = $dbAuth["database"];

    // Trigger MySQL dump
    $sysCommand = "mysqldump --single-transaction --skip-add-locks --host={$dbHost} '--user={$dbUser}' '--password={$dbPass}' {$dbDatabase} ";
    passthru($sysCommand); // Run the system command piping StdOut to the browser

}
