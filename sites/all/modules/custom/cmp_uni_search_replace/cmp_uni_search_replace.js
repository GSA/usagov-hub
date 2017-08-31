jQuery(document).ready(function($) {

    var $checkBoxes = $('input[type="checkbox"]');
    $('#edit-check-all').click(function() {
        if ($(this).attr('checked')) {
            $checkBoxes.attr('checked', true);
        }
        else {
            $checkBoxes.attr('checked', false);
        }
    });

});