<?php /*

    [--] PURPOSE [--]

    The purpose of this script is to alter the Log-In form as needed. I this scrupt we shall;
        *
        *
        *

    [--] TICKETS AND HISTORY HISTORY [--]

    2015-??-?? (a previous tick involving GSA [internal] Secure-Auth)
    2015-07-08 Relocated previously made code from cmp_misc.module into this [new] fiel for organization sake.
    2015-07-08 usagov-100558 - Beginning to implement [External] Secure-Auth

*/

/**
 * Implements hook_form_FORM_ID_alter
 *
 * For docs, see: https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_form_FORM_ID_alter/7
 * Here we will disable access to the password-reset form.
 */
hooks_reaction_add(
    array(
        'HOOK_form_user_pass_alter',           # this is HOOK_form_FORM_ID_alter for the user_pass form
        'HOOK_form_user_pass_block_alter',     # this is HOOK_form_FORM_ID_alter for the user_pass_block form
    ),
    function (&$form, &$form_state, $form_id) {

        // These hooks only fire for the password-reset form, which we want disabled
        header('HTTP/1.0 403 Forbidden');
        exit('Service disabled');
    }
);

/**
 * Implements HOOK_form_FORM_ID_alter
 *
 * For docs, see: https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_form_FORM_ID_alter/7
 */
hooks_reaction_add(
    array(
        'HOOK_form_user_login_alter',           # this is HOOK_form_FORM_ID_alter for the user_login form
        'HOOK_form_user_login_block_alter',     # this is HOOK_form_FORM_ID_alter for the user_login_block form
    ),
    function (&$form, &$form_state, $form_id) {

        // Force the login process to only be accessible over HTTPS
        if ( empty($_SERVER['HTTPS']) ) {

            @ob_end_clean();
            while(@ob_end_clean());
            header('Location: https://'.$_SERVER['HTTP_HOST'].request_uri());
            http_response_code(301);
            drupal_add_http_header('Location', 'https://'.$_SERVER['HTTP_HOST'].request_uri());
            exit();
        }

        // Only show the SecureAuth login link, unless the right key is provided, then show full form
        if ( strpos($_SERVER['REQUEST_URI'], getenv('CMP_DRUPAL_AUTH_NONCE')) === false && getenv('CMP_DRUPAL_ENVIRONMENT_NAME')!=='Local' ) {

            drupal_set_title('Authentication Required');

            // Remove all the [common] elements from the login form
            unset($form['name']);
            unset($form['pass']);
            unset($form['actions']);
            unset($form['links']);
            unset($form['#submit']);
            unset($form['form_build_id']);
            unset($form['form_id']);

            // Display a welcome-message for humans - push a new element into the beginning of the $form
            $form = array_merge(
                array(
                    'welcome' => array(
                        '#type' => 'item',
                        '#markup' => 'Authentication is requiered to access this system, please '
                            .'sign-in thorugh one of the options below.',
                        '#weight' => -1
                    )
                ),
                $form
            );

            // Add in a place-marker for the Ext-Login @TODO
            /*$form['saml_sp_drupal_login_links']['#items'][] = array(
                'data' => '<a href="#">Log in for users external to GSA</a>'
            );*/

            // Hide the breadcrumb, and "Log in / Req. new password" tabs
            drupal_add_css(".breadcrumb, ul.tabs.primary { display: none !important; }", "inline");

            // Change the displayed text for the [Internal]-GSA-SecureAuth link
            drupal_add_js(
                "
                    jQuery(document).ready( function () {
                        jQuery('.saml-link a').text('Log in with your GSA-ENT account');
                    });
                ",
                'inline'
            );

        }

    }
);
