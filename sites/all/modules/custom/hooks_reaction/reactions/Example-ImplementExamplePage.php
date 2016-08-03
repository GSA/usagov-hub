<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to provide an example on how to create reactions files in 
    this "reactions" directory. In your [newly created] reactions file(s), please follow this file as a template - please 
    include a "PURPOSE" section at the top of your file.
    
    Generally this area should contain a high-level, non-technical, description as to why this script/file was made. 

    [--] TECHNICAL NOTES [--]

    In your [newly created] reactions file(s), please also include this area in the first comment block as well.
    This is the same thing as the "purpose" section, but should be more technical.

    [!!] WARNING [!!]

    If you have any important information that that other developers must know about this script, please 
    include it in a [!!] WARNING [!!] section, also, please list this section ABOVE the "purpose" and 
    "technical notes" section.
        
*/

/**
 * Implements HOOK_menu().
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register http://YourWebSite.com/this/is/an/example/page to return a page generated from hookReactExamplePage()
        $menuArr['this/is/an/example/page'] = array(
            'title' => 'An Example-Page generated from a Hook-Reaction',
            'description' => 'An Example-Page generated from a Hook-Reaction',
            'page callback' => 'hookReactExamplePage',
            'access arguments' => array('access administration pages'),
            'type' => MENU_NORMAL_ITEM,
        );

        return $menuArr;
    }
);

/**
 * string hookReactExamplePage()
 *
 * A callback function for http://YourWebSite.com/this/is/an/example/page
 */
function hookReactExamplePage() {
    return "HELLO WORLD - This is an Example-Page generated from a Hook-Reaction in ".__FUNCTION__."()";
}