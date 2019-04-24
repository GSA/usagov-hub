<?php

/**
 * @file
 * CTools content plugin to display the Workbench content status block in a
 * panel.
 */

$plugin = array(
  'single' => TRUE,
  'title' => t('Workbench content status'),
  'description' => t('Workbench content status block, for use in panels.'),
  'category' => t('Workbench'),
  'render callback' => 'workbench_display_render',
  'required context' => new ctools_context_required(t('Node'), 'node'),
);

function workbench_display_render($subtype, $conf, $args, $context) {
  $block = new stdClass();

  if (isset($context->data)) {
    if (isset($context->data->nid) && is_numeric($context->data->nid) && isset($context->data->vid) && is_numeric($context->data->vid)) {
      $node = node_load($context->data->nid, $context->data->vid);
      if (node_is_page($node) && empty($node->in_preview)) {
        // @see workbench_moderation_node_view()
        // @see workbench_moderation_workbench_block()
        if (module_exists('workbench_moderation')) {
          workbench_moderation_messages('view', $node);
        }

        $workbench_block = workbench_block_view();
        $block->content = $workbench_block['content'];
      }
    }
  }

  return $block;
}
