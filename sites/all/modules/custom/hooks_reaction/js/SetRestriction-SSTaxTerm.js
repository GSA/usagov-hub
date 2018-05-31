(function ($) {

    $(document).ready(function () {

        setInterval(function () {
            $('div.term-operations').remove();

            $("a[href='/admin/structure/taxonomy/site_strucutre_taxonomy/add']").remove();
            $("input[value='Delete']").remove();
            $("#taxonomy-overview-terms :input[value='Save']").remove();
            $("input[value='Reset to alphabetical']").remove();
            //$(".overflow-fix:contains('Parents')").hide();
            $(".form-type-textfield:contains('Terms are displayed in ascending order by weight.')").hide();
            $(".form-item-field-type-of-page-to-generate-und").hide();
        }, 500);
    });
})(jQuery);