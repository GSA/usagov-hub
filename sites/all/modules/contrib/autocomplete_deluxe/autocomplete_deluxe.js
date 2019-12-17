
/**
 * @file:
 * Converts textfield to a autocomplete deluxe widget.
 */

(function($) {
  // console.log('$()');
  Drupal.autocomplete_deluxe = Drupal.autocomplete_deluxe || {};

  Drupal.behaviors.autocomplete_deluxe = {
    attach: function(context) {
      var autocomplete_settings = Drupal.settings.autocomplete_deluxe;

      $('input.autocomplete-deluxe-form').once( function() {
        if (autocomplete_settings[$(this).attr('id')].multiple === true) {
          // console.log('MultipleWidget(' + $(this).attr('id') + ')');
          new Drupal.autocomplete_deluxe.MultipleWidget(this, autocomplete_settings[$(this).attr('id')]);
        } else {
          // console.log('SingleWidget(' + $(this).attr('id') + ')');
          new Drupal.autocomplete_deluxe.SingleWidget(autocomplete_settings[$(this).attr('id')]);
        }
      });
    }
  };

  /**
   * Autogrow plugin which auto resizes the input of the multiple value.
   *
   * http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
   *
   */
  $.fn.autoGrowInput = function(o) {
    // console.log('autoGrowInput()');
    o = $.extend({
      maxWidth: 1000,
      minWidth: 0,
      comfortZone: 70
    }, o);

    this.filter('input:text').each(function(){
	  // console.log('filter()');
      var minWidth = o.minWidth || $(this).width(),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
          position: 'absolute',
          top: -9999,
          left: -9999,
          width: 'auto',
          fontSize: input.css('fontSize'),
          fontFamily: input.css('fontFamily'),
          fontWeight: input.css('fontWeight'),
          letterSpacing: input.css('letterSpacing'),
          whiteSpace: 'nowrap'
        }),
        check = function() {
          // console.log('check()');
          if (val === (val = input.val())) {return;}

          // Enter new content into testSubject
          var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          testSubject.html(escaped);

          // Calculate new width + whether to change
          var testerWidth = testSubject.width(),
            newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
            currentWidth = input.width(),
            isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
              || (newWidth > minWidth && newWidth < o.maxWidth);

          // Animate width
          if (isValidWidthChange) {
            input.width(newWidth);
          }

        };

      testSubject.insertAfter(input);
      // // console.log('bind()');
      // JKH changed bind() to on()
      // $(this).bind('keyup keydown blur update', check);
      // console.log('on()');
      $(this).on('keyup keydown blur update', check);

    });

    return this;
  };

  /**
   * Unescapes the given string.
   */
  Drupal.autocomplete_deluxe.unescape = function (input) {
    // console.log('unescape()');
    // Unescaping is done via a textarea, since the text inside of it is never
    // executed. This method also allows us to support older browsers like
    // IE 9 and below.
    var textArea = document.createElement('textarea');
    textArea.innerHTML = input;
    var decoded = textArea.value;
    if ('remove' in Element.prototype) {
      textArea.remove();
    }
    return decoded;
  };

  /**
   * If there is no result this label will be shown.
   * @type {{label: string, value: string}}
   */
  Drupal.autocomplete_deluxe.empty =  {label: '- ' + Drupal.t('None') + ' -', value: "" };

  /**
   * EscapeRegex function from jquery autocomplete, is not included in drupal.
   */
  Drupal.autocomplete_deluxe.escapeRegex = function(value) {
    // console.log('escapeRegex()');
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/gi, "\\$&");
  };

  /**
   * Filter function from jquery autocomplete, is not included in drupal.
   */
  Drupal.autocomplete_deluxe.filter = function(array, term) {
    // console.log('filter()');
    var matcher = new RegExp(Drupal.autocomplete_deluxe.escapeRegex(term), "i");
    return $.grep(array, function(value) {
      return matcher.test(value.label || value.value || value);
    });
  };

  Drupal.autocomplete_deluxe.Widget = function() {
  	// console.log('Widget()');
  };

  /**
   * Url for the callback.
   */
  Drupal.autocomplete_deluxe.Widget.prototype.uri = null;

  /**
   * Allows widgets to filter terms.
   * @param term
   *   A term that should be accepted or not.
   * @return {Boolean}
   *   True if the term should be accepted.
   */
  Drupal.autocomplete_deluxe.Widget.prototype.acceptTerm = function(term) {
    // console.log('acceptTerm()');
    return true;
  };

  Drupal.autocomplete_deluxe.Widget.prototype.init = function(settings) {
    // console.log('init()');
    if(navigator.appVersion.indexOf("MSIE 6.") != -1) {
      return;
    }

    this.id = settings.input_id;
    this.jqObject = $('#' + this.id);

    this.uri = settings.uri;
    this.multiple = settings.multiple;
    this.required = settings.required;
    this.limit = settings.limit;
    this.synonyms = typeof settings.use_synonyms == 'undefined' ? false : settings.use_synonyms;
    this.not_found_message = typeof settings.use_synonyms == 'undefined' ? "The term '@term' will be added." : settings.not_found_message;

    this.wrapper = '""';

    if (typeof settings.delimiter == 'undefined') {
      this.delimiter = true;
    } else {
      this.delimiter =  settings.delimiter.charCodeAt(0);
    }

    this.items = {};

    var self = this;
    var parent = this.jqObject.parent();
    var parents_parent = this.jqObject.parent().parent();

    parents_parent.append(this.jqObject);
    parent.remove();
    parent = parents_parent;

    var generateValues = function(data, term) {
      // console.log('generateValues()');
      var result = new Array();
      for (var terms in data) {
        if (self.acceptTerm(terms)) {
          result.push({
            label: data[terms],
            value: terms
          });
        }
      }
      if ($.isEmptyObject(result)) {
        result.push({
          label: Drupal.t(self.not_found_message, {'@term' : term}),
          value: term,
          newTerm: true
        });
      }
      return result;
    };

    var cache = {};
    var lastXhr = null;

    this.source = function(request, response) {
      // console.log('_renderItem()');
      var term = request.term;
      if (term in cache) {
        response(generateValues(cache[term], term));
        return;
      }

      // Some server collapse two slashes if the term is empty, so insert at
      // least a whitespace. This whitespace will later on be trimmed in the
      // autocomplete callback.
      if (!term) {
        term = " ";
      }
      request.synonyms = self.synonyms;
      var url = settings.uri + '/' + term +'/' +  self.limit;
      lastXhr = $.getJSON(url, request, function(data, status, xhr) {
        cache[term] = data;
        if (xhr === lastXhr) {
          response(generateValues(data, term));
        }
      });
    };

    this.jqObject.autocomplete({
      'source' : this.source,
      'minLength': settings.min_length
    });

    var jqObject = this.jqObject;

    var autocompleteDataKey = typeof(this.jqObject.data('autocomplete')) === 'object' ? 'item.autocomplete' : 'ui-autocomplete';

    var throbber = $('<div class="autocomplete-deluxe-throbber autocomplete-deluxe-closed">&nbsp;</div>').insertAfter(jqObject);

    this.jqObject.bind("autocompletesearch", function(event, ui) {
      throbber.removeClass('autocomplete-deluxe-closed');
      throbber.addClass('autocomplete-deluxe-open');
    });

    this.jqObject.bind("autocompleteopen", function(event, ui) {
      throbber.addClass('autocomplete-deluxe-closed');
      throbber.removeClass('autocomplete-deluxe-open');
    });

    // Monkey patch the _renderItem function jquery so we can highlight the
    // text, that we already entered.
    $.ui.autocomplete.prototype._renderItem = function( ul, item) {
      // console.log('_renderItem()');
      var t = item.label;
      if (this.term != "") {
        var escapedValue = Drupal.autocomplete_deluxe.escapeRegex( this.term );
        var re = new RegExp('()*""' + escapedValue + '""|' + escapedValue + '()*', 'gi');
        var t = item.label.replace(re,"<span class='autocomplete-deluxe-highlight-char'>$&</span>");
      }

      return $( "<li></li>" )
        .data(autocompleteDataKey, item)
        .append( "<a>" + t + "</a>" )
        .appendTo( ul );
    };
  };

  Drupal.autocomplete_deluxe.Widget.prototype.generateValues = function(data) {
    // console.log('generateValues()');
    var result = new Array();
    for (var index in data) {
      result.push(data[index]);
    }
    return result;
  };

  /**
   * Generates a single selecting widget.
   */
  Drupal.autocomplete_deluxe.SingleWidget = function(settings) {
    // console.log('SingleWidget()');
    this.init(settings);
    this.setup();
    this.jqObject.addClass('autocomplete-deluxe-form-single');
  };

  Drupal.autocomplete_deluxe.SingleWidget.prototype = new Drupal.autocomplete_deluxe.Widget();

  Drupal.autocomplete_deluxe.SingleWidget.prototype.setup = function() {
    // console.log('setup()');
    var jqObject = this.jqObject;
    var parent = jqObject.parent();

    parent.mousedown(function() {
      // console.log('mousedown()');
      if (parent.hasClass('autocomplete-deluxe-single-open')) {
        jqObject.autocomplete('close');
      } else {
        jqObject.autocomplete('search', '');
      }
    });
  };

  /**
   * Creates a multiple selecting widget.
   */
  Drupal.autocomplete_deluxe.MultipleWidget = function(input, settings) {
    this.init(settings);
    this.setup();
  };

  Drupal.autocomplete_deluxe.MultipleWidget.prototype = new Drupal.autocomplete_deluxe.Widget();
  Drupal.autocomplete_deluxe.MultipleWidget.prototype.items = new Object();


  Drupal.autocomplete_deluxe.MultipleWidget.prototype.acceptTerm = function(term) {
    // Accept only terms, that are not in our items list.
    return !(term in this.items);
  };

  Drupal.autocomplete_deluxe.MultipleWidget.Item = function (widget, item) {
    // console.log('Item()');
    if (item.newTerm === true) {
      item.label = item.value;
    }

    this.value = item.value;
    this.element = $('<span class="autocomplete-deluxe-item"></span>');
    this.element.text(item.label);
    this.widget = widget;
    this.item = item;
    var self = this;

    var close = $('<a class="autocomplete-deluxe-item-delete" href="javascript:void(0)"></a>').appendTo(this.element);
    // Use single quotes because of the double quote encoded stuff.
    var input = $('<input type="hidden"/>')
    input.val(this.value);
    input.appendTo(this.element);

    close.mousedown(function() {
      self.remove(item);
    });
  };

  Drupal.autocomplete_deluxe.MultipleWidget.Item.prototype.remove = function() {
    // console.log('remove()');
    this.element.remove();
    var values = this.widget.valueForm.val();
    var escapedValue = Drupal.autocomplete_deluxe.escapeRegex( this.item.value );
    var regex = new RegExp('()*""' + escapedValue + '""()*', 'gi');
    this.widget.valueForm.val(values.replace(regex, ''));
    delete this.widget.items[this.value];
  };

  Drupal.autocomplete_deluxe.MultipleWidget.prototype.setup = function() {
    // console.log('setup()');
    var jqObject = this.jqObject;
    var parent = jqObject.parents('.autocomplete-deluxe-container');
    var value_container = parent.next();
    var value_input = value_container.find('input');
    var items = this.items;
    var self = this;
    this.valueForm = value_input;

    // Override the resize function, so that the suggestion list doesn't resizes
    // all the time.
    var autocompleteDataKey = typeof(this.jqObject.data('autocomplete')) === 'object' ? 'autocomplete' : 'ui-autocomplete';

    jqObject.data(autocompleteDataKey)._resizeMenu = function()  {};

    jqObject.show();

    value_container.hide();

    // Add the default values to the box.
    var default_values = value_input.val();
    default_values = $.trim(default_values);
    default_values = default_values.substr(2, default_values.length-4);
    default_values = default_values.split('"" ""');

    for (var index in default_values) {
      var value = default_values[index];
      if (value != '') {
        // If a terms is encoded in double quotes, then the label should have
        // no double quotes.
        var label = value.match(/["][\w|\s|\D|]*["]/gi) !== null ? value.substr(1, value.length-2) : value;
        var item = {
          label : label,
          value : value
        };
        var item = new Drupal.autocomplete_deluxe.MultipleWidget.Item(self, item);
        item.element.insertBefore(jqObject);
        items[item.value] = item;
      }
    }

    jqObject.addClass('autocomplete-deluxe-multiple');
    parent.addClass('autocomplete-deluxe-multiple');


    // Adds a value to the list.
    this.addValue = function(ui_item) {
      // console.log('addValue()');
      var item = new Drupal.autocomplete_deluxe.MultipleWidget.Item(self, ui_item);
      item.element.insertBefore(jqObject);
      items[ui_item.value] = item;
      var new_value = ' ' + self.wrapper + ui_item.value + self.wrapper;
      var values = value_input.val();
      value_input.val(values + new_value);
      jqObject.val('');
    };

    parent.mouseup(function() {
      // console.log('mouseup()');
      jqObject.autocomplete('search', '');
      jqObject.focus();
    });

    jqObject.bind("autocompleteselect", function(event, ui) {
      // JQuery ui autocomplete needs the terms escaped, otherwise it would be
      // open to XSS issues. Drupal.autocomplete.Item also escapes on rendering
      // the DOM elements. Thus we have to unescape the label here before adding
      // the new item.
      // console.log('bind(autocompletechange) 1');
      var item = ui.item;
      item.label = Drupal.autocomplete_deluxe.unescape(item.label);
      self.addValue(item);
      jqObject.width(25);
      // Return false to prevent setting the last term as value for the jqObject.
      return false;
    });

    jqObject.bind("autocompletechange", function(event, ui) {
      // console.log('bind(autocompletechange) 2'); 
      jqObject.val('');
    });

    jqObject.blur(function() {
      // console.log('blur()');
      var last_element = jqObject.parent().children('.autocomplete-deluxe-item').last();
      last_element.removeClass('autocomplete-deluxe-item-focus');
    });

    var clear = false;

    jqObject.keypress(function (event) {
      // console.log('keypress()');
      var value = jqObject.val();
      // If a comma was entered and there is none or more then one comma,or the
      // enter key was entered, then enter the new term.
      if ((event.which == self.delimiter && (value.split('"').length - 1) != 1) || (event.which == 13 && jqObject.val() != "")) {
        value = value.substr(0, value.length);
        if (typeof self.items[value] == 'undefined' && value != '') {
          var ui_item = {
            label: value,
            value: value
          };
          self.addValue(ui_item);
        }
        clear = true;
        if (event.which == 13) {
          return false;
        }
      }

      // If the Backspace key was hit and the input is empty
      if (event.which == 8 && value == '') {
        var last_element = jqObject.parent().children('.autocomplete-deluxe-item').last();
        // then mark the last item for deletion or deleted it if already marked.
        if (last_element.hasClass('autocomplete-deluxe-item-focus')) {
          var value = last_element.children('input').val();
          self.items[value].remove(self.items[value]);
          jqObject.autocomplete('search', '');
        } else {
          last_element.addClass('autocomplete-deluxe-item-focus');
        }
      } else {
        // Remove the focus class if any other key was hit.
        var last_element = jqObject.parent().children('.autocomplete-deluxe-item').last();
        last_element.removeClass('autocomplete-deluxe-item-focus');
      }
    });

    jqObject.autoGrowInput({
      comfortZone: 50,
      minWidth: 10,
      maxWidth: 460
    });


    jqObject.keyup(function (event) {
      // console.log('keyup()');
      if (clear) {
        // Trigger the search, so it display the values for an empty string.
        jqObject.autocomplete('search', '');
        jqObject.val('');
        clear = false;
        // Return false to prevent entering the last character.
        return false;
      }
    });
  };
})(jQuery);
