
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

						alterTermsOnAssetTopicPlacementFields(function () {
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
				if ( jQuery('.group-asset-topic-placement').queue('fx').length < 3 ) {
					jQuery('.group-asset-topic-placement').queue( function () {

						jQuery('.group-asset-topic-placement').fadeIn();

						var addTids = [];
						jQuery('.field-name-field-asset-topic-taxonomy input:checked').each( function () {
							addTids.push(this.value);
						});

						jQuery('.group-asset-topic-placement').addClass('term-processing'); // This shows a spinner
						alterTermsOnAssetTopicPlacementField('.field-name-field-asset-order-menu', function () {
							updateAssetTopicPlacementCountClasses();
							jQuery('.group-asset-topic-placement').removeClass('term-processing'); // This removes the spinner
							jQuery('.group-asset-topic-placement').dequeue();
						});
					});
				}
			} else {
				jQuery('.group-asset-topic-placement').queue( function () {
					jQuery('.field-name-field-asset-order-menu input[value=' + tThis.value + ']').parents('tr').remove();
					updateAssetTopicPlacementCountClasses();
					jQuery('.group-asset-topic-placement').dequeue();
				});
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
		alterTermsOnAssetTopicPlacementFields(function () {
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

function alterTermsOnAssetTopicPlacementFields(callback) {

	jQuery('.group-asset-topic-placement').addClass('term-processing'); // This shows a spinner

	alterTermsOnAssetTopicPlacementField('.field-name-field-asset-order-carousel', function () {
		alterTermsOnAssetTopicPlacementField('.field-name-field-asset-order-content', function () {
			alterTermsOnAssetTopicPlacementField('.field-name-field-asset-order-sidebar', function () {
				alterTermsOnAssetTopicPlacementField('.field-name-field-asset-order-bottom', function () {

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

function alterTermsOnAssetTopicPlacementField(fieldSelector, callback) {

	console.log('Now applying changes to the Asset-Topic-Placement-Field: ' + fieldSelector);

	// Remember what was and was not check in this field (we are about to change them)
	var originalValues = [];
	jQuery(fieldSelector + ' input[type="checkbox"]').each( function () {
		originalValues.push({
			tid: this.value,
			checked: this.checked
		});
	});

	// Temporarily set all checkboxes in this field to ticked, so they do not get lost in the next form submission
	jQuery(fieldSelector + ' input[type="checkbox"]').attr('checked', true);

	// Click the "Add items" button for this field
	jQuery(fieldSelector + ' input[type="submit"]').focus();
	jQuery(fieldSelector + ' input[type="submit"]').mousedown();

	// Wait for the modal entity-reference-view-widget to show...
	console.log('Waiting for the modal entity-reference-view-widget to show...');
	jQuery('.view-display-id-entityreference_view_widget_1').waitUntilExists( function () {

		// Tick every checkbox in the modal form
		jQuery('a#entityreference-view-widget-select-all').click();

		// Click the "Submit" button in the View
		jQuery('#edit-ervw-submit').mousedown();

		// Wait for the "Submit" button to process (waitr for the modal form to close)
		console.log('Waiting for the "Submit" button to process...');
		jQuery('#modalContent').waitUntilNotExists( function () {

			// Set the checkbox(s) to be unticked by default
			jQuery(fieldSelector + ' input[type="checkbox"]').attr('checked', false);

			// Restore checkbox values
			for ( var x = 0 ; x < originalValues.length ; x++ ) {
				jQuery(fieldSelector + ' input[value="' + originalValues[x].tid + '"]').get(0).checked = originalValues[x].checked;
			}

			console.log('alterTermsOnAssetTopicPlacementField() functionality complete');

			// Trigger callback
			if ( typeof callback === 'function' ) {
				callback();
			}

		});

	});

}
