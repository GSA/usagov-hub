<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to protect us against any Cross-Site-Scripting
    vulnerability of any kind.

    In here we will watch out of any JavaScript keywords in the request, and kill
    the PHP-thread before Drupal bootstraps.

    Note; This script might be a bit overkill

*/

xssValidate($_SERVER['QUERY_STRING']);

function xssValidate( $data )
{
    // Common JavaScript-events, banned from within the URL-request
    $bannedParameters = array(
        "<script",
        "/script>",
        "xmlns",
        "onabort",
        "onblur",
        "onchange",
        "onerror",
        "onfocus",
        "onload",
        "onmouseover",
        "onmouseout",
        "onselect",
        "onsubmit",
        "onunload",
        "onfocusin",
        "onfocusout",
        "onactivate",
        "onclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "javas",
        "java:",

        // <script> tag base64 encoded
        "PHNjcmlw",
        "PC9zY3Jpc",

        //"netsparker",
    );
    // Get the requested URL, al ong with it URL-decoded in a few different common way
    $checks = array();
    $checks[] = strtolower( $data );
    $checks[] = str_replace( ' ', '', urldecode($checks[0]) );
    $checks[] = html_entity_decode($checks[0], ENT_QUOTES | ENT_HTML5 | ENT_IGNORE, 'UTF-8');
    // Check every version of this URL-request (every decoded version)
    foreach ( $checks as $check ) {
        // Block against any attempt to use the <script> html-tag or quotes in the URL-request
        if ( drupal_validate_utf8($check) === false ) {
            xssAttackDetected('UTF8 encoded characters');
            return false;
        }
        // we need to allow JavaScript-assets to work
        if ( stripos($check, 'autocomplete') === false ) {
            // Block against any attempt to use any of the $bannedParameters in the URL-request
            foreach( $bannedParameters as $bannedParameter ) {
                if ( stripos($check, $bannedParameter) !== false ) {
                    xssAttackDetected($bannedParameter);
                    return false;
                }
            }
        }
    }
    return true;
}

function xssAttackDetected( $invalidData )
{
    /// dale thinks 403 is safer as some pages may stop working silently
    /// but I want the login page to continue loading at least w/o params

    error_log('XSS DETECTED invalid='.$invalidData.' from uri='. $_SERVER['REQUEST_URI'] );

    while (@ob_end_clean());
    header("HTTP/1.0 403 Forbidden - XSS Detected");
    exit('<html xmlns="http://www.w3.org/1999/xhtml"><head><title>403 Forbidden</title></head><body><h1>Forbidden</h1><p>The requested URL contains invalid characters and will not be processed.</p></body></html>');

    // $_SERVER['REQUEST_URI']=preg_replace('/?.*$/','',$_SERVER['REQUEST_URI']);
    // $_SERVER['argv']=[];
    // $_SERVER['QUERY_STRING']='';
}
/**/
