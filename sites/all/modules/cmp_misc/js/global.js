(function ($) {

    $( document ).ready(function() {
        // site structure taxonomy report
        if ($('.view-display-id-summarized_report_page').length > 0) {
            $('.item-list').addClass('report-tree');
            $('.item-list').removeClass('item-list');

            $('.report-tree ul li').each(function( index ) {

                if ($(this).children('.report-tree').length == 0) {
                    $(this).addClass('no-more-expand');
                }

            });



            //$('.item-list ul').addClass('report-tree');
            $('.report-tree ul').hide();
            $('.report-tree ul').first().show();

            $('.report-tree ul li a').click(function(e){

                if (!$(this).next('.report-tree').children('ul').first().hasClass('expanded')) {

                    $(this).next('.report-tree').children('ul').first().fadeIn('slow');
                    $(this).next('.report-tree').children('ul').first().addClass('expanded');
                    $(this).next('.report-tree').children('ul').first().removeClass('collapsed');
                }
                else {
                    $(this).next('.report-tree').children('ul').first().fadeOut('slow');
                    $(this).next('.report-tree').children('ul').first().addClass('collapsed');
                    $(this).next('.report-tree').children('ul').first().removeClass('expanded');
                }
                return false;

            });
        }


        //adding reset form elements on search pages
        var selectorList = ['#views-exposed-form-search-content-items-page .views-submit-button'];
        selectorList.push('#views-exposed-form-search-content-items-page .views-submit-button');
        selectorList.push('#views-exposed-form-search-files-page .views-submit-button');
        selectorList.push('#views-exposed-form-search-text-multimedia-html-page .views-submit-button');
        selectorList.push('#views-exposed-form-search-directory-records-index-page .views-submit-button');
        selectorList.push('#views-exposed-form-search-state-details-page .views-submit-button');
        selectorList.push('#views-exposed-form-search-content-for-urls-page .views-submit-button');
        selectorList = selectorList.join(", ");

        $('<div class="resetButton views-exposed-widget"><input type="submit" id="resetButton" name="" value="reset" class="form-submit"></div>').insertAfter($(selectorList));
        $('#resetButton').click(function(e){
            e.preventDefault();
            var url = location.href.split("?");
            location.replace(url[0]);
        });



    });
})(jQuery);
