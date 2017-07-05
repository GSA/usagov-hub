
// On document ready, we may need to initialize this helper script
if ( typeof setupPageTypeInterval === 'undefined' )
{
    var setupPageTypeInterval = null;
}
if ( typeof setupGroupHelperInterval === 'undefined' )
{
    var setupGroupHelperInterval = null;
}
if ( typeof setupExtraWeightsInterval === 'undefined' )
{
    var setupExtraWeightsInterval = null;
}

//jQuery(document).ready(setupAssetTopicEvents);

function setupAssetTopicEvents()
{
    // console.info('setupAssetTopicEvents trigger');
    if ( !setupPageTypeInterval ) {
        // console.info('setupPageTypeInterval start');
        setupPageTypeInterval = setInterval(function ()
        {
            // console.info('setupPageTypeInterval TRY');
            var needingAttachment = jQuery('.field-name-field-type-of-page-to-generate').not('.atp-processed');
            if ( needingAttachment.length !== 0 ) {
                // console.info('setupPageTypeInterval ACTION');
                needingAttachment.find('select').bind('change click', function () {
                    // Using setTimeout to ensure the following fires after the browser has set the UI value
                    setTimeout( function(pageTypeFieldUI) {
                        // console.info('setupPageTypeInterval CLICK');
                        if ( pageTypeFieldUI.value == 'home' ) {
                            jQuery('.group-asset-placement').hide();
                            jQuery('.group-homepage-container').show();
                        } else {
                            jQuery('.group-asset-placement').show();
                            jQuery('.group-homepage-container').hide();
                        }
                    }, 100, this);
                }).click();
                needingAttachment.addClass('atp-processed');
            } else {
                clearInterval(setupPageTypeInterval);
                setupPageTypeInterval = null;
                // console.info('setupPageTypeInterval stop');
            }
        }, 100);
    }

    if ( !setupGroupHelperInterval ) {
        // console.info('setupGroupHelperInterval start');
        setupGroupHelperInterval = setInterval(function ()
        {
            // console.info('setupGroupHelperInterval TRY');
            // If there is a term's edit form on this page, and this help script has NOT been applied to it...
            var needingHelp = jQuery('.group-asset-topic-placement').not('.atp-processed');
            if ( needingHelp.length !== 0 ) {
                // console.info('setupGroupHelperInterval ACTION');
                //console.log('Firing initAssetTopicPlacementHelperScript()');
                initAssetTopicPlacementHelperScript();
                // Note this helper-script has been applied to this form
                jQuery('.group-asset-topic-placement').addClass('atp-processed');
                if (jQuery("input[name='tid']").length > 0 && jQuery('.field-name-field-page-intro textarea').length > 0) {
                    // resriction limit for page intro field except for kids, usa, and gobierno.govs
                    // adding 170 character limit for page creation
                    var tid = jQuery("input[name='tid']").val();
                    if (tid != 3062 && tid != 3067 && tid != 3072) {
                        jQuery('.field-name-field-page-intro textarea').attr('maxlength', '170');
                    }
                }
            } else {
                clearInterval(setupGroupHelperInterval);
                setupGroupHelperInterval = null;
                // console.info('setupGroupHelperInterval stop');
            }
        }, 100);
    }

    // Bug killer - Sometimes multiple "Show/Hide row weights" links show...
    if ( !setupExtraWeightsInterval ) {
        // console.info('setupExtraWeightsInterval start');
        setupExtraWeightsInterval = setInterval(function ()
        {
            // console.info('setupExtraWeightsInterval TRY');
            var needingCleanup = jQuery('.field-type-entityreference').not('.atp-processed');
            if ( needingCleanup.length !== 0 ) {
                // console.info('setupExtraWeightsInterval ACTION');
                needingCleanup.each( function () {
                    var jqThis = jQuery(this);
                    var toggleWeights = jqThis.find('a.tabledrag-toggle-weight');
                    if (toggleWeights.length > 1) {
                        toggleWeights.hide();
                        toggleWeights.last().show();
                    }
                    needingCleanup.addClass('atp-processed');
                });
            } else {
                clearInterval(setupExtraWeightsInterval);
                setupExtraWeightsInterval = null;
                // console.info('setupExtraWeightsInterval stop');
            }
        }, 100);
    }
}

function untickAssetTopic(term)
{
    assetByTopicFullCheck();
}


// finds which checkboxes are selected in the asset topic placement tables
var currentTopicsSelected;
function getCheckboxOriginalState(){
    var counter = 0;
    var currentTopicsSelected = [];
    jQuery('.vertical-tabs-panes fieldset').each(function(){
        var itemsChecked = [];
        jQuery(this).find('tr input:checked').each(function(){
            itemsChecked.push(jQuery(this).attr('value'));
        });
        currentTopicsSelected.push([jQuery(this).attr('id'), itemsChecked]);
        counter++;
    });
    return currentTopicsSelected;
}

// sets which checkboxes were selected in the asset topic placement tables after they were blown away
function setCheckboxOriginalState(){
    jQuery(currentTopicsSelected).each(function(){

        if(this[1].length !== 0){
            var id = '#' + this[0] + ' ';
            jQuery(this[1]).each(function(){
                var selector = id + 'input[value='+  this +']';
                jQuery(selector).prop('checked', true);
            });
        }
    });
}


function initAssetTopicPlacementHelperScript()
{


    jQuery('input[name="field_asset_topic_taxonomy[und]"]').change(function() {
        

        currentTopicsSelected = getCheckboxOriginalState();
        jQuery('.group-asset-topic-placement tr').remove();
        alterTermsInAssetPlacementFields();





    });

    jQuery('input[name="field_also_include_on_nav_page[und]"]').change(function() {
        var terms = [];
        terms = jQuery('input[name="field_also_include_on_nav_page[und]"]').val().split(',');
        terms = terms.filter(function(v){return v!==''});

        jQuery(terms).each(function(key, value){
            var selector = '.field-name-field-also-include-on-nav-page a#' + value + '_anchor'
            var termTitle = jQuery(selector).text();
            var targId = jQuery('.field-name-field-asset-order-menu').attr('id');
            injectRowIntoAssetPlacementField('#'+targId, value, termTitle);
            updateWeightOptionsInAssetPlacementField('#'+targId);
        });

    });


    updateAssetTopicPlacementCountClasses();

    // When the user touches a checkbox under the "Asset Topic Taxonomy" field...
    jQuery('.field-name-field-asset-topic-taxonomy input').bind('click', function () {

        // I'm using setTimeout() to make [very] sure that this event fires AFTER the browser has handled the checkbox ticked-value alteration...
        setTimeout( function (tThis) {

            if ( tThis.checked ) {
                if ( jQuery('.group-asset-topic-placement').queue('fx').length < 3 ) {
                    jQuery('.group-asset-topic-placement').queue( function () {

                        if ( jQuery('#edit-field-type-of-page-to-generate-und').val() != 'home' ) {
                            jQuery('.group-asset-topic-placement').fadeIn();
                        }

                        var addTids = [];
                        jQuery('.field-name-field-asset-topic-taxonomy input:checked').each( function () {
                            addTids.push(this.value);
                        });

                        alterTermsInAssetPlacementFields(function () {
                            updateAssetTopicPlacementCountClasses();
                            jQuery('.group-asset-topic-placement').dequeue();
                        });
                    });
                }
            } else {
                jQuery('.group-asset-topic-placement').queue( function () {
                    jQuery('.group-asset-topic-placement input[value=' + tThis.value + ']').parents('tr').remove();
                    untickAssetTopic(tThis);
                    updateAssetTopicPlacementCountClasses();
                    jQuery('.group-asset-topic-placement').dequeue();
                });
            }

        }, 10, this);

    });

    // When the user touches a checkbox under the "Also include on Nav Pages" field...
    jQuery('.field-name-field-also-include-on-nav-page input').bind('click', function () {

        // I'm using setTimeout() to make [very] sure that this event fires AFTER the browser has handled the checkbox ticked-value alteration...
        setTimeout( function (tThis) {

            if ( tThis.checked ) {
                if ( jQuery('#edit-field-type-of-page-to-generate-und').val() != 'home' ) {
                    jQuery('.group-asset-topic-placement').fadeIn();
                }
                var targId = jQuery('.field-name-field-asset-order-menu').attr('id');
                injectRowIntoAssetPlacementField('#'+targId, tThis.value, jQuery(tThis).parent().find('label').text());
                updateWeightOptionsInAssetPlacementField('#'+targId);
            } else {
                jQuery('.field-name-field-asset-order-menu input[value=' + tThis.value + ']').parents('tr').remove();
                updateAssetTopicPlacementCountClasses();
            }

        }, 10, this);
    });

    // When the user clicks an "Inherit" checkbox...
    jQuery('.group-asset-topic-placement input[name*="inherit"]').bind('click', function () {
        // I'm using setTimeout() to make [very] sure that this event fires AFTER the browser has handled the checkbox ticked-value alteration...
        setTimeout( function () {
            enforceAssetTopicOrderVisibilityBasedOnInheritance();
        }, 10);
    });

    /* When the page first loads, we want to make sure any [currently] selected term under
     "Asset Topic Taxonomy" shows under ALL lists in "Asset Topic Placement" (this is necessary
     on taxonomy edit-pages) */
    var tickedCheckboxes = jQuery('.field-name-field-asset-topic-taxonomy input:checked');
    if ( tickedCheckboxes.length > 0 ) {
        var selectedTermIDs = [];
        tickedCheckboxes.each( function () {
            selectedTermIDs.push( this.value );
        });
        alterTermsInAssetPlacementFields(function () {
            updateAssetTopicPlacementCountClasses();
        });
    } else {
        /* There are no Asset-Topics selected, so we shall just show
         everything under the "Asset Placement" area now */
        jQuery('.group-asset-topic-placement').removeClass('term-processing'); // This removes the spinner
        jQuery('.group-homepage-container').removeClass('term-processing'); // This removes the spinner
        updateAssetTopicPlacementCountClasses();
    }

    /* When the page first loads, we want to make sure any [currently] selected term under
     "Also include on Nav Pages" shows under the lists in "Menu Region" (this is necessary
     on taxonomy edit-pages) */
    var tickedCheckboxes = jQuery('.field-name-field-also-include-on-nav-page input:checked');
    if ( tickedCheckboxes.length > 0 ) {
        tickedCheckboxes.each( function () {
            var targId = jQuery('.field-name-field-asset-order-menu').attr('id');
            injectRowIntoAssetPlacementField('#'+targId, this.value, jQuery(this).parent().find('label').text());
            updateWeightOptionsInAssetPlacementField('#'+targId);
        });
    }

    /* When the page first loads, we want to make sure that any Asset associated with a term that
     does NOT exist under any of the selected Asset-Topics are removed */
    assetByTopicFullCheck();

}

/* Shows or hides each "Asset Topic Order" field based on weather to not
 * the "Inherit this region's assets from parent" sibling-checkbox is ticked.
 */
function enforceAssetTopicOrderVisibilityBasedOnInheritance()
{

    jQuery('.group-asset-topic-placement .form-item.form-type-checkbox label:contains("Inherit")').each( function () {








        var jqThis = jQuery(this);
        var inheritCheckbox = jqThis.siblings('input');
        var fieldsetContainer = jqThis.parents('.fieldset-wrapper').eq(0); // Search up the DOM from $(this) to the first div.fieldset-wrapper
        var assetTopicOrderField = fieldsetContainer.children('.field-widget-entityreference-view-widget');


        if (inheritCheckbox.is(':checked')){
            assetTopicOrderField.fadeOut();
        } else {
            assetTopicOrderField.fadeIn();
        }

    });

}

function updateAssetTopicPlacementCountClasses()
{
    // These classes are used for theming purposes in asset_topic_placement.css
    if ( jQuery('.field-name-field-asset-topic-taxonomy input:checked').length > 0 ) {
        jQuery('.group-asset-topic-placement').removeClass('term-count-0');
        jQuery('.group-asset-topic-placement').addClass('term-count-not-0');
    } else {
        jQuery('.group-asset-topic-placement').addClass('term-count-0');
        jQuery('.group-asset-topic-placement').removeClass('term-count-not-0');
    }

}

function alterTermsInAssetPlacementFields(callback)
{

    jQuery('.group-asset-topic-placement').addClass('term-processing'); // This shows a spinner
    jQuery('.group-homepage-container').addClass('term-processing'); // This shows a spinner

    var targId = jQuery('.field-name-field-asset-order-carousel').attr('id');
    alterTermsInAssetPlacementField('#'+targId, function () {

        var targId = jQuery('.field-name-field-asset-order-content').attr('id');
        alterTermsInAssetPlacementField('#'+targId, function () {

            var targId = jQuery('.field-name-field-asset-order-sidebar').attr('id');
            alterTermsInAssetPlacementField('#'+targId, function () {

                var targId = jQuery('.field-name-field-asset-order-bottom').attr('id');
                alterTermsInAssetPlacementField('#'+targId, function () {

                    var targId = jQuery('.field-name-field-home-alert-asset').attr('id');
                    alterTermsInAssetPlacementField('#'+targId, function () {

                        var targId = jQuery('.field-name-field-home-quote1-asset').attr('id');
                        alterTermsInAssetPlacementField('#'+targId, function () {

                            var targId = jQuery('.field-name-field-home-popular-asset').attr('id');
                            alterTermsInAssetPlacementField('#'+targId, function () {

                                var targId = jQuery('.field-name-field-home-quote2-asset').attr('id');
                                alterTermsInAssetPlacementField('#'+targId, function () {

                                    var targId = jQuery('.field-name-field-home-quote3-asset').attr('id');
                                    alterTermsInAssetPlacementField('#'+targId, function () {

                                        var targId = jQuery('.field-name-field-home-cat2cont-assets').attr('id');
                                        alterTermsInAssetPlacementField('#'+targId, function () {

                                            var targId = jQuery('.field-name-field-home-howdoi-assets').attr('id');
                                            alterTermsInAssetPlacementField('#'+targId, function () {

                                                var targId = jQuery('.field-name-field-home-quickfindcont-asset').attr('id');
                                                alterTermsInAssetPlacementField('#'+targId, function () {

                                                    atp_buildNodeInfoCache( function () {

                                                        reinitializeDragTables();
                                                        jQuery('.group-asset-topic-placement').removeClass('term-processing'); // This removes the spinner
                                                        jQuery('.group-homepage-container').removeClass('term-processing'); // This removes the spinner

                                                        // Trigger callback
                                                        if ( typeof callback === 'function' ) {
                                                            callback();
                                                        }
                                                        setCheckboxOriginalState();
                                                    });

                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    });
}

function alterTermsInAssetPlacementField(fieldSelector, callback)
{

    //console.log('Now applying changes to the Asset-Topic-Placement-Field: ' + fieldSelector);

    // Initalize NodeUnderTopicCache
    if ( typeof NodeUnderTopicCache === 'undefined' ) {
        NodeUnderTopicCache = {};
    }

    // Initialize NodeUnderTopicCache
    if ( typeof NodeInfoCache === 'undefined' ) {
        NodeInfoCache = {};
    }

    // Get selected Asset-Topic Taxonomy terms
    var terms = [];
    jQuery('.field-name-field-asset-topic-taxonomy input:checked').each( function () {
        terms.push(this.value);
    });


    terms = jQuery('input[name="field_asset_topic_taxonomy[und]"]').val().split(',');
    terms = terms.filter(function(v){return v!==''});

    if(terms != ''){
        var nutCacheKey = 't' + terms.join('t', terms);
    }

    // Get nodes associated to these Asset-Topic taxonomy terms...
    if ( typeof NodeUnderTopicCache[nutCacheKey] !== 'undefined' ) {
        alterTermsInAssetPlacementField_callInjectRows(fieldSelector, NodeUnderTopicCache[nutCacheKey], callback);
    } else {
        jQuery.get('/atm/get-nodes-under-topics?terms='+terms.join(','), function (nodes) {

            // Cache what nodes are under this topic
            NodeUnderTopicCache[nutCacheKey] = nodes;

            // Cache all node information (by nid)
            for ( var n = 0 ; n < nodes.length ; n++ ) {
                NodeInfoCache['n'+nodes[n].nid] = nodes[n];
            }

            alterTermsInAssetPlacementField_callInjectRows(fieldSelector, nodes, callback);
        });
    }
}

/* This function builds the JavaScript node-cache, which contains information about
 what nodes are "sticky", etc. */
function atp_buildNodeInfoCache(callback)
{

    var uniqNids = [];
    jQuery('.tabledrag-processed tr input').each( function () {
        var thisNid = jQuery(this).val();
        if ( uniqNids.indexOf(thisNid) == -1 ) {
            uniqNids.push(thisNid);
        }
    })

    var nidsNotCached = [];
    for ( var x = 0 ; x < uniqNids.length ; x++ ) {
        if ( typeof NodeInfoCache['n'+uniqNids[x]] == 'undefined' ) {
            nidsNotCached.push(uniqNids[x]);
        }
    }

    if ( nidsNotCached.length == 0 ) {
        callback();
        return;
    }

    jQuery.get('/atm/get-nodes-data?nids='+nidsNotCached.join(','), function (nodes) {

        for ( var n = 0 ; n < nodes.length ; n++ ) {
            NodeInfoCache['n'+nodes[n].nid] = nodes[n];
        }

        callback();
    });

}

function atp_getNodeInfoFromCache(arrNids)
{

    // Initialize NodeUnderTopicCache
    if ( typeof NodeInfoCache === 'undefined' ) {
        NodeInfoCache = {};
    }

    //
    var nodesFromCache = {};
    for ( var n = 0 ; n < arrNids.length ; n++ ) {
        var nid = arrNids[n];
        var nnid = 'n'+nid;
        if ( typeof NodeInfoCache[nnid] == 'undefined' ) {
            //debugger; // this line should never hit!
            return false;
        } else {
            nodesFromCache[nid] = NodeInfoCache[nnid];
        }
    }

    return nodesFromCache;
}

function alterTermsInAssetPlacementField_callInjectRows(fieldSelector, nodes, callback)
{

    for ( var x = 0 ; x < nodes.length ; x++ ) {
        injectRowIntoAssetPlacementField(fieldSelector, nodes[x].nid, nodes[x].title);
    }
    updateWeightOptionsInAssetPlacementField(fieldSelector);

    if ( typeof callback == 'function' ) {
        callback();
    }
}

function injectRowIntoAssetPlacementField(fieldSelector, nodeId, nodeTitle)
{

    // if this table already has this entity-reference, then bail
    if ( jQuery(fieldSelector+' input[value='+nodeId+']').length > 0 ) {
        return;
    }

    var newRowHTML = '<tr class="draggable ODD_OR_EVEN">\
		<td class="field-multiple-drag">\
			<a href="#" class="tabledrag-handle" title="Drag to re-order">\
				<div class="handle">&nbsp;</div>\
			</a>\
		</td>\
		<td colspan=1>\
			<div class="form-item form-type-checkbox form-item-FIELD_HERE-und-VALUE_ID_HERE-target-id">\
	 			<input id="edit-FIELD_HERE-und-VALUE_ID_HERE" data-delta="VALUE_ID_HERE" type="checkbox" name="FIELD_UNDER_NAME[und][VALUE_ID_HERE][target_id]" value="NODE_ID_HERE" class="form-checkbox">\
	 			<span class="field-suffix">\
	 				<label class="option" for="edit-FIELD_HERE-und-VALUE_ID_HERE">NODE_TITLE_HERE</label>\
	 			</span>\
			</div>\
		</td>\
		<td colspan=1 class="delta-order tabledrag-hide" style="display: none;">\
			<div class="form-item form-type-select form-item-FIELD_HERE-und-VALUE_ID_HERE--weight">\
	  			<label class="element-invisible">Weight </label>\
			 	<select id="edit-FIELD_HERE-und-VALUE_ID_HERE-weight" class="must-set-val weight-select FIELD_HERE-delta-order form-select" name="FIELD_UNDER_NAME[und][VALUE_ID_HERE][_weight]">\
			 		<option value="-1">-1</option>\
			 		<option value="0">0</option>\
			 		<option value="1">1</option>\
			 	</select>\
			</div>\
		</td>\
	</tr>';

    var valId = jQuery(fieldSelector+' tr.draggable').length;
    var valIdCombo = valId + '--' + jQuery('input[name="name"]').attr('id').split('-').pop();
    var oddOrEven = ( jQuery(fieldSelector+' tr').last().hasClass('even') ? 'odd' : 'even' );
    var fieldName = String(fieldSelector).replace('#edit-', '');
    var fieldUnderName = String(fieldName).replace(/-/g, '_');
    newRowHTML = newRowHTML.replace(/FIELD_UNDER_NAME/g, fieldUnderName);
    newRowHTML = newRowHTML.replace(/FIELD_HERE/g, fieldName);
    newRowHTML = newRowHTML.replace(/VALUE_IDCOMBO_HERE/g, valIdCombo);
    newRowHTML = newRowHTML.replace(/VALUE_ID_HERE/g, valId);
    newRowHTML = newRowHTML.replace(/NODE_ID_HERE/g, nodeId);
    newRowHTML = newRowHTML.replace(/NODE_TITLE_HERE/g, nodeTitle);
    newRowHTML = newRowHTML.replace(/ODD_OR_EVEN/g, oddOrEven);

    jQuery(fieldSelector+' tbody').append(newRowHTML);
    // updateWeightOptionsInAssetPlacementField(fieldSelector);
    // jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').last().attr('selected', 'selected');
    // var setWeight = jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').last().val();
    // jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').val(setWeight);
    // jQuery(fieldSelector+' tbody tr .weight-select').last().attr('setValTo', setWeight);

    // Remove any "No items" message in this table
    jQuery('td:contains("No items have been added yet")').parent().remove();

    // Mark this drag-table as needing to be reinitialized
    // jQuery(fieldSelector).addClass('needs-dragtable-reinit');

}

function reinitializeDragTables()
{

    jQuery('.needs-dragtable-reinit').each( function () {

        var jqThis = jQuery(this);
        jqThis.removeClass('needs-dragtable-reinit');
        var fieldSelector = '#' + jqThis.attr('id');

        //console.log('Reinitializing drag-table: '+fieldSelector);

        // Determin where the drag-table information is stored in the Drupal js-variable
        var base = fieldSelector;
        base = base.replace('#edit-', '') + '-values';
        // Bug killer for the taxonomy_manager page which may change DOM-ids of the entity-reference fields
        for ( var x = 2 ; x < 30 ; x++ ) {
            base = base.replace('--'+x+'-', '-');
        }

        // Break bindings
        jQuery(fieldSelector+' *').unbind();

        // Remove all drag-handles in the table
        jQuery(fieldSelector+' a.tabledrag-handle .handle').remove();

        // Remove the "Show row weights" link in this table
        jQuery(fieldSelector).parent().find('a.tabledrag-toggle-weight').remove();

        Drupal.tableDrag[base] = new Drupal.tableDrag(jQuery('#'+base).get(0), Drupal.settings.tableDrag[base]);

        // Re-initialize the Drupal.tableDrag[~]
        var dragTblObj = Drupal.tableDrag[base];
        dragTblObj.showColumns();
        var hasSetTimer = false;
        jqThis.find('.must-set-val').each( function () {
            var jqThisRow = jQuery(this);
            jqThisRow.val( jqThisRow.attr('setValTo') );
            jqThisRow.removeClass('must-set-val');
            if ( hasSetTimer === false ) {
                setTimeout( function () {
                    dragTblObj.hideColumns();
                    ensureEditAssetLinksExsist();
                    processSticky();
                }, 200);
                hasSetTimer = true;
            }
        });

        // Input name fix
        jQuery('.form-type-checkbox input[name*="__"]').each( function () {
            for ( var x = 2 ; x < 20 ; x++ ) {
                var jqThis = jQuery(this);
                var newInptName = jqThis.attr('name').replace('__'+x, '');
                jqThis.attr('name', newInptName);
            }
        });

        // Weight name fix
        for ( var x = 2 ; x < 20 ; x++ ) {
            jQuery('.form-type-select select[id*="--'+x+'-und"]').each( function () {
                var jqThis = jQuery(this);
                var newId = jqThis.attr('id').replace('--'+x+'-und', '-und').replace('-weight', '--'+x+'-weight');
                jqThis.attr('id', newId);
                var newInptName = jqThis.attr('name').replace('__'+x, '');
                jqThis.attr('name', newInptName);
                var node = jqThis.get(0);
                node.className = node.className.replace('--'+x+'-delta-order', '-delta-order');
            });
        }

    });

}

function updateWeightOptionsInAssetPlacementField(fieldSelector)
{
    var fieldName  = String(fieldSelector).replace('#edit-', '');

    jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').last().attr('selected', 'selected');
    var setWeight = jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').last().val();
    jQuery(fieldSelector+' tbody tr').last().find('.'+fieldName+'-delta-order option').val(setWeight);
    jQuery(fieldSelector+' tbody tr .weight-select').last().attr('setValTo', setWeight);

    var draggables = jQuery(fieldSelector+' tr.draggable');
    var maxWeight  = draggables.length;
    draggables.each( function () {
        var weightSelect = jQuery(this).find('.'+fieldName+'-delta-order');
        for ( var w = 1 ; w < maxWeight+1 ; w++ ) {
            if ( weightSelect.find('option[value='+w+']').length == 0 ) {
                weightSelect.append('<option value="'+w+'">'+w+'</option>');
            }
        }

        for ( var w = 1 ; w < maxWeight+1 ; w++ ) {
            if ( weightSelect.find('option[value=-'+w+']').length == 0 ) {
                weightSelect.prepend('<option value="-'+w+'">-'+w+'</option>');
            }
        }

    });

    // Mark this drag-table as needing to be reinitialized
    jQuery(fieldSelector).addClass('needs-dragtable-reinit');

}

function ensureEditAssetLinksExsist()
{

    jQuery('.tabledrag-processed tr').each( function () {

        var jqRow = jQuery(this);
        if ( jqRow.find('input').length > 0 && jqRow.find('a.asset-edit-link').length == 0 ) {

            var jqInput = jqRow.find('input');
            var jqLabel = jqInput.parent().find('label');

            var linkHTML = '<a class="asset-edit-link" style="margin-left: 7px;" target="_blank" href="/node/-NODE-ID-/edit">Edit Asset</a>';
            linkHTML = linkHTML.replace('-NODE-ID-', jqInput.attr('value'))

            jQuery(linkHTML).insertAfter(jqLabel);
        }
    });
}

function processSticky()
{

    jQuery('.tabledrag-processed tr').not('.sticky-processed').each( function () {

        var jqRow = jQuery(this);
        if ( jqRow.find('input').length > 0 ) {

            var jqInput = jqRow.find('input');
            var nodeId = jqInput.attr('value');
            var jqLabel = jqInput.parent().find('label');
            var jqDragHandle = jqRow.find('.tabledrag-handle');
            var jqParentTableNode = jqRow.parents('table');
            var jqParentTableBodyNode = jqParentTableNode.find('tbody');

            // Determine weather this is a sticky-item or not
            var nodesInfo = atp_getNodeInfoFromCache([nodeId]);
            if ( typeof nodesInfo[nodeId] === 'undefined' ) {
                jqRow.addClass('sticky-processed');
            } else {
                var nodeData = nodesInfo[nodeId];
                if ( nodeData['priority'] == 'sticky' || nodeData['haspubrevision'] == '0' ) {

                    // Determin what "tags" to show next to this element's title
                    var arrLabelTags = [];
                    if ( nodeData['priority'] == 'sticky' ) {
                        arrLabelTags.push('sticky');
                    }
                    if ( nodeData['haspubrevision'] == '0' ) {
                        arrLabelTags.push('no-published-revision');
                    }
                    var strLabelTags = arrLabelTags.join(', ');

                    // Set the new label tabs into the row
                    var newLabelHtml = jqLabel.html()+' (<small><b>'+strLabelTags+'</b></small>)';
                    jqLabel.html(newLabelHtml);

                    // Further sticky processing
                    if ( nodeData['priority'] == 'sticky' ) {

                        jqDragHandle.hide().addClass('element-invisible');
                        jqRow.addClass('is-sticky');
                        jqParentTableNode.addClass('needsZebraReprocessing');
                        jqParentTableNode.addClass('needsStickySorting');

                        // By relocating this <tr> up one level, it becomes unmovable
                        jqRow.detach().insertBefore(jqParentTableBodyNode);
                    }

                    jqRow.addClass('sticky-processed');

                } else {
                    jqRow.addClass('sticky-processed');
                }
            }

        } else {
            jqRow.addClass('sticky-processed');
        }

    });

    processStickySorting();

    jQuery('table.needsZebraReprocessing').each(function () {
        jqThis = jQuery(this);
        reprocessZebraPattern(jqThis);
        jqThis.removeClass('needsZebraReprocessing');
    });

}

function processStickySorting()
{

    jQuery('table.needsStickySorting').each( function () {

        var jqTable = jQuery(this);
        var jqTableBody = jqTable.find('tbody');

        // Get all the sticky-rows and detach them from the DOM
        var stickyRows = [];
        var sortableArray = [];
        jqTable.children('tr').each( function () {
            var jqRow = jQuery(this);
            var rowText = jqRow.find('label').eq(0).text();
            var sortableString = rowText+'-'+sortableArray.length;
            sortableArray.push( sortableString.toLowerCase() );
            stickyRows.push( jqRow.detach() );
        });

        // Sort the array
        sortableArray.sort();

        // Reattach the sticky-elements in order
        for ( var x = 0 ; x < sortableArray.length ; x++ ) {

            srId = sortableArray[x].split('-');
            srId = srId[ srId.length - 1 ];

            stickyRows[srId].insertBefore(jqTableBody);
        }

    });
}

function reprocessZebraPattern(jqTable)
{

    // Remove all even/odd classes
    jqTable.find('tr.even, tr.odd').each( function () {
        jQuery(this).removeClass('even').removeClass('odd');
    });

    // Re-apply even/odd classes
    var jqRows = jqTable.find('tr');
    for ( var r = 0 ; r < jqRows.length ; r++ ) {
        var newClass = ( r%2 == 1 ? 'odd' : 'even' );
        jqRows.eq(r).addClass(newClass);
    }

}

// Based on the selected Asset-Topics, remove any asset that dosnt belong
function assetByTopicFullCheck()
{
    // This shows a spinner
    jQuery('.group-asset-topic-placement').addClass('term-processing');
    jQuery('.group-homepage-container').addClass('term-processing');

    // Get the selected-Asset-Topic term-IDs
    var tidAssetTopics = [];
    jQuery('.field-name-field-asset-topic-taxonomy input:checked').each( function () {
        tidAssetTopics.push( jQuery(this).val() );
    });
    tidAssetTopics = jQuery('input[name="field_asset_topic_taxonomy[und]"]').val().split(',');
    tidAssetTopics = tidAssetTopics.filter(function(v){return v!==''});

    // SPECIAL CASE - If there are no Asset-Topics selected, then there should be no Assets available
    if ( tidAssetTopics.length == 0 ) {
        // Remove all rows from the drag tables that contain inputs (an asset-referencer)
        jQuery('.group-asset-placement tr input[type=checkbox]').parents('tr').remove();
        // Update things and return
        updateAssetTopicPlacementCountClasses();
        jQuery('.group-asset-topic-placement').removeClass('term-processing'); // remove the spinner
        jQuery('.group-homepage-container').removeClass('term-processing'); // remove the spinner
        return;
    }

    // Initalize NodeUnderTopicCache
    if ( typeof NodeUnderTopicCache === 'undefined' ) {
        NodeUnderTopicCache = {};
    }

    // Initialize NodeUnderTopicCache
    if ( typeof NodeInfoCache === 'undefined' ) {
        NodeInfoCache = {};
    }

    // Get all node/assets under these Asset-Topics
    var nutCacheKey = 't' + tidAssetTopics.join('t', tidAssetTopics);
    if ( NodeUnderTopicCache.hasOwnProperty(nutCacheKey) )
    {
        updateNodeUnderTopicCache(NodeUnderTopicCache[nutCacheKey]);
    } else {
        jQuery.get('/atm/get-nodes-under-topics?terms='+tidAssetTopics.join(','), updateNodeUnderTopicCache );
    }

    function updateNodeUnderTopicCache (nodes) {

        // Cache what nodes are under this/these topic(s)
        NodeUnderTopicCache[nutCacheKey] = nodes;

        // Cache all node information (by nid)
        for ( var n = 0 ; n < nodes.length ; n++ ) {
            NodeInfoCache['n'+nodes[n].nid] = nodes[n];
        }

        // Get a list of nodes that are allowed to show in the regions
        var allowedNids = {};
        for ( var n = 0 ; n < nodes.length ; n++ ) {
            var thisNodeId = nodes[n].nid;
            allowedNids['n'+thisNodeId] = true;
        }

        // Scan for rows in Asset-Drag tables, for rows containing node-references that dont belong
        jQuery('.group-asset-placement tr').each( function () {
            var jqRow = jQuery(this);
            var thisRowInput = jqRow.find('input');
            var thisRowNidRef = thisRowInput.val();
            if ( thisRowInput.length > 0 ) { // basically: skip over rows that dont contain an input-element
                if ( typeof allowedNids['n'+thisRowNidRef] == 'undefined' ) {
                    jqRow.remove();
                }
            }
        });

        updateAssetTopicPlacementCountClasses();

        // This removes the spinner
        jQuery('.group-asset-topic-placement').removeClass('term-processing');
        jQuery('.group-homepage-container').removeClass('term-processing');

    }

}
