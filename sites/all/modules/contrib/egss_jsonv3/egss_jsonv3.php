<?php

	// Destroy any markup that was about to be printed (logo, menu, etc.)
	@ob_end_clean();
	while ( @ob_end_clean() );

	// Headers
	header('Content-Type: text/javascript');

	// Receive jsoncallback argument 
	$jsoncallback = 'null'; // default to "null"
	if ( !empty($_REQUEST['jsoncallback']) ) {
		$jsoncallback = trim($_REQUEST['jsoncallback']);
	}

	print $jsoncallback . '({"TOP_ANSWERS": [
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "01/12/2015",
  "TITLE": "Jobs",
  "URL": "https://www.usa.gov/job-search"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/01/2014",
  "TITLE": "Passports",
  "URL": "https://www.usa.gov/passport"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/12/2014",
  "TITLE": "Unclaimed Money",
  "URL": "https://www.usa.gov/unclaimed-money"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/18/2014",
  "TITLE": "Government Auctions",
  "URL": "https://www.usa.gov/buy-from-government"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/15/2014",
  "TITLE": "Health Insurance",
  "URL": "https://www.usa.gov/health-insurance"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/19/2014",
  "TITLE": "Address Change",
  "URL": "https://www.usa.gov/post-office"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/18/2014",
  "TITLE": "Federal Taxes",
  "URL": "https://www.usa.gov/taxes"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "01/07/2015",
  "TITLE": "Telemarketing and Unwanted Mail",
  "URL": "https://www.usa.gov/telemarketing"
 },
 {
  "ARTICLE": "CONTENT FLAG SET TO NO",
  "LASTUPDATE": "12/11/2014",
  "TITLE": "Social Security Benefits",
  "URL": "https://www.usa.gov/about-social-security"
 }
]});';

  exit();
