<?php
/*
hooks_reaction_add([
        "hook_taxonomy_term_update",
        "hook_taxonomy_term_save"
    ],function ($term) {
        error_log("\nWEIGHT UPDATE FOR {$term->tid}\n");
        /// if we are changing the weight of an object
        /// that might effect the weight of all of it's siblings
        /// so all siblings need to be seen as 'updated' too
        
        /// I think the logic is clearer this way, even though
        /// it could be turned into a fancy one-liner
        $weight_change = false;
        if ( !property_exists($term,'original') )
        {
            /// if we are saving a new object, it won't have an original
            /// and that counts as a change to it's siblings weights
            $weight_change = true;
        } else if ( property_exists($term->original,'weight') 
                 && property_exists($term,'weight') 
                 && $term->original->weight !== $term->weight ) 
        {
            $weight_change = true;
        }
        if ( !$weight_change )
        {
            return;
        }
        /// touch all siblings and update the changed time
        /// in the two tables that track it
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

        $minWeight = min($term->original->weight,$term->weight);
        $maxWeight = max($term->original->weight,$term->weight);

        /// items where weight >=  min(orig,new) and weight <= max(orig,new)
        db_query("
            SELECT 
                d.tid, d.name, d.weight 
            FROM 
                {taxonomy_term_hierarchy} h
                JOIN {taxonomy_term_data} d ON (d.tid = h.tid)
            WHERE 
                h.parent = :parent
                AND d.weight BETWEEN :minWeight AND :maxWeight
        ")->fetchAll();


        array_multisort(
            array_column($menu,'weight'),SORT_ASC,
            array_column($menu,'name'),  SORT_ASC,SORT_STRING|SORT_FLAG_CASE,
            array_column($menu,'tid'),   SORT_ASC,
            $menu);

        foreach ( $menu as &$menuItem )
        {
            if ( !empty($this->source->entities[$menuItem['uuid']]) )
            {
                $menuItem['menu'] = $this->buildMainNavSubMenu($this->source->entities[$menuItem['uuid']]);
            }
        }

        INSERT INTO {taxonomy_term_data} (tid,weight) VALUES ()
        
    }
);
*/