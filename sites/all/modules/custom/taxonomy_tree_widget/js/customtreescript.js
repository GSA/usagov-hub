jQuery(document).ready(function (){       

    // this will be called from the child iframe page to redraw the tree 
    // after a new term has been created or a new parent has been selected
    redrawTreeValue = false;
    redrawTree = function(){
        if(redrawTreeValue == true){
            redrawTreeValue = false;
            jQuery('#tree').jstree(true).refresh();
        }
    }

    jQuery('#treeWrap iframe.data_iframe, #treeWrap').height(getHeight());
    jQuery(window).resize(function () {
        jQuery('#treeWrap iframe.data_iframe, #treeWrap').height(getHeight());
    });

    // creating the navigation tree for the iframe
    jQuery('#tree').jstree({
        'core' : {
            'data' : {
                'url' : '/admin/taxonomy-tree-widget/ajax/fulltree/42',
                'data' : function (node) {
                    return { 'id' : node.id };
                }
            },
        },
        'force_text' : true,
        'plugins' : ['state','wholerow']
        
    })

    //changing iframe location based on selection
    jQuery('#tree').on("select_node.jstree", function (e, data){
    	// JKH added 
		// console.log("dimmy, why you do this to me?");
        var term_id = data.node.id;
        var currentUrl = jQuery('#frame').attr('src');

        
        currentUrl = currentUrl.replace('/taxonomy/term/', '');
        currentUrl = currentUrl.replace('/edit?hideHeader=1', '');
        // JKH added 
        // console.log("current Url " + currentUrl);
        if(term_id != currentUrl){
        	// JKH looking into this ...., this is where the tax term edit form is loaded...
        	// console.log('before' + '/taxonomy/term/'+term_id+'/edit?hideHeader=1');
            jQuery('#frame').attr('src', '/taxonomy/term/'+term_id+'/edit?hideHeader=1');
            // console.log('after');
        }        
    });

    // load new term page in iframe when user clicks 'create' button on left nav area               
    function create_term(){
        var ref = jQuery('#tree').jstree(true),
        sel = ref.get_selected();
        if(!sel.length) { return false; }
        term_id=sel[0];
        sel = sel[0];
        

        jQuery('#frame').hide();
        jQuery('#frame').attr('src', '/admin/structure/taxonomy/site_strucutre_taxonomy/add?hideHeader=1');
        jQuery('#frame').show();
        // JKH attempting fix a.indexOf is not a function
        // jQuery('#frame').load(function() {
        jQuery('#frame').on('load', function() {
            jQuery('#frame').contents().find('#edit-parent').val(term_id);
        });  
    }

    function getHeight(){
        var offsetheight = jQuery('#treeWrap').offset().top
        var height = jQuery(window).height() - offsetheight;
        height = height - 10;
        return height;
    }

    jQuery('.create-new-term').click(function(){
        create_term();
    });
    
});
	
function tweakIframeCSS()
{
    var iframe = document.getElementById('frame');
    var style = document.createElement('style');
    // JKH changed this to accommodate the new type for edit-cancel
    style.textContent = '\
        .form-actions {\
            position: fixed;\
            bottom: 0;\
            left: 0;\
            width: 100%;\
            background-color: white;\
            margin: 0px;\
            padding: 0px;\
        }\
        .form-actions input#edit-submit[type="submit"]  {\
            margin: 14px 0px 0px 14px;\
        }\
        .form-actions input#edit-delete[type="submit"],\
        .form-actions input#edit-cancel[type="submit"] {\
            display: block;\
            float: right;\
            margin: 14px 14px 0px 0px;\
        }\
    ';
    iframe.contentDocument.head.appendChild(style);
}