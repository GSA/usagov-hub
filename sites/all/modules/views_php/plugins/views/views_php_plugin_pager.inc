<?php

/**
 * A (fake) pager plugin that wraps around the actual pager.
 *
 * @ingroup views_pager_plugins
 */
class views_php_plugin_pager extends views_php_plugin_wrapper  {

  /**
   * Perform any needed actions just prior to the query executing.
   */
  public function pre_execute($query) { 
  }

  /**
   * Perform any needed actions just after the query executing.
   */
  public function post_execute(&$result) { 
  }


  /**
   * Execute the count query, which will be done just prior to the query
   * itself being executed.
   */
  function execute_count_query(&$count_query) { 
  }
}
