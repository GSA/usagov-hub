<?php

hooks_reaction_add("js_alter",
    function (&$javascript) {
      if ( !user_is_logged_in() && !empty($javascript['misc/jquery.min.js']) )
      {
        global $base_url;
      	// JKH, no no, we're going to use a single js from jquery_update...
        // $javascript['misc/jquery.js']['data'] = drupal_get_path('module','hooks_reaction').'/js/jquery-3.4.1.min.js';
        // $javascript['misc/jquery.js']['version'] = '3.4.1';
        $javascript['misc/jquery.min.js']['data'] = $base_url . '/misc/jquery.min.js';
        $javascript['misc/jquery.min.js']['version'] = '3.4.1';
      }
    }
);
