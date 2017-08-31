<?php /*
	Note that the variables given to this TPL file have been 
	manipulated by cmp_feeds.module's cmp_feeds_preprocess_node() hook
*/ ?>

<?php if ( user_is_logged_in() ): ?>

	<style>
		.workbench-info-block {
			display: none !important;
		}
	</style>
	<h1>Note: You are viewing this page as a signed-in user. If you come to this same page while not 
	signed in, you will see the feed alone.</h1>
	<textarea style="width: 100%; min-height: 500px;" spellcheck="false"><?php print $output; ?></textarea>

<?php else: ?>

	<?php
		@ob_end_clean();
		while (@ob_end_clean());
		header('Content-Type: '.$headContType);
		drupal_add_http_header('Content-Type', $headContType);
		print $output;
		exit();
	?>

<?php endif; ?>
