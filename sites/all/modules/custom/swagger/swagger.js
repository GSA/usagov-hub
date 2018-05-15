/**
 * @file
 * Javascript to invoke the Swagger UI library.
 */

(function($) {
  "use strict";

  // SwaggerUI expects $ to be defined as the jQuery object.
  window.$ = $;

  $(function() {
    window.swaggerUi = new SwaggerUi({
      url: Drupal.settings.swagger.endpoint,
      dom_id: "swagger-ui-container",
      supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
      onComplete: function(swaggerApi, swaggerUi){
        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
      },
      onFailure: function(data) {
      },
      docExpansion: "none"
    });

    window.swaggerUi.load();
  });
})(jQuery);
