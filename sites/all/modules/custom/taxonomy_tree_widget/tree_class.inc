<?php

class JSTaxTree
{
	var $terms;
	var $hier;
	var $json;
	
	public function __construct( $vid )
	{
		// JKH 
		// tracetofile(__FILE__,__LINE__,"__construct(" . $vid . ")");
		//$this->get_node();
		//$this->options = array_merge($this->default, $options);
		$this->terms = taxonomy_get_tree($vid,0);
		/*$this->terms = [
			{ id:1.1, parent:1 },
			{ id:1,   parent:0 },
			{ id:2,   parent:0 },
			{ id:1.2, parent:1.1 },
			{ id:1.3, parent:1.2 }
		]*/
		$this->hier_from_terms();
		/*this->hier = {
			1:   { name:'foo',    children:[1.1], top:true }
			1.1: { name:'foo1.1', children:[1.2] }
			1.2: { name:'foo1.2', children:[1.3] }
			2:   { name:"bar",    children:[], top:true }
		}*/
		$this->json_from_hier();
		/*$this->json = [
			{ id:1, name:foo, children:[
				{ id:1.1, name:foo1.1, children:[	
					{ id:1.2, name:foo1.1, children:[	
						{ id:1.3, name:foo1.1, children:[
						]}
					]}
				]}
			]},
			{ id:2, name:bar, children:[] }
		]
		*/
	}
	
	private function hier_from_terms()
	{
		// JKH 
		// tracetofile(__FILE__,__LINE__,"hier_from_terms()");
		$this->hier = array();
		foreach($this->terms as $term_info)
		{
			$parent_tid = $term_info->parents[0];
			
			$term = new stdClass();
			$term->id = $term_info->tid; 
			$term->text = $term_info->name;
			$term->children = array();
			$term->top = ($parent_tid==='0');
			$this->hier[$term->id] = $term;
			if($parent_tid && isset($this->hier[$parent_tid]) )
			{
				$this->hier[$parent_tid]->children[] = $term_info->tid;
			}
			
		}
	}
	
	private function json_from_hier()
	{
		// JKH 
		// tracetofile(__FILE__,__LINE__,"json_from_hier()");
		$this->json_obj = array();
		foreach($this->hier as $tid => $hier_info)
		{
			if ( $hier_info->top )
			{
				$this->json_obj[] = $this->jstree_format($tid);
			}			
		}
	}

	private function jstree_format( $tid )
	{
		// JKH  
		// tracetofile(__FILE__,__LINE__,"jstree_format()");
		$hier_info = $this->hier[$tid];

		$item = new stdClass();
		$item->id   = $tid;
		$item->text = $hier_info->text;
		$item->children = array();
		foreach ( $hier_info->children as $child_tid )
		{
			$item->children[] = $this->jstree_format( $child_tid );
		}
		return $item;
	}
	
	public function add_term($par_term_id,$term_name)
	{
		$term = new stdClass(); 
		$term->vid=42; 
		$term->name=$term_name;
		$term->parent=$par_term_id;
		taxonomy_term_save($term);
		// JKH 
		// tracetofile(__FILE__,__LINE__,"taxonomy_term_save()");		
	}

}