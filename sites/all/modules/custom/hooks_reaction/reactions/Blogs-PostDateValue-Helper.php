<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to:
     - visually hide the "Blog Publish Date" from the text-asset form
     - update the "Blog Publish Date" field to the first time a text-asset becomes published

    [--] FYI [--]

    I could have just built logic into the Blog site to check node-history to determine 
    a blog's "post date" on the spot - but I am getting a gut feeling that Russell's team
    may want the ability to change a blog's "post date" in the future. 
    With this implementation, the work for that is already done - all you need to do is 
    unhide the "post date" field.
        
*/


hooks_reaction_add(
    array(
        "HOOK_form_text_content_type_node_form_alter",
        "HOOK_form_html_content_type_node_form_alter",
    ),
    function (&$form, &$form_state, $form_id) {

    	drupal_add_css('.field-name-field-blog-pub-date { display: none; }', 'inline');
    }
);


hooks_reaction_add("HOOK_workbench_moderation_transition",
    function ($node, $previous_state, $new_state) {

        // We only care about text-assets and html-assets here
        if ( empty($node->type) || ( $node->type !== 'text_content_type' && $node->type !== 'html_content_type' ) ) {
            return;
        }

        // We only react here when a text-asset is being published
        if ( $new_state !== 'published' ) {
            return;
        }

        // Lets not crash the site if the database isnt updated with this field
        if ( !db_table_exists('field_data_field_blog_pub_date') || !db_table_exists('field_revision_field_blog_pub_date') ) {

            error_log('ERROR - The CMP dosnt seem to have the field_blog_pub_date field! '
                .'Please create this text-field for text-assets.');
            
            return;
        }

        /* It should be fine to do this for ALL text-assets, since this field is is only 
        looked at by the Blog site. The other child-sites wont even bither looking at it*/
        $nowTime = time();

        // Update the "Blog Publish Date" field for this node
        db_query("
            UPDATE field_data_field_blog_pub_date 
            SET field_blog_pub_date_value = '{$nowTime}'
            WHERE
                entity_type = 'node'
                AND entity_id = {$node->nid}
                AND field_blog_pub_date_value = '-1'
        ");

        // Update the "Blog Publish Date" field - its fine to do this for all revisions of this node
        db_query("
            UPDATE field_revision_field_blog_pub_date 
            SET field_blog_pub_date_value = '{$nowTime}'
            WHERE
                entity_type = 'node'
                AND entity_id = {$node->nid}
                AND field_blog_pub_date_value = '-1'
        ");

        /* Since we went behind Drupal's back and updated a node directly in MySQL
        we'll need to flush the cache for this node. */
        entity_get_controller('node')->resetCache(array($node->nid));

    }
);

