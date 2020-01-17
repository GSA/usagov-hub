<?php

// JKH added 
function reactDelete($term) {
	// JKH added for debug...
	// tracetofile(__FILE__,__LINE__,"reactDelete()");
	// traceobjects($term);
	
	// JKH note: changed this function so that it actually 
	// updates the weights of the numbers
	$thisParent = 0;
	$parents = taxonomy_get_parents($term->tid); 
	$numberOfParents = sizeof($parents);
	// tracetofile(__FILE__,__LINE__,"number of parents " . $numberOfParents);
	if($numberOfParents > 0) {
		// see if we need to update others
		// traceobjects($parents);
		foreach ($parents as $parent) {
			$thisParent = $parent->tid;
			break;
		}	
		// tracetofile(__FILE__,__LINE__,"term has parent id " . $thisParent);
		drupal_set_message(t(""));

		// JKH using my varibles thisParent
		// touch all siblings and update the changed time
		// in the two tables that track these things
		db_query("
			UPDATE {taxonomy_term_data} d
			SET d.changed = UNIX_TIMESTAMP(NOW())
			WHERE d.tid IN (
				SELECT h.tid 
				FROM {taxonomy_term_hierarchy} h
				WHERE h.tid AND h.parent = " . $thisParent . ")");
		db_query("
			UPDATE {taxonomy_dates} d
			SET d.changed = UNIX_TIMESTAMP(NOW())
			WHERE d.tid IN (
				SELECT h.tid 
				FROM {taxonomy_term_hierarchy} h
				WHERE h.tid AND h.parent = " . $thisParent . ")");

		// recalculate weight for all effected items
		// JKH order the data in the db query (vice sort)
		$siblingResults = db_query("
			SELECT 
				d.tid, d.name, d.weight, d.changed 
			FROM 
				{taxonomy_term_hierarchy} h
				JOIN {taxonomy_term_data} d ON (d.tid = h.tid)
			WHERE 
				h.parent = " . $thisParent . " 
			ORDER BY d.changed DESC, d.weight ASC, d.name ASC");
		$count = 0;
		while($sibling = $siblingResults->fetchAssoc())
		{
			// tracetofile(__FILE__,__LINE__,"db_query updating sibling " . $sibling['name'] . " weight " . $count);
			db_query("
				UPDATE taxonomy_term_data
				SET weight = " . $count++ . "
				WHERE tid = " . $sibling['tid']);		
		}		
	} else {
		// tracetofile(__FILE__,__LINE__,"term has no parent id");	
	}
	// 
	// JKH after deleting item, refresh entire page here!
	echo '<script type="text/javascript">window.parent.document.getElementById("frame").src="about:blank";window.parent.location.href=window.parent.location.href;</script>';
	flush();
	drupal_exit();
	// 
}

// JKH added 
function reactAddUpdate($term) {

	// JKH added for debug...
	// tracetofile(__FILE__,__LINE__,"reactAddUpdate()");
	// traceobjects($term);
	
	// JKH note: changed this function so that it actually 
	// updates the weights of the numbers
	$thisParent = 0;
	// JKH we are only checking parents for Site Structure Taxonomy (42)
	if($term->vid == 42) {  
		// tracetofile(__FILE__,__LINE__,"get parents");
		$parents = taxonomy_get_parents($term->tid); 
		$numberOfParents = sizeof($parents);
		// tracetofile(__FILE__,__LINE__,"number of parents " . $numberOfParents);
		// traceobjects($parents);
	    // tracetofile(__FILE__,__LINE__,"term is not ATT");
		// if this is not ATT, make sure that it has a parent
		if($numberOfParents == 0) {
			// tracetofile(__FILE__,__LINE__,"no parent!");
			drupal_set_message(t("You tried to save this taxonomy node without a parent node. Please assign a parent to this node before saving."), 'Error');
			$curr_uri = check_plain(request_uri());
			drupal_goto($curr_uri);        	
		} else {
			// traceobjects($parents);
			$numberOfParents = sizeof($parents);
			foreach ($parents as $parent) {
				$thisParent = $parent->tid;
				break;
			}
		}
	}
    // JKH added 
    // tracetofile(__FILE__,__LINE__,"term has parent id " . $thisParent);
	drupal_set_message(t(""));

	// JKH using my varibles thisParent
	// touch all siblings and update the changed time
	// in the two tables that track these things
	db_query("
		UPDATE {taxonomy_term_data} d
		SET d.changed = UNIX_TIMESTAMP(NOW())
		WHERE d.tid IN (
			SELECT h.tid 
			FROM {taxonomy_term_hierarchy} h
			WHERE h.tid AND h.parent = " . $thisParent . ")");
	db_query("
		UPDATE {taxonomy_dates} d
		SET d.changed = UNIX_TIMESTAMP(NOW())
		WHERE d.tid IN (
			SELECT h.tid 
			FROM {taxonomy_term_hierarchy} h
			WHERE h.tid AND h.parent = " . $thisParent . ")");

	// recalculate weight for all effected items
	// JKH order the data in the db query (vice sort)
	$siblingResults = db_query("
		SELECT 
			d.tid, d.name, d.weight, d.changed 
		FROM 
			{taxonomy_term_hierarchy} h
			JOIN {taxonomy_term_data} d ON (d.tid = h.tid)
		WHERE 
			h.parent = " . $thisParent . " 
		ORDER BY d.changed DESC, d.weight ASC, d.name ASC");
	$count = 0;
	while($sibling = $siblingResults->fetchAssoc())
	{
		// tracetofile(__FILE__,__LINE__,"db_query updating sibling " . $sibling['name'] . " weight " . $count);
		db_query("
			UPDATE taxonomy_term_data
			SET weight = " . $count++ . "
			WHERE tid = " . $sibling['tid']);		
	}
}

// JKH added 
hooks_reaction_add("hook_taxonomy_term_insert",function ($term) {
	// tracetofile(__FILE__,__LINE__,"hook reaction taxonomy term insert");
	reactAddUpdate($term); 
	}
);

// JKH added 
hooks_reaction_add("hook_taxonomy_term_update",function ($term) {
	// tracetofile(__FILE__,__LINE__,"hook reaction taxonomy term update"); 
	reactAddUpdate($term);   
	}
);

// JKH added 
hooks_reaction_add("hook_taxonomy_term_delete",function ($term) {
	// tracetofile(__FILE__,__LINE__,"hook reaction taxonomy term delete");
	reactDelete($term);
	}
);

// JKH added
hooks_reaction_add("hook_taxonomy_term_save",function ($term) {
	// tracetofile(__FILE__,__LINE__,"hook reaction taxonomy term save"); 
	reactAddUpdate($term);     
	}
);
