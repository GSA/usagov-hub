jQuery(document).ready(function (){       

    // this will be called from the child iframe page to redraw the tree after a new term has been created or a new parent has been selected
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

        var term_id = data.node.id;
        var currentUrl = jQuery('#frame').attr('src');

        
        currentUrl = currentUrl.replace('/taxonomy/term/', '');
        currentUrl = currentUrl.replace('/edit?hideHeader=1', '');

        if(term_id != currentUrl){
            jQuery('#frame').attr('src', '/taxonomy/term/'+term_id+'/edit?hideHeader=1');
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
        jQuery('#frame').load(function() {
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

