<?php

hooks_reaction_add("js_alter",
    function (&$javascript) {
      if ( !user_is_logged_in() && !empty($javascript['misc/jquery.js']) )
      {
        $javascript['misc/jquery.js']['data'] = drupal_get_path('module','hooks_reaction').'/js/jquery-3.4.1.min.js';
        $javascript['misc/jquery.js']['version'] = '3.4.1';
      }
    }
);
