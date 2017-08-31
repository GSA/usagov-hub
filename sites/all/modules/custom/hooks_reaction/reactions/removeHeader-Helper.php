<?php /*

    [--] PURPOSE [--]
    
    @TODO

    [--] TICKET HISTORY [--]

    @TODO

*/

/**
 * Implements HOOK_template_preprocess_html().
 *
 * Here, we will reaction on the html.tpl.php template BEFORE it gets rendered.
 * We will watchout for situations where the URL to this pages contains a ?hideHeader=1
 * in such a situation, we will apply CSS declarations to hide the header.
 */
hooks_reaction_add("HOOK_preprocess_html",
    function (&$variables) {

        // We only want to reaction when there is a ?hideHeader=1 in the URL-query
        if ( empty($_GET['hideHeader']) ) return;

        // HIde the header areas
        drupal_add_css(
            '
                #admin-menu {
                    display: none !important;
                }
                #branding {
                    display: none !important;
                }
                .slicknav_menu{
                    display: none !important;
                }
            ',
            'inline'
        );
    }
);
