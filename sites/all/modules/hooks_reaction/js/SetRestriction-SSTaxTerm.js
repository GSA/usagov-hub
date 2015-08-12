(function ($) {

    $(document).ready(function () {

        setInterval(function () {
            $('div.term-operations').remove();

            $("a[href='/admin/structure/taxonomy/site_strucutre_taxonomy/add']").remove();
            $("input[value='Delete']").remove();
            $("#taxonomy-overview-terms :input[value='Save']").remove();
            $("input[value='Reset to alphabetical']").remove();
        }, 500);
    });
})(jQuery);