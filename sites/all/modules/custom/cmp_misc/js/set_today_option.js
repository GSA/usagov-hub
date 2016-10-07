(function ($) {

    $( document ).ready(function() {
        var today = new Date();
        var dd = today.getDate();

        $('.form-item-field-date-last-reviewed-und-0-value-time').append( "<a href='#' id='set_today'>Set Today</a>" );
        $('#set_today').click(function(event){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            $('#edit-field-date-last-reviewed-und-0-value-datepicker-popup-0').val(mm+'/'+dd+'/'+yyyy);
            $('#edit-field-date-last-reviewed-und-0-value-timeEntry-popup-1').val("12:00");
            event.preventDefault();
        });
    });
})(jQuery);
