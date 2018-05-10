INTRODUCTION
------------
Swagger is a specification for documenting RESTful services. Documentation can
be found at https://github.com/swagger-api/swagger-spec.

This module integrates with Services (https://drupal.org/project/services) to
generate swagger-parsable json documentation. Optionally, the swagger-ui library
can be installed to provide a page for displaying the documentation in a
user-friendly manner.


REQUIREMENTS
------------
This module requires the following modules:
 * Services (https://www.drupal.org/project/services)

If using the Swagger UI library, the following modules are also necessary:
 * Libraries (https://www.drupal.org/project/libraries)


INSTALLATION
------------
 * Install as you would normally install a contributed Drupal module. See:
   https://drupal.org/documentation/install/modules-themes/modules-7
   for further information.

 * (optional) Install the Swagger UI library:

   - Download the latest release from
     https://github.com/swagger-api/swagger-ui/releases.
   - Create a new folder in sites/all/libraries named "swagger".
   - From the latest release, copy the contents of the "dist" directory into
     the new "swagger" folder.
   - Flush caches.


CONFIGURATION
-------------
 * Configure user permissions in Administration > People > Permissions:

   - View Swagger UI and JSON

     Controls access to the JSON created by this module, and the pages used to
     display the Swagger UI. If the JSON is going to be consumed externally, you
     will likely need to grant this permission to the anonymous user.


MAINTAINERS
-----------
Current maintainers:
 * Mark Millford (mindgrub) - https://www.drupal.org/user/1674598
