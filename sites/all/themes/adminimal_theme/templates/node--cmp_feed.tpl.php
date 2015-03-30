<?php
	if ( user_is_logged_in() ) {
		drupal_set_message(
			'Note: You are viewing this page as a signed-in user. If you come to this same page while not signed in, '
				.'you will see only an RSS feed.',
			'status',
			false
		);
		print '<textarea style="width: 100%; min-height: 500px;" spellcheck="false">';
	} else {
		@ob_end_clean();
		while (@ob_end_clean());
		header('Content-Type: application/rss+xml');
		drupal_add_http_header('Content-Type', 'application/rss+xml');
	}
?><?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xml:base="http://<?php print $_SERVER['HTTP_HOST'] . request_uri(); ?>" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns:og="http://ogp.me/ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:sioct="http://rdfs.org/sioc/types#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
  <channel>
    <title><?php print $node->title; ?></title>
    <link>http://<?php print $_SERVER['HTTP_HOST'] . request_uri(); ?></link>
    <description><?php print $node->body['und'][0]['value']; ?></description>
    <language>en</language>
    <?php foreach ( $node->field_feed_items['und'] as $feedItem ): ?>
		<item>
			<title><?php print $feedItem['entity']->title; ?></title>
			<pubDate><?php
				$dt = new DateTime( $feedItem['entity']->field_feed_item_pubdate['und'][0]['value'] );
				print $dt->format('M d, Y H:i:s');
			?></pubDate>
			<link><?php print $feedItem['entity']->field_feed_item_link['und'][0]['value']; ?></link>
			<description><?php print $feedItem['entity']->body['und'][0]['value']; ?></description>
		</item>
	<?php endforeach; ?>
</channel>
</rss>
<?php
	if ( user_is_logged_in() ) {
		print '</textarea>';
	} else {
		exit();
	}
?>