function treewidgetforms(widgetVid){


    jQuery('#tree_'+widgetVid).jstree({

        'core' : {
            'data' : {
                'url' : '/admin/taxonomy-tree-widget/ajax/fulltree/'+widgetVid,
                'data' : function (node) {
                    return { 'id' : node.id };
                }
            },
            'check_callback' : true,
            'themes' : {
                'responsive' : false
            }
        },
        'checkbox' : {
            three_state : false, 
            cascade : 'undetermined'
            
        },
        'force_text' : true,
        'plugins' : ['checkbox']
        
    }).on('ready.jstree', function () {
        var get_existing_assets=jQuery('#taxo_id_'+widgetVid).val();
        tid_array = get_existing_assets.split(',');
        for ( var i = 0, l = tid_array.length; i < l; i++ ) {
            jQuery('#tree_'+widgetVid).jstree(true).select_node(tid_array[i]);
        }
    }).on('select_node.jstree', function(e, data) {
        if (jQuery('#taxo_id_'+widgetVid).val().length <= 0)
        {
            jQuery('#taxo_id_'+widgetVid).val(data.node.id).trigger('change');
        }
        else
        {
            if(jQuery('#taxo_id_'+widgetVid).val().indexOf(data.node.id) < 0)
            {
                var newval=jQuery('#taxo_id_'+widgetVid).val() + ','+data.node.id;
                //jQuery('#taxo_id_{$vid}').attr('value',newval);
                jQuery('#taxo_id_'+widgetVid).val(newval).trigger('change');
            }
        }
        
        
        
    }).on('deselect_node.jstree', function(e, data) {
        
        var regex = new RegExp('([,]?'+data.node.id+')','g');
        
        jQuery('#taxo_id_{$vid}').val(jQuery('#taxo_id_'+widgetVid).val().replace(regex, '')).trigger('change');
        
    });



}



