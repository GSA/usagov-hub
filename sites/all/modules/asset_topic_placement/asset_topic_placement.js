
// On document ready, we may need to initialize this helper script
jQuery(document).ready( function () {

	if ( typeof jQuery.fn.waitUntilExists != 'function' ) {
		alert('Error - Missing waitUntilExists jQuery library!');
		return;
	}

	/*Every so often, check if we need to initialize this helper script [again]
	This is necessary because a single term's edit form can be loaded on a 
	single page multiple times in the "Taxonomy Manager" */
	setInterval(function () {
		
		// If there is a term's edit form on this page, and this help script has NOT been applied to it...
		if ( jQuery('.group-asset-topic-placement').length > 0 && jQuery('.group-asset-topic-placement.helper-script-applied').length == 0 ) {

			console.log('Firing initAssetTopicPlacementHelperScript()');
			initAssetTopicPlacementHelperScript();

			// Note this helper-script has been applied to this form
			jQuery('.group-asset-topic-placement').addClass('helper-script-applied');
		}

	}, 100);

});

function initAssetTopicPlacementHelperScript() {

	updateAssetTopicPlacementCountClasses();

	// When the user touches a checkbox under the "Asset Topic Taxonomy" field... 
	jQuery('.field-name-field-asset-topic-taxonomy input').bind('click', function () {
		
		// I'm using setTimeout() to make [very] sure that this event fires AFTER the browser has handled the checkbox ticked-value alteration...
		setTimeout( function (tThis) {

			if ( tThis.checked ) {
				if ( jQuery('.group-asset-topic-placement').queue('fx').length < 3 ) {
					jQuery('.group-asset-topic-placement').queue( function () {

						jQuery('.group-asset-topic-placement').fadeIn();

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
				jQuery('.group-asset-topic-placement').fadeIn();
				injectRowIntoAssetPlacementField('#edit-field-asset-order-menu', tThis.value, jQuery(tThis).parent().find('label').text());
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
	}
}

/* Shows or hides each "Asset Topic Order" field based on weather to not 
 * the "Inherit this region's assets from parent" sibling-checkbox is ticked.
 */
function enforceAssetTopicOrderVisibilityBasedOnInheritance() {

	
	jQuery('.group-asset-topic-placement .form-item.form-type-checkbox label:contains("Inherit")').each( function () {
		var jqThis = jQuery(this);
		var inheritCheckbox = jqThis.siblings('input');
		var fieldsetContainer = jqThis.parents('.fieldset-wrapper').eq(0); // Search up the DOM from $(this) to the first div.fieldset-wrapper
		var assetTopicOrderField = fieldsetContainer.children('.field-widget-entityreference-view-widget');

		if ( inheritCheckbox.attr('checked') ) {
			assetTopicOrderField.fadeOut();
		} else {
			assetTopicOrderField.fadeIn();
		}
	});

}

function updateAssetTopicPlacementCountClasses() {

	// These classes are used for theming purposes in asset_topic_placement.css
	if ( jQuery('.field-name-field-asset-topic-taxonomy input:checked').length > 0 ) {
		jQuery('.group-asset-topic-placement').removeClass('term-count-0');
		jQuery('.group-asset-topic-placement').addClass('term-count-not-0');
	} else {
		jQuery('.group-asset-topic-placement').addClass('term-count-0');
		jQuery('.group-asset-topic-placement').removeClass('term-count-not-0');
	}

}

function alterTermsInAssetPlacementFields(callback) {

	jQuery('.group-asset-topic-placement').addClass('term-processing'); // This shows a spinner

	alterTermsInAssetPlacementField('#edit-field-asset-order-carousel', function () {
		alterTermsInAssetPlacementField('#edit-field-asset-order-content', function () {
			alterTermsInAssetPlacementField('#edit-field-asset-order-sidebar', function () {
				alterTermsInAssetPlacementField('#edit-field-asset-order-bottom', function () {

					jQuery('.group-asset-topic-placement').removeClass('term-processing'); // This removes the spinner

					// Trigger callback
					if ( typeof callback === 'function' ) {
						callback();
					}

				})
			})
		})
	});
}

function alterTermsInAssetPlacementField(fieldSelector, callback) {

	console.log('Now applying changes to the Asset-Topic-Placement-Field: ' + fieldSelector);

	// Get selected Asset-Topic Taxonomy terms
	var terms = [];
	jQuery('.field-name-field-asset-topic-taxonomy input:checked').each( function () {
		terms.push(this.value);
	});

	// Get nodes associated to these Asset-Topic taxonomy terms...
	jQuery.get('/atm/get-nodes-under-topics?terms='+terms.join(','), function (nodes) {
		for ( var x = 0 ; x < nodes.length ; x++ ) {
			injectRowIntoAssetPlacementField(fieldSelector, nodes[x].nid, nodes[x].title);
		}

		if ( typeof callback == 'function' ) {
			callback();
		}
	});

}

function injectRowIntoAssetPlacementField(fieldSelector, nodeId, nodeTitle) {

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
			<div class="form-item form-type-checkbox form-item-field-asset-order-content-und-VALUE_ID_HERE-target-id">\
	 			<input id="edit-field-asset-order-content-und-VALUE_ID_HERE" data-delta="VALUE_ID_HERE" type="checkbox" name="field_asset_order_content[und][VALUE_ID_HERE][target_id]" value="NODE_ID_HERE" class="form-checkbox">\
	 			<span class="field-suffix">\
	 				<label class="option" for="edit-field-asset-order-content-und-VALUE_ID_HERE">NODE_TITLE_HERE</label>\
	 			</span>\
			</div>\
		</td>\
		<td colspan=1 class="delta-order tabledrag-hide" style="display: none;">\
			<div class="form-item form-type-select form-item-field-asset-order-content-und-VALUE_ID_HERE--weight">\
	  			<label class="element-invisible">Weight </label>\
			 	<select id="edit-field-asset-order-content-und-VALUE_ID_HERE-weight" class="must-set-val field-asset-order-content-delta-order form-select" name="field_asset_order_content[und][VALUE_ID_HERE][_weight]">\
			 		<option value="-1">-1</option>\
			 		<option value="0">0</option>\
			 		<option value="1">1</option>\
			 	</select>\
			</div>\
		</td>\
	</tr>';

	var valId = jQuery(fieldSelector+' tr.draggable').length;
	var oddOrEven = ( jQuery(fieldSelector+' tr').last().hasClass('even') ? 'odd' : 'even' );
	newRowHTML = newRowHTML.replace(/VALUE_ID_HERE/g, valId);
	newRowHTML = newRowHTML.replace(/NODE_ID_HERE/g, nodeId);
	newRowHTML = newRowHTML.replace(/NODE_TITLE_HERE/g, nodeTitle);
	newRowHTML = newRowHTML.replace(/ODD_OR_EVEN/g, oddOrEven);

	jQuery(fieldSelector+' tbody').append(newRowHTML);
	updateWeightOptionsInAssetPlacementField(fieldSelector);
	jQuery(fieldSelector+' tbody tr').last().find('.field-asset-order-content-delta-order option').last().attr('selected', 'selected');
	jQuery(fieldSelector+' tbody tr').last().find('.field-asset-order-content-delta-order option').val( jQuery(fieldSelector+' tbody tr').last().find('.field-asset-order-content-delta-order option').last().val() );

	// Remove any "No items" message in this table
	jQuery('td:contains("No items have been added yet")').parent().remove();

	// Re-initialize the Drupal.tableDrag[~]
	var base = fieldSelector;
	base = base.replace('#edit-', '') + '-values';

	// Break bindings
	jQuery(fieldSelector).html( jQuery(fieldSelector).html() )

	// Remove all drag-handles in the table
	jQuery(fieldSelector+' a.tabledrag-handle .handle').remove();

	// Remove the "Show row weights" link in this table
	jQuery(fieldSelector).parent().find('a.tabledrag-toggle-weight').remove();

	Drupal.tableDrag[base] = new Drupal.tableDrag(jQuery('#'+base).get(0), Drupal.settings.tableDrag[base]);

	var dragTblObj = Drupal.tableDrag['field-asset-order-content-values']
	dragTblObj.showColumns();
	var newWeights = jQuery(fieldSelector+' .must-set-val');
	var track = 0;
	for ( var w = newWeights.length ; w > 0 ; w-- ) {
		alert( jQuery(fieldSelector+' tr').length - track );
		jQuery(newWeights[w]).val( jQuery(fieldSelector+' tr').length - track );
		jQuery(newWeights[w]).removeClass('must-set-val');
		track++;
	}
}

function updateWeightOptionsInAssetPlacementField(fieldSelector) {

	var maxWeight = jQuery(fieldSelector+' tr.draggable').length;
	jQuery(fieldSelector+' tr.draggable').each( function () {

		var weightSelect = jQuery(this).find('.field-asset-order-content-delta-order');

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

}