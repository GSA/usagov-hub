<?php

	$output = false;
	$headContType = false;

	$feedMode = $node->field_feed_type['und'][0]['value'];

	switch ($feedMode) {
		case 'RSS Feed':
			$output = $node->field_feed_rss_markup['und'][0]['value'];
			$headContType = 'application/rss+xml';
			break;
		case 'JSON Feed':
			$output = $node->field_json_feed_markup['und'][0]['value'];
			$headContType = 'application/json';
			break;
		default:
			$output = 'ERROR - Unrecognized Feed-Type';
			break;
	}

	$output = str_replace('[title]', $node->title, $output);
	$output = str_replace('[items]', renderFeedItems($feedMode, $node), $output, $output);
	$output = str_replace('[description]', $node->body['und'][0]['value'], $output);
	$output = str_replace('[request-path]', 'http://'.$_SERVER['HTTP_HOST'] . request_uri(), $output);

	if ( user_is_logged_in() ) {

		drupal_set_message(
			'Note: You are viewing this page as a signed-in user. If you come to this same page while not signed in, '
				.'you will see only an RSS feed.',
			'status',
			false
		);

		print '<textarea style="width: 100%; min-height: 500px;" spellcheck="false">'.$output.'</textarea>';

	} else {

		@ob_end_clean();
		while (@ob_end_clean());
		header('Content-Type: '.$headContType);
		drupal_add_http_header('Content-Type', $headContType);
		print $output;
		exit();
	}

	function renderFeedItems($feedMode, $feedNode) {

		$retMarkups = array();

		foreach ( $feedNode->field_feed_items['und'] as $nidContainer ) {
			$nodeItem = node_load($nidContainer['target_id']);
			$retMarkups[] = renderFeedItem($feedMode, 'node_feeditem', $nodeItem);
		}

		foreach ( $feedNode->field_feed_items_terms['und'] as $tidContainer ) {
			$termItem = taxonomy_term_load($tidContainer['target_id']);
			$retMarkups[] = renderFeedItem($feedMode, 'term_site_structure', $termItem);
		}

		if ( $feedMode == 'RSS Feed' ) {
			return implode('', $retMarkups);
		} else {
			return implode(',', $retMarkups);
		}
		
	}

	function renderFeedItem($feedMode, $itemType, $itemEntity) {

		$retItemMarkup = '';

		// Define template
		switch ($feedMode) {
			case 'RSS Feed':
				$retItemMarkup = "
					<item>
						<title>[title]</title>
						<pubDate>[pubDate]</pubDate>
						<link>[link]</link>
						<description>[description]</description>
					</item>";
				break;
			case 'JSON Feed':
				$retItemMarkup = '
					{
						"ARTICLE": "CONTENT FLAG SET TO NO",
						"LASTUPDATE": "[pubDate]",
						"TITLE": "[title]",
						"URL": "[link]"
					}';
				break;
		}

		// Plug in data into template
		switch ($itemType) {
			case 'node_feeditem':
				$dt = new DateTime($itemEntity->field_feed_item_pubdate['und'][0]['value']);
				$retItemMarkup = str_replace('[title]', $itemEntity->title, $retItemMarkup);
				$retItemMarkup = str_replace('[pubDate]', ($dt->format( $feedMode == 'RSS Feed' ? 'M d, Y H:i:s' : 'm/d/Y') ), $retItemMarkup);
				$retItemMarkup = str_replace('[link]', $itemEntity->field_feed_item_link['und'][0]['value'], $retItemMarkup);
				$retItemMarkup = str_replace('[description]', $itemEntity->body['und'][0]['value'], $retItemMarkup);
				break;
			case 'term_site_structure':
				
				// Get the date of the last time this term was updated/changed
				$updateUnixTime = db_query("SELECT changed FROM taxonomy_dates WHERE tid=".$itemEntity->tid)->fetchColumn();
				if ( $updateUnixTime === false ) {
					$updateUnixTime = time();
				}

				$retItemMarkup = str_replace('[title]', $itemEntity->field_page_title['und'][0]['value'], $retItemMarkup);
				$retItemMarkup = str_replace('[pubDate]', date( ($feedMode == 'RSS Feed' ? 'M d, Y H:i:s' : 'm/d/Y'), $updateUnixTime), $retItemMarkup);
				$retItemMarkup = str_replace('[link]', $itemEntity->field_friendly_url['und'][0]['value'], $retItemMarkup);
				$retItemMarkup = str_replace('[description]', $itemEntity->description, $retItemMarkup);
				break;
		}

		return $retItemMarkup;
	}

?>