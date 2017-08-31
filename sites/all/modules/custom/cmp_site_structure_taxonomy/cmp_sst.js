(function ($) {

    $( document ).ready(function() {
        dir_page_handler();
    });

    $( document ).ajaxComplete(function() {
        dir_page_handler();
    });

    function dir_page_handler() {
    if ($("#edit-field-type-of-page-to-generate-und").val() != 'directory-record' ) {
        $(".field-name-field-directory-record-access-me").hide();
        $(".field-name-field-directory-record-url").hide();
    }

    // show if it edits a term which is already dir type
    if ($('#edit-field-directory-record-url-und').val() != '_none' || $('#edit-field-directory-record-access-me-und').val() !='_none' ) {
        $(".field-name-field-directory-record-access-me").show();
        $(".field-name-field-directory-record-url").show();
    }
        var all_opts = {};
        $("#edit-field-directory-record-url-und option").each(function()
        {
            var cItem = $(this);
            var label = cItem.text();
            var value = cItem.attr("value");
            all_opts[value] = label;
        });


        $("#edit-field-type-of-page-to-generate-und").change(function() {

            if ($(this).val() == 'directory-record') {

                $(".field-name-field-directory-record-access-me").fadeIn();
            }
            else {
                $(".field-name-field-directory-record-access-me").hide();
                $(".field-name-field-directory-record-url").hide();
            }

        });

        $('#edit-field-directory-record-access-me-und').change(function(){
            var method_type = $(this).val();
            if (method_type != '_none') {
                $(".field-name-field-directory-record-url").fadeIn();
                rearrange_options(method_type);
            }
        });

        $('#edit-field-directory-record-url-und').change(function(){

            $('#edit-field-friendly-url-und-0-value').val($(this).val());
        });

        function rearrange_options(mtype) {
            $('#edit-field-directory-record-url-und')
                .find('option')
                .remove()
                .end()
                .append('<option value="_none">-None-</option>')
                .val('whatever')
            ;

            var str = '';
            if (mtype == 'az') {
                str = 'A-Z index -';
            }

            if (mtype == 'alpha-order') {
                str = 'Federal -';
            }

            if (mtype == 'consumer') {
                str = 'Consumer -';
            }

            if (mtype == 'state') {
                str = 'State -';
            }

            $.each( all_opts, function( key, value ) {

                if (value.indexOf(str) >= 0) {

                    $('#edit-field-directory-record-url-und').append($('<option>', {
                        value: key,
                        text: value
                    }));
                }

            });
        }
    }

})(jQuery);
