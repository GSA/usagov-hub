<?php
/**
 * @file
 * API documentation for the swagger module.
 */

/**
 * Alter an operation and its associated method.
 *
 * Alter an operation and its associated method before they are added to the
 * pool of methods for a resource. If the url calculated by swagger_api_resource
 * is incorrect, it should be fixed here before that path is used to key the
 * method.
 *
 * @param array $method
 *   The method object that will be added to the list of methods for its
 *   resource, keyed by $method['path']. Does not contain the operations for
 *   the method.
 * @param array $operation
 *   The operation object that will be appended to the methods operations
 *   property.
 */
function hook_swagger_api_operation_alter(array &$method, array &$operation) {
  if ($method['path'] == '/node/{nid}.{format}' && $operation['method'] == 'GET') {
    $operation['notes'] = '<p>Additional fields may be found depending on the bundle of the node being retrieved.</p>';

    $operation['errorResponses'][] = array(
      'code' => 406,
      'message' => 'Error',
    );
  }
}

/**
 * Alter the swagger output for an entire resource.
 *
 * Useful for adding models to existing resources without using
 * hook_service_resource_alter.
 *
 * @param array $api_data
 *   The data for an entire resource, including methods, operations, and models.
 *
 * @see hook_service_resource_alter()
 */
function hook_swagger_api_alter(array &$api_data) {
  if ($api_data['resourcePath'] == '/user') {
    foreach ($api_data['apis'] as &$api) {
      if ($api['path'] == '/user/{uid}.{format}') {
        foreach ($api['operations'] as &$operation) {
          switch ($operation['method']) {
            // create_user
            case 'GET':
              $operation['type'] = 'user';
              break;

            // update_user
            case 'PUT':
              foreach ($operation['parameters'] as &$parameter) {
                if ($parameter['name'] == 'data') {
                  $parameter['type'] = 'user';
                }
              }
              break;
          }
        }
      }
    }

    $api_data['models']['user'] = array(
      'id' => 'user',
      'required' => array(
        'name', 'mail',
      ),
      'properties' => array(
        'uid' => array(
          'type' => 'string',
          'description' => 'The id of the user.',
        ),
        'name' => array(
          'type' => 'string',
          'description' => 'The username of the user.',
        ),
        'mail' => array(
          'type' => 'string',
          'description' => 'The email address of the user.',
        ),
        'theme' => array(
          'type' => 'string',
          'description' => 'The user\'s theme.',
        ),
        'signature' => array(
          'type' => 'string',
          'description' => 'The user\'s signature.',
        ),
        'signature_format' => array(
          'type' => 'string',
          'description' => 'The user\'s signature format.',
        ),
        'created' => array(
          'type' => 'string',
          'format' => 'date-time',
          'description' => 'The unix timestamp when the user was created.',
        ),
        'access' => array(
          'type' => 'string',
          'format' => 'date-time',
          'description' => 'The unix timestamp when the user last accessed the system.',
        ),
        'login' => array(
          'type' => 'string',
          'format' => 'date-time',
          'description' => 'The unix timestamp when the user last logged in.',
        ),
        'status' => array(
          'type' => 'string',
          'enum' => array('0', '1'),
          'description' => 'The active/blocked status of the user.',
        ),
        'timezone' => array(
          'type' => 'string',
          'description' => 'The user\'s timezone.',
        ),
        'language' => array(
          'type' => 'string',
          'description' => 'The user\'s language.',
        ),
        'picture' => array(
          'type' => 'string',
          'description' => 'The fid of the user\'s picture.',
        ),
        'init' => array(
          'type' => 'string',
          'description' => 'The email address used to initially create the user.',
        ),
        'data' => array(
          'type' => 'string',
          'description' => 'Serialized array of data stored with the user.',
        ),
        'uri' => array(
          'type' => 'string',
          'description' => 'URI to fetch the user\'s data.',
        ),
      ),
    );
  }
}
