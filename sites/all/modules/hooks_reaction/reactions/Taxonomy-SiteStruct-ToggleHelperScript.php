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
        $targetRelationTermId = _taxSiteStructToggleHelper_getRefToggleTerm($term);

        // If the "English/Spanish Toggle" is empty, then empty out the "USA.gov Toggle URL" and "GobiernoUSA.gov Toggle URL" fields
        if ( $targetRelationTermId == false ) {
            $term->field_usa_gov_toggle_url = array();
            $term->field_gobiernousa_gov_toggle_url = array();
        }

        // We only act when there is data supplied in the field_english_spanish_toggle field
        if ( $targetRelationTermId == false ) {
            return;
        }

        // If this $term alread has a DIFFERENT relation to something else, kill it.
        $killOldRelation = _taxSiteStructToggleHelper_getOldRelationToDelete($term->tid, array($term->tid, $targetRelationTermId));
        if ( $killOldRelation ) {
            error_log("SiteStruct-ToggleHelper killing relation in the way: ".$killOldRelation);
            relation_delete($killOldRelation);
        }

        // And we shall do the same for the target/related term
        $killOldRelation = _taxSiteStructToggleHelper_getOldRelationToDelete($targetRelationTermId, array($term->tid, $targetRelationTermId));
        if ( $killOldRelation ) {
            error_log("SiteStruct-ToggleHelper killing relation in the way: ".$killOldRelation);
            relation_delete($killOldRelation);
        }

        // We now must determin which field we are going to update; the "USA.gov Toggle URL" or "GobiernoUSA.gov Toggle URL".
        $targetIdUnderTree = db_query("SELECT tlt_name FROM taxonomy_tlt_name WHERE tid = {$targetRelationTermId}")->fetchColumn();
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
                AND entity_id = {$targetRelationTermId}
            LIMIT 1
        ")->fetchColumn();

        // Bail if we failed to obtain a Friendly-URL value for this referenced-term
        if ( empty($refTermsFriendlyUrlValue) ) {
            error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript.php was unable to obtain a Friendly-URL '
                .'value for the referenced-term: '.$targetRelationTermId);
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
            the referenced-term ($targetRelationTermId) update it's Toggle-URL as well (since THIS $term's toggles 
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
        $GLOBALS['taxSiteStrucTogHelper_updateRefTerm'] = $targetRelationTermId; // push this value into the global scope


    } // End Hook: taxonomy_term_presave

); // End hooks_reaction_add() call


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

    if ( empty($term->field_english_spanish_toggle['und']) ) {
        return false;
    }

    // We must dissect the term-id out of the string at: und/0/relation_options/targets/target_2
    $targetRelationString = $term->field_english_spanish_toggle['und'][0]['relation_options']['targets']['target_2'];
    $words = explode(':', $targetRelationString);
    $lastWord = @array_pop($words);
    $targetRelationTermId = intval($lastWord);

    // Bail if we failed to parse out the target-id
    if ( $targetRelationTermId === 0 ) {
        error_log('Error - Taxonomy-SiteStruct-ToggleHelperScript.php failed to obtain a target reference-id. '
            .'(note that this message may be a false-positive)');
        return false;
    }

    return $targetRelationTermId;
}


/** 
 * int _taxSiteStructToggleHelper_getOldRelationToDelete(object $term)
 * int _taxSiteStructToggleHelper_getOldRelationToDelete(int $term)
 *
 * [!!] NOTICE [!!] - This function only looks after the field_english_spanish_toggle field.
 *
 * So there seems to be a bug with the relation module, the bug is;
 *    If you relate node-A with node-B, with a 2-way relation, then node-B points to node-A as expected.
 *    HOWEVER, if you then relate node-A with node-C...
 *       node-A points to node-C, and node-C points to node-A, as expected
 *       BUT: node-B will still be pointing to node-A
 *       ALSO, the node-A <--> node-B relation will actually still be found in the database (in MySQL), but not seen on the interface
 *
 *    Interestingly, if you were to then delete the node-A <--> node-C relation, the node-A <--> node-B relations will
 *    then magically be seen again in the interface.
 *
 *    In other words, it seems the relation module is not smart enough to clobber relations in its 
 *    way when creating 2-way relations. Instead, it just appends a new relation, even though our 
 *    field_english_spanish_toggle field in Drupal is set to only hold one value. With this bug,
 *    the relations module essentially is is treating all relation fields as a multi-value field.
 *
 * This function will look at the given $term, and given two "new/expected" endpoints - should there be an 
 * "old" relation already stored on $term, then the relation-id [to delete] will be returned.
 *
 * This function call is most usefull durring HOOK_*_presave.
 *
 */
function _taxSiteStructToggleHelper_getOldRelationToDelete($term, $expectedEndpoints = array()) {

    // If a term-ID was passed, load the term
    if ( !is_object($term) && is_numeric($term) ) {
        $term = taxonomy_term_load($term);
    }

    // Bail if there are no endpoints/references
    if ( empty($term->field_english_spanish_toggle['und'][0]['endpoints']['und']) ) {
        return;
    }

    // Get the referenced entities
    $exsistingEndpoints = $term->field_english_spanish_toggle['und'][0]['endpoints']['und'];

    // Bail if there are no endpoints/references
    if ( !is_array($exsistingEndpoints) || count($exsistingEndpoints) == 0 ) {
        return;
    }

    // Check each endpoint on this $term, trying to find one that is unexpected
    foreach ( $exsistingEndpoints as $exsistingEndpoint ) {

        // If this endpoint-target is unexpected...
        if ( !in_array($exsistingEndpoint['entity_id'], $expectedEndpoints) ) {

            // ...then this relation is unexpected
            $relationId = $term->field_english_spanish_toggle['und'][0]['rid'];
            return intval($relationId);
        }
    }

    return false;
}