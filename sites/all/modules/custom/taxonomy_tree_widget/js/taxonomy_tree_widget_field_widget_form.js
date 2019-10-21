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
        var source = jQuery('#taxo_id_'+widgetVid);
        var tree   = jQuery('#tree_'+widgetVid);
        //source.attr('readonly','readonly');
        loadTreeFromSource(tree,source);
        source.change(function(){
            cleanSource(source);
            loadTreeFromSource(tree,source);
        });
    }).on('select_node.jstree', function(e, data) {
        var source = jQuery('#taxo_id_'+widgetVid);
        if (source.val().length <= 0)
        {
            source.val(data.node.id).trigger('change');
        }
        else
        {
            tid_array = stringToTids(source.val());
            if ( ! tid_array.includes(data.node.id) )
            {
                tid_array.push(data.node.id);
                source.val(tid_array.join(',')).trigger('change')
            }
        }
    }).on('deselect_node.jstree', function(e, data) {
        var source = jQuery('#taxo_id_'+widgetVid);
        var tid_array = stringToTids(source.val())
            .filter(function(val){
                return (data.node.id != val);
            });
        source.val(tid_array.join(',')).trigger('change');
    });
	
    function cleanSource(source)
    {
        vid = source.attr('id').replace(/^taxo_id_/,'');
        tree_id = 'tree_'+vid;
        tid_array = stringToTids(source.val())
            .filter(function(val){
                return ( jQuery('#'+tree_id+' li#'+val).length > 0 );
            });
        source.val(tid_array.join(','));
    }

    function loadTreeFromSource(tree,source)
    {
        tid_array = stringToTids(source.val());
        tree.jstree("deselect_all");
        tree.jstree(true).select_node(tid_array);
    }

    function stringToTids(stringTids)
    {
        return stringTids
            .split(/(\b|,+|\s+)/)
            .map(function(val){
                return val.replace(/\D/,'');
            })
            .filter(function(val){
                return val.length > 0
            });
    }

}



