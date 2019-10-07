<?php
hooks_reaction_add([
        "hook_taxonomy_term_validate",
    ],function ($term) {
       tracetofile(__FILE__,__LINE__,"hook v");
    }
);

hooks_reaction_add([
        "hook_taxonomy_term_update",
        "hook_taxonomy_term_save",
        // JKH added presave
        "hook_taxonomy_term_presave", 
    ],function ($term) {
        // tracetofile(__FILE__,__LINE__,"hook u s p");
        // JKH added  
        if(!isset($term->parent) || empty($term->parent)) {
        	// tracetofile(__FILE__,__LINE__,"no parent!");
        	drupal_set_message(t("You tried to save this taxonomy node without a parent node. Please assign a parent to this node before saving."), 'Error');
        	$curr_uri = check_plain(request_uri());
			drupal_goto($curr_uri);        	
        }
        // tracetofile(__FILE__,__LINE__,"parent is set to ... ");
        // traceobjects($term->parent);
        drupal_set_message(t(""));
        /// if we are changing the weight of an object,
        /// that might effect the weight of all of it's siblings,
        /// so all siblings need to be seen as 'updated' too

        /// I think the logic is clearer this way, even though
        /// it could be turned into a fancy one-liner
        $weight_change = false;
        if ( !property_exists($term,'original') )
        {
            /// if we are saving a new object, it won't have an original
            /// and that counts as a change, so we need to update
            /// it's siblings weights as well
            $weight_change = true;
        } else if ( property_exists($term->original,'weight')
            && property_exists($term,'weight')
            && $term->original->weight !== $term->weight )
        {
            /// if we are updating the object and it's weight
            /// has explicitly changed
            $weight_change = true;
        }
        if ( !$weight_change )
        {
            return;
        }

        /// touch all siblings and update the changed time
        /// in the two tables that track these things
        db_query("
            UPDATE {taxonomy_term_data} d
            SET d.changed = UNIX_TIMESTAMP(NOW())
            WHERE d.tid IN (
                SELECT h.tid 
                FROM {taxonomy_term_hierarchy} h
                WHERE h.tid
                    AND h.parent = :parent
            )
        ",[':parent'=>$term->parent]);
        db_query("
            UPDATE {taxonomy_dates} d
            SET d.changed = UNIX_TIMESTAMP(NOW())
            WHERE d.tid IN (
                SELECT h.tid 
                FROM {taxonomy_term_hierarchy} h
                WHERE h.tid
                    AND h.parent = :parent
            )
        ",[':parent'=>$term->parent]);

        /// recalculate weight for all effected items
        $siblingResults = db_query("
            SELECT 
                d.tid, d.name, d.weight 
            FROM 
                {taxonomy_term_hierarchy} h
                JOIN {taxonomy_term_data} d ON (d.tid = h.tid)
            WHERE 
                h.parent = :parent
        ",[':parent'=>$term->parent]);
        /// put these into array format so we can make user of _multisort func
        $siblings = [];
        while( $siblingArray = $siblingResults->fetchAssoc() )
        {
            $siblings[] = $siblingArray;
        }
        array_multisort(
            array_column($siblings,'weight'),SORT_ASC,
            array_column($siblings,'name'),  SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($siblings,'tid'),   SORT_ASC,
            $siblings);

        /// convert these into one sql update query
        $sql_values = [];
        foreach ( $siblings as $weight=>&$sibling )
        {
            $sql_values[] = "({$sibling['tid']},{$weight})";
        }
        db_query("
            INSERT INTO {taxonomy_term_data} 
                (tid,weight) 
            VALUES 
                ".implode(',',$sql_values)." 
            ON DUPLICATE KEY UPDATE 
                weight=VALUES(weight)
        ");
    }
);
