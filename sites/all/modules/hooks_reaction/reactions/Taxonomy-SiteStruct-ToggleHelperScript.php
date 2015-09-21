<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to:
        * Visually hide the "USA.gov Toggle URL"
        * Visually hide the "GobiernoUSA.gov Toggle URL"
        * Automatically update the 2 visually-hidden fields as the "English/Spanish Toggle" is updated

    This is done to simplify syncing, since living relations/references cant be brought over to 
    child-sites between site-trees (since each child-site only has their own relevant tree).


    [--] TECHNICAL NOTES [--]

    @TODO

*/

$GLOBALS['taxSiteStrucTogHelper_updateRefTerm'] = null;
$GLOBALS['taxSiteStrucTogHelper_noPostProc'] = false;

hooks_reaction_add(
    array(
        'HOOK_form_taxonomy_manager_form_alter',
        'HOOK_form_taxonomy_form_term_alter',
    ),
    function ($form, $form_state, $form_id) {

        drupal_add_css('.field-name-field-gobiernousa-gov-toggle-url { display: none; }', 'inline');
        drupal_add_css('.field-name-field-usa-gov-toggle-url { display: none; }', 'inline');
        drupal_add_css('.field-name-field-english-spanish-toggle .relation-add-wrapper label { display: none; }', 'inline');
        drupal_add_css('.field-name-field-english-spanish-toggle .relation-add-wrapper .form-type-checkbox { display: none; }', 'inline');
        drupal_add_css('.field-name-field-english-spanish-toggle .relation-add-wrapper { margin-left: 0px; }', 'inline');
    }
);

hooks_reaction_add('HOOK_taxonomy_term_presave',
    function ($term) {

        // We only care about Site-Structure taxonomy-terms here
        if ( empty($term->vocabulary_machine_name) || $term->vocabulary_machine_name !== 'site_strucutre_taxonomy' ) {
            return;
        }

        // Get the target referenced/toggle term-ID
        $targetRelationId = _taxSiteStructToggleHelper_getRefToggleTerm($term);

        // We only act when there is data supplied in the field_english_spanish_toggle field
        if ( $targetRelationId == false ) {
            return;
        }
        
        // We now must determin which field we are going to update; the "USA.gov Toggle URL" or "GobiernoUSA.gov Toggle URL".
        $targetIdUnderTree = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid = {$targetRelationId}")->fetchColumn();
        switch ( $targetIdUnderTree ) {
            case 'USA.gov':
                // we'll update the "USA.gov Toggle URL" field
                $fieldToUpdate = 'field_usa_gov_toggle_url';
                break;
            case 'GobiernoUSA.gov':
                // we'll update the "GobiernoUSA.gov Toggle URL" field
                $fieldToUpdate = 'field_gobiernousa_gov_toggle_url';
                break;
            default:
                error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript.php was about to target a non USA/Gobi term.');
                return;
        }

        // We now will want to determine what data we are going to write into the $term->{$fieldToUpdate} field
        // The data to write there will be the referenced-term's Friendly-URL value
        $refTermsFriendlyUrlValue = db_query("
            SELECT field_friendly_url_value 
            FROM field_data_field_friendly_url
            WHERE
                entity_type = 'taxonomy_term'
                AND entity_id = {$targetRelationId}
            LIMIT 1
        ")->fetchColumn();

        // Bail if we failed to obtain a Friendly-URL value for this referenced-term
        if ( empty($refTermsFriendlyUrlValue) ) {
            error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript.php was unable to obtain a Friendly-URL '
                .'value for the referenced-term: '.$targetRelationId);
            return;
        }

        // And finally, we can now update the given field with the desired information
        $term->{$fieldToUpdate} = array(
            'und' => array(
                0 => array(
                    'value' => $refTermsFriendlyUrlValue,
                    'format' => null,
                    'safe_value' => $refTermsFriendlyUrlValue,
                )
            )
        );

        // Debug message
        error_log("Value \"{$refTermsFriendlyUrlValue}\" has been saved into the {$fieldToUpdate} field of {$term->name}");

        /* While we are at it, we will want to clean out the "opposite" field, i.e. if a English-term is selected, 
        we will want to erase the data in the Spanish-toggle field, and visa-versa. */
        switch ( $targetIdUnderTree ) {
            case 'USA.gov':
                // then an English toggle has been applied, clean out the Spanish-toggle field.
                $term->field_gobiernousa_gov_toggle_url = array();
                break;
            case 'GobiernoUSA.gov':
                // then a Spanish toggle has been applied, clean out the English-toggle field.
                $term->field_usa_gov_toggle_url = array();
                break;
            default:
                // it should be impossible for this line to be hit
                error_log('Error - Something very odd/impossible is happening in Taxonomy-SiteStruct-ToggleHelperScript');
                error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript failed to do cleanup on term: '.$term->name);
        }

        /*
            Alright- now to get, just a little, funky...

            This code in THIS hook, is firing on PRE-save of this $term. We want to run additional logic; to have
            the referenced-term ($targetRelationId) update it's Toggle-URL as well (since THIS $term's toggles 
            point to the ref-term, and the ref-term should point at THIS $term back).

            HOWEVER; Keep in mind that at THIS [execution] point, the information in THIS $term is not yet saved 
            into the database.

            So what we need to do now, is note down the referenced-term ID, and then update THAT term AFTER
            THIS $term as completely been saved into the database...
        */

        // But we also need to make sure we don't infinitely loop 
        if ( $GLOBALS['taxSiteStrucTogHelper_noPostProc'] ) {
            return;
        }

        // [!!] After this, LOGIC CONTINUES IN: _taxSiteStructToggleHelper_postTermSave_updateRefTerm()
        $GLOBALS['taxSiteStrucTogHelper_updateRefTerm'] = $targetRelationId; // push this value into the global scope


    } // End Hook: taxonomy_term_presave

); // End hooks_reaction_add() call


/** 
 * int _taxSiteStructToggleHelper_getRefToggleTerm(object $term)
 * int _taxSiteStructToggleHelper_getRefToggleTerm(int $term)
 *
 * This function will look at a given $term, and return the term-ID for the 
 * target toggle-term, referenced in the field_english_spanish_toggle field.
 */
function _taxSiteStructToggleHelper_getRefToggleTerm($term ) {

    // If a term-ID was passed, load the term
    if ( !is_object($term) && is_numeric($term) ) {
        $term = taxonomy_term_load($term);
    }

    /* There may or may not be a $term->field_english_spanish_toggle['und'][0]['endpoints'] array.
    this array exsists AFTER the term AND relation is fully saved into the database. We will first
    try to check this, should it exsist.  */ 
    if ( !empty($term->field_english_spanish_toggle['und'][0]['endpoints']) ) {

        $endpoints = $term->field_english_spanish_toggle['und'][0]['endpoints']['und'];

        // We shall return the term-ID of the endpoint which is NOT this one ($term->tid)
        foreach ( $endpoints as $endpoint ) {
            if ( !empty($endpoint['entity_id']) && intval($endpoint['entity_id']) !== intval($term->tid) ) {

                // then we have found an endpoint that is not this $term->tid
                return $endpoint['entity_id'];
            }
        }
    }

    // if this line is hit (if we havent returned yet), then the $term->[...][endpoints] are not available yet

    /* The und/0/relation_options/targets/target_2 path may contain a string like:
            Animal Keeper - (site_strucutre_taxonomy) [taxonomy_term:10354]
            or: Animal Keeper [taxonomy_term:10354]

        While you dont see data in this [object] path on the Devel-tab of any term, you will 
        see this data exist if you were to place a dsm() call in this function here (during a 
        term-save).
    */

    // We must dissect the term-id out of the string at: und/0/relation_options/targets/target_2
    $targetRelationString = $term->field_english_spanish_toggle['und'][0]['relation_options']['targets']['target_2'];
    $words = explode(':', $targetRelationString);
    $lastWord = @array_pop($words);
    $targetRelationId = intval($lastWord);

    // Bail if we failed to parse out the target-id
    if ( $targetRelationId === 0 ) {
        error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript.php failed to obtain a target reference-id.');
        return false;
    }

    return $targetRelationId;
}


/**
 * Implements:  HOOK_taxonomy_term_save  -and-  HOOK_taxonomy_term_update
 * 
 * This is just a definition to make _taxSiteStructToggleHelper_postTermSave_updateRefTerm() called when 
 * either the HOOK_taxonomy_term_save or HOOK_taxonomy_term_update hooks are triggered.
 */
hooks_reaction_add(
    array(
        'HOOK_taxonomy_term_save',
        'HOOK_taxonomy_term_update'
    ),
    function ($term) {

        /* so at this point we know the $term has been saved into the database, 
        we will not run post-processing, and update the referenced term 
        in $GLOBALS['taxSiteStrucTogHelper_updateRefTerm'] */

        _taxSiteStructToggleHelper_postTermSave_updateRefTerm();
    }
);


/** 
 * void _taxSiteStructToggleHelper_postTermSave_updateRefTerm()
 *
 * This is a post-processing function to be run after a $term has been saved.
 * It runs to finish logic started in the HOOK_taxonomy_term_presave hook above.
 */
function _taxSiteStructToggleHelper_postTermSave_updateRefTerm() {

    // This is a global switch that prevents infinite/recursive loop-calls
    if ( $GLOBALS['taxSiteStrucTogHelper_noPostProc'] ) {
        return;
    }

    // If there is nothing to post-process, bail.
    if ( empty($GLOBALS['taxSiteStrucTogHelper_updateRefTerm']) ) {
        return;
    }

    /* So at this point we know that a certain term was updated, but its 
    referenced/toggle term has not been updated yet. We will update this now. */

    /* But first, we dont want to trigger another HOOK_taxonomy_term_presave 
    (which would cause an infinite loop) */
    $GLOBALS['taxSiteStrucTogHelper_noPostProc'] = true; // set a global switch to prevent infinite loop-calls

    // Load the referenced/toggle term 
    $tid = intval( $GLOBALS['taxSiteStrucTogHelper_updateRefTerm'] );
    $term = taxonomy_term_load($tid);

    // Now we simply save the term, thus calling the HOOK_taxonomy_term_presave function above
    // The global $taxSiteStrucTogHelper_noPostProc prevents infinite loops 
    taxonomy_term_save($term);

    $GLOBALS['taxSiteStrucTogHelper_noPostProc'] = false;
}
