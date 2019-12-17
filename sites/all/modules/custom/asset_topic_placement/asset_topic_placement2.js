function setupAssetTopicEvents(){/* nothing to see here for now */};


jQuery(document).ready(function(){

	console.log('asset_topic_placement2.js doc ready');
    //Things to do on initial page load....
	
    //redraw this terms parent iframe page's jstree

    // Call back to the parent of this terms iframe and tell it to reload if needed.
    if ( window.hasOwnProperty('parent') && 'redrawTree' in window.parent )
    {
        window.parent.redrawTree();
        jQuery('input.form-submit').click(function(){
            window.parent.redrawTreeValue = true;
        });
    }

    var nodes = [];
    var selectedItemsArray = [];
    var selectedItemsArray = getCurrentlySelectedItems();
    var historyItemsArray  = getCurrentlySelectedItems();

    getNodes();
    regionPlacementToggle();
    parentTermWidget();
   
    // Things to do after someone selects a different asset topic from the asset topic taxonomy tree
    jQuery('input[name="field_asset_topic_taxonomy[und]"]').change(function() {
        nodes = [];
        selectedItemsArray = [];
        selectedItemsArray = getCurrentlySelectedItems();
		// JKH added 
		// console.log('getNodes()');
        getNodes();
    });

    function parentTermWidget(){

		// JKH added 
		// console.log('parentTermWidget()');
        var ep = document.getElementById('edit-parent');
        if ( ep ) { 
        	ep.setAttribute('size',20); 	
        }
        // JKH commented out return 
        // console.log('returning from parentTermWidget()');
        // return;

        // this var is to make sure the parent select box isn't affected on initial load of tree
        var initial_click = false;

        jQuery('fieldset#edit-relations').after('<div class="form-wrapper parent-taxonomy-term"><div class="form-item"><label for="">Parent Taxonomy Term</label><div id="parent-term"></div></div></div>');
        console.log("creating jstree on parent-term");
        jQuery('#parent-term').jstree({   // JKH rec'd error jstree is not a function!
            'core' : {
                'data' : {
                    'url' : '/admin/taxonomy-tree-widget/ajax/fulltree/42',
                },
                "multiple" : false,
            },
            'checkbox': {
                three_state: false,
                cascade: 'none'
            },
            "plugins": [
                "themes",
                "wholerow",
                "checkbox"
            ]
        }).on('ready.jstree', function () {
            //get selected parent and forces that selection on tree
            var existing_asset_id=jQuery('select#edit-parent option[selected="selected"]').val();
			// JKH added 
			console.log('ready.jstree');
            initial_click = true;
            jQuery('#parent-term').jstree(true).select_node(existing_asset_id);
			// JKH added 
			console.log('select node ' + existing_asset_id);            

            //remove currently edited term from the list in the tree
            var currentTermId = '';
            if (jQuery('#navigation ul.tabs li a:contains("Edit")').length > 0) {
                currentTermId = jQuery('#navigation ul.tabs li a:contains("Edit")').attr('href');
                currentTermId = currentTermId.replace('/taxonomy/term/', '');
                currentTermId = currentTermId.replace('/edit', '');
                jQuery('#parent-term').jstree(true).hide_node(currentTermId);
				// JKH added 
				console.log('hide current term id ' + currentTermId);                
            }
        });

        //updating parent using the select tree
        jQuery('#parent-term').on("select_node.jstree", function (e, data){
			// JKH added 
			console.log('on(select_node.jstree)');        
            if(initial_click == false) {
                var term_id = data.node.id;
                if(term_id.length > 0) {

                    jQuery('select#edit-parent option').each(function(){
                        jQuery(this).prop('selected',false);
                    });

                    var selector = 'select#edit-parent option[value="' + term_id + '"]';

                    jQuery(selector).trigger( "click" ).prop('selected',true).trigger('change');
                    // JKH added 
                    console.log('triggered click for term id ' + term_id);
                }
            }
            initial_click = false;
        });

        //added the weights field below the parent select tree
        var weightValue = jQuery('#edit-weight').val();
        jQuery('.parent-taxonomy-term').after('<div class="form-wrapper parent-taxonomy-term-weight"><div class="form-item"><label for="">Term Weight</label><input type="text" id="new-edit-weight" name="weight" size="6" maxlength="128" class="form-text required"></div></div>');
        jQuery('#new-edit-weight').val(weightValue);

        jQuery('#new-edit-weight').keyup(function(e){
            var weightValue = jQuery('#new-edit-weight').val();
            jQuery('#edit-weight').val(weightValue);
        }).keydown(function(e) {
            if ( e.which == 13 ) {
                e.preventDefault();
            }
        });

        jQuery('fieldset#edit-relations').hide();
    }


    function regionPlacementToggle(){

        if ( jQuery('#edit-field-type-of-page-to-generate-und').val() == 'home' ) {
            jQuery('.group-asset-placement').hide();
            jQuery('.group-homepage-container').show();
        } else {
            jQuery('.group-asset-placement').show();
            jQuery('.group-homepage-container').hide();
        }

        if ( jQuery('#edit-field-type-of-page-to-generate-und').val() != 'home'
            && jQuery('#edit-field-type-of-page-to-generate-und').val() != 'generic-navigation-page'
            && jQuery('#edit-field-type-of-page-to-generate-und').val() != 'more') {

            jQuery('#taxo_id_42').hide();
            jQuery('#tree_42').hide();
            jQuery('#edit-field-also-include-on-nav-page').hide();
        }
        else {
            jQuery('#taxo_id_42').show();
            jQuery('#tree_42').show();
            jQuery('#edit-field-also-include-on-nav-page').show();
        }

        jQuery('#edit-field-type-of-page-to-generate-und').change(function(){
            if ( jQuery('#edit-field-type-of-page-to-generate-und').val() == 'home' ) {
                jQuery('.group-asset-placement').hide();
                jQuery('.group-homepage-container').show();
            } else {
                jQuery('.group-asset-placement').show();
                jQuery('.group-homepage-container').hide();
            }

            if ( jQuery('#edit-field-type-of-page-to-generate-und').val() != 'home'
                && jQuery('#edit-field-type-of-page-to-generate-und').val() != 'generic-navigation-page'
                && jQuery('#edit-field-type-of-page-to-generate-und').val() != 'more') {

                jQuery('#taxo_id_42').hide();
                jQuery('#tree_42').hide();
                jQuery('#edit-field-also-include-on-nav-page').hide();
            }
            else {
                jQuery('#taxo_id_42').show();
                jQuery('#tree_42').show();
                jQuery('#edit-field-also-include-on-nav-page').show();
            }
        });

    }




    //Ajax call to get nodes associated to the selected term ids from asset-topics list
    function getNodes(){
        var tidAssetTopics = [];
        $tidAssetTopics = jQuery('input[name="field_asset_topic_taxonomy[und]"]');
        if ( $tidAssetTopics.length ) {
            tidAssetTopics = $tidAssetTopics.first().val().split(',');
            tidAssetTopics = tidAssetTopics.filter(function(v){return v!==''});
            jQuery.get('/atm/get-nodes-under-topics?terms='+tidAssetTopics.join(','), function (items) {
                nodes = items;
            }).done(function(data) {
                rebuildTable(data, selectedItemsArray, historyItemsArray);
                setSelectedItems(selectedItemsArray, historyItemsArray);
            });
        }
    }


    //Gets all items selected before the tables get destroyed and rebuilt
    function getCurrentlySelectedItems(){
        var fieldsetsAsset = [];

        jQuery('.group-asset-placement .vertical-tabs-panes fieldset .field-type-entityreference').each(function(){
            var selectedItems = [];
            var selector = '#' + jQuery(this).attr('id') + ' table tr input:checked';
            var id = jQuery(this).attr('id');

            jQuery(selector).each(function(){
                selectedItems.push(jQuery(this).val());
            });

            if(selectedItems.length > 0){
                fieldsetsAsset.push([id, selectedItems]);
            }
        });

        jQuery('.group-homepage-container .vertical-tabs-panes fieldset .field-type-entityreference').each(function(){
            var selectedItems = [];
            var selector = '#' + jQuery(this).attr('id') + ' table tr input:checked';
            var id = jQuery(this).attr('id');

            jQuery(selector).each(function(){
                selectedItems.push(jQuery(this).val());
            });

            if(selectedItems.length > 0){
                fieldsetsAsset.push([id, selectedItems]);
            }
        });

        return fieldsetsAsset;
    }


    //Sets the selected items in the tables after they have been rebuilt
    function setSelectedItems(items, itemsHistory){

        for (var i = 0; i < items.length; i++) {

            var item = items[i];
            var selector = '#' + item[0] + ' table tr input';
            var itemsChecked = item[1];

            jQuery(selector).each(function(){

                var inputValue = jQuery(this).val();

                for (var i = 0; i < itemsChecked.length; i++) {

                    var itemChecked = itemsChecked[i];

                    if(inputValue == itemChecked){
                        jQuery(this).prop('checked', true);
                    }
                }
            });
        }



        for (var i = 0; i < itemsHistory.length; i++) {

            var item = itemsHistory[i];
            var selector = '#' + item[0] + ' table tr input';
            var itemsChecked = item[1];

            jQuery(selector).each(function(){

                var inputValue = jQuery(this).val();

                for (var i = 0; i < itemsChecked.length; i++) {

                    var itemChecked = itemsChecked[i];

                    if(inputValue == itemChecked){
                        jQuery(this).prop('checked', true);
                    }
                }
            });
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


        // Remove any "No items" message in this table
        jQuery('td:contains("No items have been added yet")').parent().remove();

    }

    function updateWeightOptionsInAssetPlacementField(fieldSelector)
    {

        //adding the correct option drop down count
        var rowCount = jQuery(fieldSelector+' tr').length;

        jQuery(fieldSelector+' tr select option').remove();

        jQuery(fieldSelector+' tr select').each(function(){
            for(i = 0; i < rowCount; i++){
                jQuery(this).append('<option value="' + i + '">' + i + '</option>');
            }
        });


        //setting the correct selected option for each row
        jQuery(fieldSelector+' tbody tr .delta-order select').each(function(i){
            var value = i + '';
            jQuery(this).find('option[value=' + value + ']').attr('selected', 'selected');
        });


        // Mark this drag-table as needing to be reinitialized
        jQuery(fieldSelector).addClass('needs-dragtable-reinit');
        reinitializeDragTables();
    }


    function reinitializeDragTables()
    {

        jQuery('.needs-dragtable-reinit').each( function () {

            var jqThis = jQuery(this);
            jqThis.removeClass('needs-dragtable-reinit');
            var fieldSelector = '#' + jqThis.attr('id');

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

    // adds the edit link next to each node item in the asset placement area table
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

    // sorts the nodes from the ajax call using the selectedItemsArray and history and then rebuilds the table rows with sorted nodes.
    function rebuildTable(nodes, selectedItemsArray, historyItemsArray){
        jQuery('.group-asset-topic-placement tr, .group-homepage-container tr').remove();

        var tabSelectors = [
            'field-name-field-asset-order-carousel',
            'field-name-field-asset-order-content',
            'field-name-field-asset-order-sidebar',
            'field-name-field-asset-order-bottom',
            'field-name-field-home-alert-asset',
            'field-name-field-home-howdoi-assets',
            'field-name-field-home-whats-new-asset'
        ]

        jQuery(tabSelectors).each(function(){

            var targId = '#' + jQuery('.'+this).attr('id');
            var nId = '';
            var nTitle = '';
            var emptyNodes = jQuery.isEmptyObject(nodes);


            // Sorting the ajaxed nodes in the order of the previously checked nodes weights
            if(emptyNodes == false){

                if(selectedItemsArray.length != 0){
                    for(i = 0 ; i < selectedItemsArray.length; i++){
                        var tabId = targId.replace('#', '');
                        if(selectedItemsArray[i][0] == tabId){

                            var sort_by = selectedItemsArray[i][1];

                            //using slice(0) to clone the nodes array
                            var things_to_sort = nodes.slice(0);
                            var nodes_sorted  = [];

                            for(j = 0 ; j < sort_by.length ; j++){
                                var nid = parseInt(sort_by[j]);
                                for(k = 0; k < things_to_sort.length ; k++){
                                    if(things_to_sort[k].nid == nid){
                                        nodes_sorted.push(things_to_sort[k]);
                                        things_to_sort.splice(k,1);
                                    }
                                }
                            }

                            for(l=0; l<things_to_sort.length; l++){
                                nodes_sorted.push(things_to_sort[l]);
                            }

                        }
                    }
                } else {

                    if(historyItemsArray.length != 0){
                        for(i = 0 ; i < historyItemsArray.length; i++){
                            var tabId = targId.replace('#', '');
                            if(historyItemsArray[i][0] == tabId){

                                var sort_by = historyItemsArray[i][1];

                                //using slice(0) to clone the nodes array
                                var things_to_sort = nodes.slice(0);
                                var nodes_sorted  = [];

                                for(j = 0 ; j < sort_by.length ; j++){
                                    var nid = parseInt(sort_by[j]);
                                    for(k = 0; k < things_to_sort.length ; k++){
                                        if(things_to_sort[k].nid == nid){
                                            nodes_sorted.push(things_to_sort[k]);
                                            things_to_sort.splice(k,1);
                                        }
                                    }
                                }

                                for(l=0; l<things_to_sort.length; l++){
                                    nodes_sorted.push(things_to_sort[l]);
                                }

                            }
                        }
                    }
                }


                //build rows with sorted nodes or if none were checked previously just populate the rows with whatever order ajax returned
                if(nodes_sorted){
                    jQuery(nodes_sorted).each(function(){

                        if(this.nid.length !== 0 && this.title.length !== 0){
                            injectRowIntoAssetPlacementField(targId, this.nid, this.title);
                        }

                    });
                    updateWeightOptionsInAssetPlacementField(targId);
                } else {
                    jQuery(nodes).each(function(){

                        if(this.nid.length !== 0 && this.title.length !== 0){
                            injectRowIntoAssetPlacementField(targId, this.nid, this.title);
                        }

                    });
                    updateWeightOptionsInAssetPlacementField(targId);
                }
            }


        });

        // Updates the historyItemsArray, which keeps track of which items were ever checked in the asset topic placement area
        jQuery('.group-asset-placement table tr input.form-checkbox, .group-homepage-container table tr input.form-checkbox').change(function(){

            var tabName = jQuery(this).parent().parent().parent().parent().parent().parent().parent().parent().attr('id');

            if(jQuery(this).prop('checked') == true){


                var itemsParentInArray = false;
                for(i = 0; i < historyItemsArray.length; i++){
                    if(historyItemsArray[i][0] == tabName){
                        itemsParentInArray = true;
                    }
                }


                if(itemsParentInArray == true){
                    for(i = 0; i < historyItemsArray.length; i++){
                        if(historyItemsArray[i][0] == tabName){

                            var itemIndex = jQuery.inArray(jQuery(this).attr('value'), historyItemsArray[i][1]);
                            if(itemIndex == -1){
                                historyItemsArray[i][1].push(jQuery(this).attr('value'));
                            }
                        }
                    }
                } else {
                    var selectedItem = [];
                    selectedItem.push(jQuery(this).attr('value'));
                    historyItemsArray.push([tabName, selectedItem]);
                }


            } else {

                for(i = 0; i < historyItemsArray.length; i++){
                    if(historyItemsArray[i][0] == tabName){

                        var itemIndex = jQuery.inArray(jQuery(this).attr('value'), historyItemsArray[i][1]);
                        if (itemIndex != -1) {
                            historyItemsArray[i][1].splice(itemIndex, 1);
                        }
                    }
                }
            }


        });

    }

});
