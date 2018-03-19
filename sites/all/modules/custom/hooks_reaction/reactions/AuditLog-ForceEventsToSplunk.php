<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to hook onto certain events and make sure that they
    get sent to Splunk for audit-log recording purposes - this can easily be done via
    a call to error_log(), which with our [CMP-2.0 setup], gets shoveled right into
    Splunk.
*/

/**
 * implements HOOK_user_login()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_user_login',
    function (&$edit, $account) {

        _auditlog_pushMessageToSplunk('Login and SecureAuth authentication successful ');
    }
);

/**
 * implements HOOK_user_logout()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_user_logout',
    function ($account) {

        _auditlog_pushMessageToSplunk('Logout processed ');
    }
);

/**
 * implements HOOK_node_insert()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_node_insert',
    function ($node) {

        // Bail on garbage-in
        if ( empty($node->title) || empty($node->type) ) return;

        _auditlog_pushMessageToSplunk("A new {$node->type} content-item (\"{$node->title}\") was newly created ");
    }
);

/**
 * implements HOOK_node_update()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_node_update',
    function ($node) {

        // Bail on garbage-in
        if ( empty($node->title) || empty($node->type) ) return;

        _auditlog_pushMessageToSplunk(
            "An existing {$node->type} content-item (\"{$node->title}\") was edited ",
            ". Refer to the version tab of node {$node->nid} within the CMP for what changes were made. "
        );
    }
);

/**
 * implements HOOK_node_delete()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_node_delete',
    function ($node) {

        // Bail on garbage-in
        if ( empty($node->title) || empty($node->type) ) return;

        _auditlog_pushMessageToSplunk(
            "A {$node->type} content-item (\"{$node->title}\") was deleted ",
            ". Its node-ID was {$node->nid}"
        );
    }
);

/**
 * implements HOOK_node_insert()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_taxonomy_term_insert',
    function ($term) {

        // Bail on garbage-in
        if ( empty($term->name) ) return;

        _auditlog_pushMessageToSplunk("A term (\"{$term->name}\") was newly created ");
    }
);

/**
 * implements HOOK_node_update()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_taxonomy_term_update',
    function ($term) {

        // Bail on garbage-in
        if ( empty($term->name) ) return;

        _auditlog_pushMessageToSplunk(
            "An existing (\"{$term->name}\") was edited ",
            ". Refer to the version tab of term {$term->tid} within the CMP for what changes were made. "
        );
    }
);

/**
 * implements HOOK_term_delete()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_taxonomy_term_delete',
    function ($term) {

        // Bail on garbage-in
        if ( empty($term->name) ) return;

        _auditlog_pushMessageToSplunk(
            "A term (\"{$term->name}\") was deleted ",
            ". Its term-ID was {$term->tid}"
        );
    }
);


/**
 * implements HOOK_user_insert()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_user_insert',
    function (&$edit, $account, $category) {

        // Bail on garbage-in
        if ( empty($account->name) || !is_object($account) ) return;

        _auditlog_pushMessageToSplunk("A new Drupal-account (\"{$account->name}\") was newly created ");
    }
);

/**
 * implements HOOK_user_insert()
 *
 * In here we will record this event into Splunk via error_log().
 */
hooks_reaction_add('HOOK_user_cancel',
    function ($edit, $account, $method) {

        // Bail on garbage-in
        if ( empty($account->name) || !is_object($account) ) return;

        _auditlog_pushMessageToSplunk("A Drupal-account (\"{$account->name}\") was deleted ");
    }
);


/**
 * string _auditlog_pushMessageToSplunk()
 *
 * This is a wrapper function to pushing a string of text to Splunk.
 *
 * All of our audit log things should go through this so that we have
 * a single point of control in code.
 */
function _auditlog_pushMessageToSplunk($msgPre, $msgPost = '') {

    // Don't bother reacting when then ETL-script is running...
    // WARNING: FYI; The following IF-condition will pass (TRUE) when flushing cache through Drush
    if ( drupal_is_cli() && function_exists('drush_main') ) return;

    // Compile complete message
    $msg = $msgPre . _auditlog_getUserLogString() . $msgPost;

    // All error_log() calls should automatically go into Splunk in the CMP-2.0 system
    error_log($msg);
}

/**
 * string _auditlog_getUserLogString()
 *
 * A small function to obtain what string of text shall be placed into the audit-log
 * that describes the user. Returns a string. Utilizes static caching for multiple
 * calls within the same thread.
 */
function _auditlog_getUserLogString() {

    // Return from static cache when available
    static $ret = '';
    if ( !empty($ret) ) return $ret;

    // Bail if this is somehow an unauthenticated or non, user
    if ( empty($GLOBALS['user']) || !is_object($GLOBALS['user']) ) return '';
    $user = $GLOBALS['user'];
    if ( empty($user->name) ) return '';

    $ret = "by user {$user->uid} ({$user->name})";
    return $ret;
}
