#!/usr/bin/env php
<?php /*

    [!!] WARNING [!!]

    This script MUST exist (expects to be) in the <DrupalRoot>/setup folder

    [--] PURPOSE [--]

    This script is used to grab a Drupal database from another site and pull it into this one.

    [--] @TODO [--]

    I am assuming at some point in time we will want to make this script trigger sync_vars.php on completion

*/

// If this script should be executed ONLY from the command-line (for security reasons)
if ( php_sapi_name() != "cli" ) {

    @header('Content-Type: text');
    @ob_end_clean();
    while ( @ob_end_clean() );
    exit("This script is meant to be run from the command-line, not the browser\n");
}

// Get arguments 
$target = $argv[ count($argv) - 1 ];
$strArgs = implode(' ', $argv);
if ( empty($target) || strpos($target, 'http') !== 0 || strpos($target, 'clone_me.php') === false ) {
    printHelpAndTerminate('Bad or empty target given: '.$target);
}

// Get the targeted MySQL dump
if ( strpos($strArgs, '--verbose') !== false ) {
    print "Downloading SQL-dump from: {$target}\n";
}
$sqlDumpData = @file_get_contents($target);
if ( $sqlDumpData === false ) {
    printHelpAndTerminate('Could not obtain MySQL from target: '.$target);
}

// Because we Drupal is not bootstrapped, change directory to Drupal-root, and include settings.php
chdir( dirname(__DIR__) ); // Changes directory up one from this running script - from ~/setup into ~/
if ( file_exists('sites/default/settings.php') ) {
    include_once('sites/default/settings.php');
} else {
    printHelpAndTerminate(
        '../sites/default/settings.php not found - This script must be executed from '
        .'the <DrupalRoot>/setup/ directory.'
    );
}

// Get the MySQL connection information for the Drupal database (loaded from settings.php) for THIS machine
$dbAuth = $GLOBALS["databases"]["default"]["default"];
$dbHost = $dbAuth["host"];
$dbUser = $dbAuth["username"];
$dbPass = $dbAuth["password"];
$dbDatabase = $dbAuth["database"];

// Connect to the MySQL database on THIS machine
$mySqlLink = mysql_connect($dbHost, $dbUser, $dbPass);
if ( $mySqlLink === false ) {
    printHelpAndTerminate('Could not connect to local MySQL database.');
}

print "

========== [!!] WARNING [!!] ==========
EVERYTHING PAST THIS POINT IS UNTESTED
========== [!!] WARNING [!!] ==========

";

// Clear the database before sync
if ( strpos($strArgs, '--no-clean-db') === false ) {
    if ( strpos($strArgs, '--verbose') !== false ) {
        print "Dropping and recreating the local database...\n";
    }
    mysql_query("DROP DATABASE {$dbDatabase};");
    mysql_query("CREATE DATABASE {$dbDatabase};");
}

// Set database context (the USE command in MySQL)
mysql_select_db($dbDatabase, $mySqlLink);

// Consume
if ( strpos($strArgs, '--verbose') !== false ) {
    print "Loading database-image... ";
}
mysql_query($sqlDumpData);
if ( strpos($strArgs, '--verbose') !== false ) {
    print "done.\n";
}

function printHelpAndTerminate($errMessage = false) {

    print "\n"
        ."================================\n"
        ."== CMP Drupal Cloning Utility ==\n"
        ."================================\n"
        ."\n"
        ."Usage: sync_from [options] target\n"
        ."\n"
        ."Examples: \n"
        ."    ./sync_from 'https://usagov.platform.gsa.gov/clone_me.php'\n"
        ."    php -f sync_from.php 'https://usagov.platform.gsa.gov/clone_me.php'\n"
        ."    ./sync_from --no-clean-db 'https://usagov.platform.gsa.gov/clone_me.php'\n"
        ."\n"
        ."\n"
        ."--no-clean-db      Do not erase all tables in the db before sync.\n"
        ."--verbose          Prints status information during sync process.\n"
    ;

    if ( $errMessage !== false ) {
        print "\nError - ".$errMessage."\n\n";
    }

    exit();
}