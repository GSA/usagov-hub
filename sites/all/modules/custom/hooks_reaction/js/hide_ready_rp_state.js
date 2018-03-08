(function ($) {

    $(document).ready(function () {
        if ($("#edit-workbench-moderation-state-new").length >0) {
            $("#edit-workbench-moderation-state-new option[value='scheduled_for_publication']").remove();
        }

        if ($("#edit-state").length >0) {
            $("#edit-state option[value='scheduled_for_publication']").remove();
        }
    });
})(jQuery);