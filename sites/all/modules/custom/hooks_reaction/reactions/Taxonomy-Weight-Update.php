<?php
hooks_reaction_add([
        "hook_taxonomy_term_validate"
    ],function ($term) {
       // tracetofile(__FILE__,__LINE__,"hook v");
    }
);

hooks_reaction_add([
        "hook_taxonomy_term_delete"
    ],function ($term) {
       // tracetofile(__FILE__,__LINE__,"hook d");
    }
);

hooks_reaction_add([
        "hook_taxonomy_term_update",
        "hook_taxonomy_term_save"
    ],function ($term) {
    	// tracetofile(__FILE__,__LINE__,"hook u s");
        // tracetofile(__FILE__,__LINE__,"===>hook u s p, let's look at term object");
        // traceobjects($term);
        // tracetofile(__FILE__,__LINE__,"===>end");
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
        // JKH removed the lines that imposed condition on database write.
		// ....
		
        // touch all siblings and update the changed time
        // in the two tables that track these things
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

        // recalculate weight for all effected items
        $siblingResults = db_query("
            SELECT 
                d.tid, d.name, d.weight 
            FROM 
                {taxonomy_term_hierarchy} h
                JOIN {taxonomy_term_data} d ON (d.tid = h.tid)
            WHERE 
                h.parent = :parent
        ",[':parent'=>$term->parent]);
        // put these into array format so we can make user of _multisort func
        $siblings = [];
        while( $siblingArray = $siblingResults->fetchAssoc() )
        {
            $siblings[] = $siblingArray;
        }
        // tracetofile(__FILE__,__LINE__,"****siblings before sort");
        // traceobjects($siblings);
        array_multisort(
            array_column($siblings,'weight'),SORT_ASC,
            array_column($siblings,'name'),  SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($siblings,'tid'),   SORT_ASC,
            $siblings);
        // tracetofile(__FILE__,__LINE__,"****siblings after sort");
        // traceobjects($siblings);
        // convert these into one sql update query
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
