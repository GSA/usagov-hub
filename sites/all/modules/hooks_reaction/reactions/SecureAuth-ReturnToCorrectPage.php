<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script to alter the "Log in through GSA Secure-Auth" link such that it points to the correct location.
    Previous to this script, the link almost always points to: /saml/drupal_login?returnTo=user
    Which is incorrect, the "returnTo=user" par is incorrect.

    [--] TECHNICAL NOTES [--]

    * This "Log in through GSA Secure-Auth" link is generated from the saml_sp_drupal_login module
    * This "Log in through GSA Secure-Auth" link is generated from the saml_sp_drupal_login_form_user_login_alter() function
    * Hence this "Log in through GSA Secure-Auth" link is present in the form: user_login
    * We are using a HOOK_form_user_login_alter() implementation in this file [below] to fix the incorrect link [href]
    * WE MUST USE HOOK_module_implements_alter() in this script to ensure our HOOK_form_user_login_alter() implementation is triggered LAST

    [--] TICKET HISTORY [--]

    2015-05-11 - Created to resolve ticket: usagov-100287: "When logging into the CMS via SecureAuth, we're always taken to our user profile screen"
        
*/

/**
 * Implements HOOK_module_implements_alter().
 *
 * Ensure the HOOK_form_user_login_alter() hook is triggered AFTER the 
 * saml_sp_drupal_login_form_user_login_alter() hook.
 */
hooks_reaction_add("module_implements_alter",
    function (&$implementations, $hook) {

        if ( $hook === 'form_alter' && isset($implementations['hooks_reaction']) ) {

            /* Move my HOOK_form_user_login_alter implementation to the end of the list.
             module_implements() iterates through $implementations with a foreach 
             loop which PHP iterates in the order that the items were added, so to move 
             an item to the end of the array, we remove it and then add it. */

            // While this file/script is a "submodule", Drupal still perceives it as the "hooks_reaction" module
            $group = $implementations['hooks_reaction'];
            unset($implementations ['hooks_reaction']);
            $implementations ['hooks_reaction'] = $group;
        }
    }
);

/**
 * Implements hook_form_alter().
 *
 * The saml_sp_drupal_login module creates the "Log in using GSA_SecureAuth" link incorrectly...
 * We will modify this link here.
 */
hooks_reaction_add("form_user_login_alter",
    function (&$form, &$form_state) {

        // If the saml_sp_drupal_login is on, and is is configured, then we expect a form element [here].
        if ( !empty($form['saml_sp_drupal_login_links']['#items'][0]['data']) ) {

            // This is [should be] the "Log in using GSA_SecureAuth" link in the form
            $linkHTML = $form['saml_sp_drupal_login_links']['#items'][0]['data'];

            // This is where the link SHOULD REALLY point to
            if ( trim(request_uri(), '/') === '' ) {
                $correctReturn = 'returnTo=/';
            } else {
                $correctReturn = 'returnTo=' . ltrim(request_uri(), '/');
            }

            // String-replace for correction
            $linkHTML = str_replace('returnTo=user', $correctReturn, $linkHTML); // Almost always the incorrect default
            $linkHTML = str_replace('returnTo=/node/462', $correctReturn, $linkHTML); // The Not Found Basic-Page

            // Replace this link in the form with its fixed-version
            $form['saml_sp_drupal_login_links']['#items'][0]['data'] = $linkHTML;
        }

    }
);

/**
 * Implements hook_form_alter().
 *
 * The saml_sp_drupal_login module creates the "Log in using GSA_SecureAuth" link incorrectly...
 * We will modify this link here.
 */
hooks_reaction_add("form_user_login_block_alter",
    function (&$form, &$form_state) {

        // If the saml_sp_drupal_login is on, and is is configured, then we expect a form element [here].
        if ( !empty($form['saml_sp_drupal_login_links']['#items'][0]['data']) ) {

            // This is [should be] the "Log in using GSA_SecureAuth" link in the form
            $linkHTML = $form['saml_sp_drupal_login_links']['#items'][0]['data'];

            // This is where the link SHOULD REALLY point to
            if ( trim(request_uri(), '/') === '' ) {
                $correctReturn = 'returnTo=/';
            } else {
                $correctReturn = 'returnTo=' . ltrim(request_uri(), '/');
            }

            // String-replace for correction
            $linkHTML = str_replace('returnTo=user', $correctReturn, $linkHTML); // Almost always the incorrect default
            $linkHTML = str_replace('returnTo=/node/462', $correctReturn, $linkHTML); // The Not Found Basic-Page

            // Replace this link in the form with its fixed-version
            $form['saml_sp_drupal_login_links']['#items'][0]['data'] = $linkHTML;
        }

    }
);
