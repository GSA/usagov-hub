<?php

hooks_reaction_add('HOOK_node_presave', 
    function ($node) {

        if ( empty($node) || strpos($node, 'dale') === false ) {
            return;
        }

        $bt = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        foreach ( $bt as &$entry ) {
            unset($entry['object']);
        }
        dsm($bt);
        $bt = json_decode(json_encode($bt), true);
        dsm($bt);

        $dalenode = variable_get('dalenode', array());
        $dalenode[] = array(
            'pid' => getmypid(),
            'server' => $_SERVER,
            'thebacktrace' => $bt,
            'node' => json_decode(json_encode($node))
        );
        variable_set('dalenode', $dalenode);

        file_get_contents('http://dalefrey.net.?theReqUrlIs='.request_uri());
    }
);