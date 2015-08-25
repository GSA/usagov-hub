(function ($) {

    $(document).ready(function () {

        $('td').each(function() {
            var text = $(this).text();
            $(this).text(text.replace('No items have been added yet.', 'This item has not been added yet.'));
        });
    });
})(jQuery);