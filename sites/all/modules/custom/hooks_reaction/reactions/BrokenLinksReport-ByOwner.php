<?php

/**
 * Implements HOOK_menu().
 */
hooks_reaction_add("menu",
    function () {

        $menuArr = array();

        // Register http://YourWebSite.com/this/is/an/example/page to return a page generated from hookReactExamplePage()
        $menuArr['user/%user/ownerbrokenlinks'] = array(
            'access callback' => '_linkchecker_owner_access_account_broken_links_report',
            'access arguments' => array(1),
            'description' => 'Shows a list of broken links in content.',
            'page callback' => 'linkchecker_owner_report_page',
            'page arguments' => array(1),
            'title' => 'Broken links by Owner',
            'type' => MENU_LOCAL_TASK,
            'weight' => 4,
        );

        return $menuArr;
    }
);

/**
 * Access callback for user/%user/linkchecker.
 */
function _linkchecker_owner_access_account_broken_links_report($account) {
    global $user;

    $ret = false;
    $allowed_roles = array('administrator', 'editor', 'content author', 'html author', 'ux member', 'usa administrator');
    if (array_intersect($allowed_roles, array_values($user->roles))) {
        $ret = true;
    }

    return $ret;
}

/**
 * Menu callback for owner/author specific reporting.
 */
function linkchecker_owner_report_page($account) {
    drupal_set_title($account->name);

    $ignore_response_codes = preg_split('/(\r\n?|\n)/', variable_get('linkchecker_ignore_response_codes', "200\n206\n302\n304\n401\n403"));

    // Build query for broken links in nodes of the current user.
    $subquery2 = db_select('node', 'n');
    $subquery2->innerJoin('node_revision', 'r', 'r.vid = n.vid');
    $subquery2->innerJoin('field_data_field_owner', 'fo', 'n.nid = fo.entity_id');
    $subquery2->innerJoin('linkchecker_node', 'ln', 'ln.nid = n.nid');
    $subquery2->innerJoin('linkchecker_link', 'll', 'll.lid = ln.lid');
    $subquery2->condition('ll.last_checked', 0, '<>');
    $subquery2->condition('ll.status', 1);
    $subquery2->condition('ll.code', $ignore_response_codes, 'NOT IN');
    $subquery2->condition('fo.field_owner_target_id', $account->uid);
    $subquery2->distinct();
    $subquery2->fields('ll', array('lid'));


    $subquery1 = db_select($subquery2, 'q1')->fields('q1', array('lid'));

    // Build pager query.
    $query = db_select('linkchecker_link', 'll')->extend('PagerDefault')->extend('TableSort');
    $query->innerJoin($subquery1, 'q2', 'q2.lid = ll.lid');
    $query->fields('ll');
    $query->condition('ll.last_checked', 0, '<>');
    $query->condition('ll.status', 1);
    $query->condition('ll.code', $ignore_response_codes, 'NOT IN');

    return _linkchecker_report_ownerpage($query, $account);
}

/**
 * Builds the HTML report page table with pager.
 *
 * @param SelectQueryInterface $query
 *   The pager query for the report page. Can be per user report or global.
 * @param object|null $account
 *   The user account object.
 *
 * @return string
 *   Themed report page.
 */
function _linkchecker_report_ownerpage($query, $account = NULL) {

    $links_unchecked = db_query('SELECT COUNT(1) FROM {linkchecker_link} WHERE last_checked = :last_checked AND status = :status', array(':last_checked' => 0, ':status' => 1))->fetchField();
    if ($links_unchecked > 0) {
        $links_all = db_query('SELECT COUNT(1) FROM {linkchecker_link} WHERE status = :status', array(':status' => 1))->fetchField();
        drupal_set_message(format_plural($links_unchecked,
            'There is 1 unchecked link of about @links_all links in the database. Please be patient until all links have been checked via cron.',
            'There are @count unchecked links of about @links_all links in the database. Please be patient until all links have been checked via cron.',
            array('@links_all' => $links_all)), 'warning');
    }

    $header = array(
        array('data' => t('URL'), 'field' => 'url', 'sort' => 'desc'),
        array('data' => t('Response'), 'field' => 'code', 'sort' => 'desc'),
        array('data' => t('Error'), 'field' => 'error'),
        array('data' => t('Operations')),
    );

    $result = $query
        ->limit(50)
        ->orderByHeader($header)
        ->execute();

    // Evaluate permission once for performance reasons.
    $access_edit_link_settings = user_access('edit link settings');
    $access_administer_redirects = user_access('administer redirects');

    $rows = array();
    foreach ($result as $link) {
        // Get the node, block and comment IDs that refer to this broken link and
        // that the current user has access to.
        $nids = _linkchecker_link_node_ids_by_owner($link, $account);

        $links = array();

        // Show links to link settings.
        if ($access_edit_link_settings) {
            $links[] = l(t('Edit link settings'), 'linkchecker/' . $link->lid . '/edit', array('query' => drupal_get_destination()));
        }

        // Show link to nodes having this broken link.
        foreach ($nids as $nid) {
            $links[] = l(t('Edit node @node', array('@node' => $nid)), 'node/' . $nid . '/edit', array('query' => drupal_get_destination()));
        }
        // Show link to redirect this broken internal link.
        if (module_exists('redirect') && $access_administer_redirects && _linkchecker_is_internal_url($link)) {
            $links[] = l(t('Create redirection'), 'admin/config/search/redirect/add', array('query' => array('source' => $link->internal, drupal_get_destination())));
        }

        // Create table data for output.
        $rows[] = array(
            'data' => array(
                l(_filter_url_trim($link->url, 40), $link->url),
                $link->code,
                check_plain($link->error),
                theme('item_list', array('items' => $links)),
            ),
        );
    }

    $build['linkchecker_table'] = array(
        '#theme' => 'table',
        '#header' => $header,
        '#rows' => $rows,
        '#empty' => t('No broken links have been found.'),
    );
    $build['linkchecker_pager'] = array('#theme' => 'pager');

    return $build;
}

function _linkchecker_link_node_ids_by_owner($link, $node_author_account = NULL) {
    static $fields_with_node_links = array();

    // Exit if all node types are disabled or if the user cannot access content,
    // there is no need to check further.
    $linkchecker_scan_nodetypes = array_filter(variable_get('linkchecker_scan_nodetypes', array()));
    if (empty($linkchecker_scan_nodetypes) || !user_access('access content')) {
        return array();
    }

    // Get a list of nodes containing the link, using addTag('node_access') to
    // allow node access modules to exclude nodes that the current user does not
    // have access to view.
    if (!empty($node_author_account)) {
        $query = db_select('node', 'n');
        $query->addTag('node_access');
        $query->innerJoin('linkchecker_node', 'ln', 'ln.nid = n.nid');
        $query->innerJoin('node_revision', 'r', 'r.vid = n.vid');
        $query->innerJoin('field_data_field_owner', 'fo', 'n.nid = fo.entity_id');
        $query->condition('ln.lid', $link->lid);
        $query->condition('fo.field_owner_target_id', $node_author_account->uid);
        $query->fields('n', array('nid'));
    }
    else {
        $query = db_select('node', 'n');
        $query->addTag('node_access');
        $query->innerJoin('linkchecker_node', 'ln', 'ln.nid = n.nid');
        $query->condition('ln.lid', $link->lid);
        $query->fields('n', array('nid'));
    }
    $nodes = $query->execute();

    // Check if the current user has access to view the link in each node.
    // However, for performance reasons, as soon as we find one node where that
    // is the case, stop checking and return the remainder of the list.
    $nids = array();
    $access_allowed = FALSE;
    foreach ($nodes as $node) {
        if ($access_allowed) {
            $nids[] = $node->nid;
            continue;
        }
        $node = node_load($node->nid);

        // We must check whether the link is currently part of the node; if not, we
        // do not want to return it (and it is not safe to, since we cannot know if
        // it contained access restrictions for the current user at the point which
        // it was originally extracted by the Link checker module).
        if (!isset($fields_with_node_links[$node->nid])) {
            $fields_with_node_links[$node->nid] = _linkchecker_extract_node_links($node, TRUE);
        }
        if (empty($fields_with_node_links[$node->nid][$link->url])) {
            continue;
        }
        // If the link appears in fields and a field access module is being used,
        // we must check that the current user has access to view at least one field
        // that contains the link; if they don't, we should not return the node.
        $fields = $fields_with_node_links[$node->nid][$link->url];
        if (module_implements('field_access')) {
            $fields_with_access = array();

            $bundle_instances = field_info_instances('node', $node->type);
            foreach ($bundle_instances as $field_name => $field_instance) {
                $field = field_info_field($field_name);

                // Field types supported by linkchecker.
                $fields_supported = array(
                    'text_with_summary',
                    'text_long',
                    'text',
                    'link_field',
                );

                // Only check link and text fields, since those are the only types we
                // extract links from.
                if (in_array($field['type'], $fields_supported) && field_access('view', $field, 'node', $node)) {
                    $fields_with_access[] = $field['field_name'];
                }
            }
            if (!array_intersect($fields, $fields_with_access)) {
                continue;
            }
        }
        $nids[] = $node->nid;
        $access_allowed = TRUE;
    }

    return $nids;
}

