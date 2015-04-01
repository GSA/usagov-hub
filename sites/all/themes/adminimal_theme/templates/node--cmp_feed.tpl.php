<?php

	$output = false;
	$headContType = false;

	$feedMode = $node->field_feed_type['und'][0]['value'];

	switch ($feedMode) {
		case 'RSS Feed':
			$output = trim($node->field_feed_rss_markup['und'][0]['value']);
			$headContType = 'application/rss+xml';
			break;
		case 'JSON Feed':
			$output = trim($node->field_json_feed_markup['und'][0]['value']);
			$headContType = 'application/json';
			break;
		default:
			$output = 'ERROR - Unrecognized Feed-Type';
			break;
	}

	// Handel general replacement-patterns
	$output = str_replace('[title]', $node->title, $output);
	$output = str_replace('[items]', renderFeedItems($feedMode, $node), $output, $output);
	$output = str_replace('[description]', $node->body['und'][0]['value'], $output);
	$output = str_replace('[request-path]', 'http://'.$_SERVER['HTTP_HOST'] . request_uri(), $output);

	// Handel JSONP callback/jsoncallback replacement-pattern
	$callback = 'null';
	if ( !empty($_REQUEST['callback']) ) {
		$callback = $_REQUEST['callback'];
	}
	if ( !empty($_REQUEST['jsoncallback']) ) {
		$callback = $_REQUEST['jsoncallback'];
	}
	$output = str_replace('[callback]', $callback, $output);

	if ( user_is_logged_in() ) {

		print '<h1>Note: You are viewing this page as a signed-in user. If you come to this same page while '
			.'not signed in, you will see the feed alone.</h1>';
		print '<style>.workbench-info-block { display: none !important; }</style>';
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

		if ( !empty($feedNode->field_feed_items['und']) ) {
			foreach ( $feedNode->field_feed_items['und'] as $nidContainer ) {
				$nodeItem = node_load($nidContainer['target_id']);
				$retMarkups[] = renderFeedItem($feedMode, 'node_feeditem', $nodeItem);
			}
		}

		if ( !empty($feedNode->field_feed_items_terms['und']) ) {
			foreach ( $feedNode->field_feed_items_terms['und'] as $tidContainer ) {
				$termItem = taxonomy_term_load($tidContainer['target_id']);
				$retMarkups[] = renderFeedItem($feedMode, 'term_site_structure', $termItem);
			}
		}

		if ( $feedMode == 'RSS Feed' ) {
			return trim(implode('', $retMarkups));
		} else {
			return trim(implode(',', $retMarkups));
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

				// Get the taxonomy-term's top-level parent item, in order to tell which domain the link should point to
				$termParents = taxonomy_get_parents_all($itemEntity->tid);
				$termTopParent = array_pop($termParents);
				switch ( strtolower($termTopParent->name) ) {
					case 'usa.gov':
						$linkDomain = 'http://usa.gov/';
						break;
					case 'kids.gov':
						$linkDomain = 'http://kids.usa.gov/';
						break;
					case 'gobiernousa.gov':
						$linkDomain = 'http://www.usa.gov/gobiernousa/';
						break;
					default:
						$linkDomain = '!ERROR!(Unrecognized Top Level Taxonomy Term)!/ERROR!';
				}

				// Parse out the URL-path from the "Friendly URL" (this field value may or may not be a full absolute-path)
				$friendlyUrl = $itemEntity->field_friendly_url['und'][0]['value'];
				if ( strpos($friendlyUrl, 'http://') === 0 || strpos($friendlyUrl, 'https://') === 0 ) {
					$friendlyUrl = parse_url($friendlyUrl, PHP_URL_PATH);
				}

				// Concatenate the full link-target
				$linkTarget = $linkDomain . ltrim($friendlyUrl, '/');

				$retItemMarkup = str_replace('[title]', $itemEntity->field_page_title['und'][0]['value'], $retItemMarkup);
				$retItemMarkup = str_replace('[pubDate]', date( ($feedMode == 'RSS Feed' ? 'M d, Y H:i:s' : 'm/d/Y'), $updateUnixTime), $retItemMarkup);
				$retItemMarkup = str_replace('[link]', $linkTarget, $retItemMarkup);
				$retItemMarkup = str_replace('[description]', $itemEntity->description, $retItemMarkup);
				break;
		}

		return $retItemMarkup;
	}

?>