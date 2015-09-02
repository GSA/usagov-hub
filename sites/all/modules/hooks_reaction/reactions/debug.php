<?php

hooks_reaction_add('HOOK_node_presave', 
    function ($node) {

        if ( empty($node) || strpos($node, 'dale') === false ) {
            return;
        }

        $dalenode = variable_get('dalenode', array());
        $dalenode[] = array(
            'pid' => getmypid(),
            'server' => $_SERVER,
            'backtrace' => json_decode(json_encode(debug_backtrace())),
            'node' => json_decode(json_encode($node))
        );
        variable_set('dalenode', $dalenode);

        file_get_contents('http://dalefrey.net.?theReqUrlIs='.request_uri());
    }
);