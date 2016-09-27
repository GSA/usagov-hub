/**
 * Chosen Widget
 */
(function($) {
  Drupal.behaviors.chosen_ajax = {
    attach: function(context) {
      $('input.chosen-ajax', context).once('chosen', function() {
        var uri = this.value;
        var $input = $('#' + this.id.substr(0, this.id.length - 12));
        var ajaxChosenOptions = chosenOptions = Drupal.settings.chosen_ajax[this.id] || {};
        $.extend(ajaxChosenOptions, {
          method: 'GET',
          url: uri,
          dataType: 'json',
          jsonTermKey: ''
        });
        $input.ajaxChosen(ajaxChosenOptions, function(data) {return data;}, chosenOptions);
      });
    }
  }
})(jQuery);
