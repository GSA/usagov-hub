<?php

die('was only meant to be run once. it will wipe data. be careful.');

/// clear text_content
//$num_deleted = db_delete('node')
//	->condition('type','text_content_type')
//	->execute();

/// pull text_assets
$nids = db_select('node', 'n')
    ->fields('n', array('nid'))
    ->fields('n', array('type'))
    ->condition('n.type', 'text_asset')
    ->execute()
    ->fetchCol();
$asset_nodes = node_load_multiple($nids);

/// map assets to text_content
foreach ( $asset_nodes as $nid => $asset_node )
{
	/*
	$values = array(
		'uid'      => 1,
		'type'     => 'text_content_type',
        	'status'   => $asset_node->status,
		'comment'  => $asset_node->comment,
		'language' => $asset_node->language,
		'promote'  => 0,
		'sticky'   => 0,
	);
	$entity = entity_create('node',$values);
	$meta   = entity_metadata_wrapper('node',$entity);
	$asset  = entity_metadata_wrapper('node',$asset_node);

	$meta->field_title_long->set($asset->title->value());
	$meta->field_title_short->set($asset->title->value());
	$meta->field_description->set($asset->field_description->value());
	$meta->field_language->set($asset->field_language->value());
	$meta->field_comments->set($asset->field_notes->value());
	$meta->body->set($asset->field_text_asset_body->value());

	$new_node = $meta->save();
	*/
}

