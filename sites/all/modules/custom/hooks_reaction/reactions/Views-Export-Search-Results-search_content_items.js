
function getReport(reqId, noInit) {

    if ( noInit !== true ) {

        // Show a spinner
        var injectHtml = '\
            <div id="reportDownloadingUi">\
                <div style="  width: 110%; background-color: rgba(0,0,0,0.25); position: absolute; height: 110%; bottom: 0px; right: 0px;">\
                    <!-- this is the overlay -->\
                </div>\
                <div id="reportDownloadingUiText" style="background-color: white; border: 1px solid gray; position: absolute; margin-left: 33%; width: 33%; line-height: 25px; padding: 20px; top: 200px;">\
                    <span id="reportDownloadingUiProgress">\
                        <img style="float: left; padding-right: 10px" src="/sites/all/modules/contrib/taxonomy_manager/images/ajax-loader.gif" />\
                        Processing, please wait...\
                    </span>\
                    <span id="reportDownloadingUiComplete" style="display: none;">\
                        Report generation complete, you can <a download="search_content_items.csv">download it now</a>, or <a href="javascript: jQuery(\'#reportDownloadingUi\').remove(); void(0);">close this window</a>.\
                    </span>\
                </div>\
            <div>\
        ';
        jQuery('body').append(injectHtml);
    }

    // Set the next AJAX call to a 10 second timeout
    jQuery.ajaxSetup({
        timeout: 10000 //Time in milliseconds
    });

    // Request the report
    var ajax = jQuery.get('export-search-api-csv/search_content_items/search_text_multimedia_html?reqid='+reqId, function (data) {
        if ( data == 'working' ) {
            console.log('The server is still building the report, waiting...');
            setTimeout('getReport("'+reqId+'", true);', 3000);
        } else {
            jQuery('#reportDownloadingUiProgress').hide();
            jQuery('#reportDownloadingUiComplete').show();
            jQuery('#reportDownloadingUiComplete a').eq(0).attr('href', 'data:application/vnd.ms-excel;charset=utf-8,'+encodeURIComponent(data));
            jQuery('#reportDownloadingUiComplete a').eq(0).click();
        }
    });
    ajax.ontimeout = ajax.onerror = ajax.onabort = function () {
        console.log('ajax failed, retrying...');
        getReport(reqId, true);
    };

}
