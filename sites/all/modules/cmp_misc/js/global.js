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

        setTimeout( function () {

            // When someone clicks on any element within a WYSIWYG UI...
            jQuery('.cke a').bind('mousedown', function () {

                // Look at all WYSIWYG IFrames (source-containers) on the page...
                jQuery('.cke_wysiwyg_frame').each( function () {

                    /* and kill trailing-empty P-tags */

                    var jqThis = jQuery(this);
                    console.log(jqThis);
                    var wysiwygSource = jQuery('.cke_wysiwyg_frame').eq(0).contents().find('body').html();
                    var sourceAltered = false;

                    while ( wysiwygSource.indexOf('<p><br></p>') !== -1 ) {
                        wysiwygSource = wysiwygSource.substring(0, wysiwygSource.length - 11);
                        sourceAltered = true;
                    }

                    if ( sourceAltered === true ) {
                        jQuery('.cke_wysiwyg_frame').eq(0).contents().find('body').html(wysiwygSource);
                    }

                });

            });
        }, 1000);

    });
})(jQuery);
