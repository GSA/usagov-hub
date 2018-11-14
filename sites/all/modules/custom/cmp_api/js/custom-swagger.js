(function ($) {

    $(document).ready(function () {

        $('.endpoints').hide();

        $('.toggleEndpointList').click(function(){
            if (($('#'+ ($(this).attr('data-id'))+'_endpoint_list').css('display')) == 'none'){
                $('#'+ ($(this).attr('data-id'))+'_endpoint_list').show();
            }
            else{
                $('#'+ ($(this).attr('data-id'))+'_endpoint_list').hide();
            }
        });

        $('.toggleOperation').click(function(){
            if(($('#'+$(this).attr("href").replace("#!/","").replace("/","_")+'_content').css('display')) == 'none'){
                $('#'+$(this).attr("href").replace("#!/","").replace("/","_")+'_content').show();
            }
            else{
                $('#'+$(this).attr("href").replace("#!/","").replace("/","_")+'_content').hide();
            }
        })

        $('#text_asset_submit').click(function(){
            if($('#text_asset_id').val().length == 0){
                $('#text_asset_id').addClass('error');
            }
            else{
                if($('#text_asset_id').hasClass('error')) {
                    $('#text_asset_id').removeClass('error');
                }
                //load all results
                jQuery.ajax({
                    url: "/usaapi/api/v1/usagov/narratives/"+$('#text_asset_id').val()+".json",
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        $('.text_asset_submit_response').find('.response_throbber').hide();
                        $('.text_asset_submit_response').show();
                        $('.text_asset_submit_response').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/narratives/"+$('#text_asset_id').val()+'.json</pre>');
                        $('.text_asset_submit_response').find('.response_code').html('<pre>'+200+'</pre>');
                        $('.text_asset_submit_response').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                    },
                    beforeSend: function ( xhr ) {
                        $('.text_asset_submit_response').find('.response_throbber').show();
                    },
                    error: function () {
                        $('.text_asset_submit_response').find('.response_throbber').hide();
                        $('.text_asset_submit_response').show();
                        $('.text_asset_submit_response').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/narratives/"+$('#text_asset_id').val()+'.json</pre>');
                        $('.text_asset_submit_response').find('.response_code').html('<pre>'+500+'</pre>');
                    }
                });
            }
        });


        $('#dir_type_auto').click(function(){

            if($('#dir_type_auto').val().length == 0){
                $('#dir_type_auto').addClass('error');
            }
            else{
                if($('#dir_type_auto').hasClass('error')) {
                    $('#dir_type_auto').removeClass('error');
                }
                var param = [];
                if($('#directory_type_auto').val().length > 0){
                    param.push('directory_type='+$('#directory_type_auto').val());
                }
                if($('#name_auto').val().length > 0){
                    param.push('name='+$('#name_auto').val());
                }
                if($('#language_auto').val().length > 0){
                    param.push('language='+$('#language_auto').val());
                }
                var param_str = '';
                if(param.length > 0){
                    param_str = '?'+param.join("&");
                }

                //load all results
                jQuery.ajax({
                    url: "/usaapi/api/v1/usagov/directory_records/autocomplete.json"+param_str,
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        $('.dir_type_auto').find('.response_throbber').hide();
                        $('.dir_type_auto').show();
                        $('.dir_type_auto').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/autocomplete.json"+param_str+'</pre>');
                        $('.dir_type_auto').find('.response_code').html('<pre>'+200+'</pre>');
                        $('.dir_type_auto').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                    },
                    beforeSend: function ( xhr ) {
                        $('.dir_type_auto').find('.response_throbber').show();
                    },
                    error: function () {
                        $('.dir_type_auto').find('.response_throbber').hide();
                        $('.dir_type_auto').show();
                        $('.dir_type_auto').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/autocomplete.json"+param_str+'</pre>');
                        $('.dir_type_auto').find('.response_code').html('<pre>'+500+'</pre>');
                    }
                });
            }
        });

        $('#state_submit').click(function(){
            if($('#state_state').val().length == 0){
                $('#state_state').addClass('error');
            }
            else{
                if($('#state_state').hasClass('error')) {
                    $('#state_state').removeClass('error');
                }
                var param = [];
                if($('#state_query').val().length > 0){
                    param.push('query='+$('#state_query').val());
                }
                if($('#state_date_filter').val().length > 0){
                    param.push('date_filter='+$('#state_date_filter').val());
                }
                if($('#state_terms_filter').val().length > 0){
                    param.push('terms_filter='+$('#state_terms_filter').val());
                }
                if($('#state_result_filter').val().length > 0){
                    param.push('result_filter='+$('#state_result_filter').val());
                }
                if($('#state_page_size').val().length > 0){
                    param.push('page_size='+$('#state_page_size').val());
                }
                if($('#state_page').val().length > 0){
                    param.push('page='+$('#state_page').val());
                }
                var param_str = '';

                if(param.length > 0){
                    param_str = '?'+param.join("&");
                }

                jQuery.ajax({
                    url: "/usaapi/api/v1/usagov/directory_records/state/"+$('#state_state').val()+'.json'+param_str,
                    dataType: 'json',
                    type: 'GET',
                    success: function (data,status) {
                        $('.state_submit').find('.response_throbber').hide();
                        $('.state_submit').show();
                        $('.state_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/state/"+$('#state_state').val()+'.json'+param_str+'</pre>');
                        $('.state_submit').find('.response_code').html('<pre>'+200+'</pre>');
                        $('.state_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                    },
                    beforeSend: function ( xhr ) {
                        $('.state_submit').find('.response_throbber').show();
                    },
                    error: function () {
                        $('.state_submit').find('.response_throbber').hide();
                        $('.state_submit').show();
                        $('.state_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/state/"+$('#state_state').val()+'.json'+param_str+'</pre>');
                        $('.state_submit').find('.response_code').html('<pre>'+500+'</pre>');
                    }
                });
            }
        });

        $('#bbb_submit').click(function(){
            var param = [];
            if($('#bbb_query').val().length > 0){
                param.push('query='+$('#bbb_query').val());
            }
            if($('#bbb_date_filter').val().length > 0){
                param.push('date_filter='+$('#bbb_date_filter').val());
            }
            if($('#bbb_terms_filter').val().length > 0){
                param.push('terms_filter='+$('#bbb_terms_filter').val());
            }
            if($('#bbb_result_filter').val().length > 0){
                param.push('result_filter='+$('#bbb_result_filter').val());
            }
            if($('#bbb_page_size').val().length > 0){
                param.push('page_size='+$('#bbb_page_size').val());
            }
            if($('#bbb_page').val().length > 0){
                param.push('page='+$('#bbb_page').val());
            }
            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/api/v1/usagov/directory_records/bbb.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.bbb_submit').find('.response_throbber').hide();
                    $('.bbb_submit').show();
                    $('.bbb_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/bbb.json"+param_str+'</pre>');
                    $('.bbb_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.bbb_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.bbb_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.bbb_submit').find('.response_throbber').hide();
                    $('.bbb_submit').show();
                    $('.bbb_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/bbb.json"+param_str+'</pre>');
                    $('.bbb_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        $('#ca_submit').click(function(){

            var param = [];
            if($('#ca_query').val().length > 0){
                param.push('query='+$('#ca_query').val());
            }
            if($('#ca_date_filter').val().length > 0){
                param.push('date_filter='+$('#ca_date_filter').val());
            }
            if($('#ca_terms_filter').val().length > 0){
                param.push('terms_filter='+$('#ca_terms_filter').val());
            }
            if($('#ca_result_filter').val().length > 0){
                param.push('result_filter='+$('#ca_result_filter').val());
            }
            if($('#ca_page_size').val().length > 0){
                param.push('page_size='+$('#ca_page_size').val());
            }
            if($('#ca_page').val().length > 0){
                param.push('page='+$('#ca_page').val());
            }
            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/api/v1/usagov/directory_records/consumer_agencies.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.ca_submit').find('.response_throbber').hide();
                    $('.ca_submit').show();
                    $('.ca_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/consumer_agencies.json"+param_str+'</pre>');
                    $('.ca_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.ca_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.ca_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.ca_submit').find('.response_throbber').hide();
                    $('.ca_submit').show();
                    $('.ca_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/consumer_agencies"+param_str+'</pre>');
                    $('.ca_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        $('#fed_submit').click(function(){
            var param = [];
            if($('#fed_query').val().length > 0){
                param.push('query='+$('#fed_query').val());
            }
            if($('#fed_date_filter').val().length > 0){
                param.push('date_filter='+$('#fed_date_filter').val());
            }
            if($('#fed_terms_filter').val().length > 0){
                param.push('terms_filter='+$('#fed_terms_filter').val());
            }
            if($('#fed_result_filter').val().length > 0){
                param.push('result_filter='+$('#fed_result_filter').val());
            }
            if($('#fed_page_size').val().length > 0){
                param.push('page_size='+$('#fed_page_size').val());
            }
            if($('#fed_page').val().length > 0){
                param.push('page='+$('#fed_page').val());
            }
            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/api/v1/usagov/directory_records/federal.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.fed_submit').find('.response_throbber').hide();
                    $('.fed_submit').show();
                    $('.fed_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/federal.json"+param_str+'</pre>');
                    $('.fed_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.fed_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.fed_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.fed_submit').find('.response_throbber').hide();
                    $('.fed_submit').show();
                    $('.fed_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/federal.json"+param_str+'</pre>');
                    $('.fed_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        $('#directory_record_submit').click(function(){
            if($('#directory_record_id').val().length == 0){
                $('#directory_record_id').addClass('error');
            }
            else{
                if($('#directory_record_id').hasClass('error')) {
                    $('#directory_record_id').removeClass('error');
                }
                //load all results
                jQuery.ajax({
                    url: "/usaapi/api/v1/usagov/directory_records/"+$('#directory_record_id').val()+'.json',
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        $('.directory_record_submit').find('.response_throbber').hide();
                        $('.directory_record_submit').show();
                        $('.directory_record_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/"+$('#directory_record_id').val()+'.json'+'</pre>');
                        $('.directory_record_submit').find('.response_code').html('<pre>'+200+'</pre>');
                        $('.directory_record_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                    },
                    beforeSend: function ( xhr ) {
                        $('.directory_record_submit').find('.response_throbber').show();
                    },
                    error: function () {
                        $('.directory_record_submit').find('.response_throbber').hide();
                        $('.directory_record_submit').show();
                        $('.directory_record_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records/"+$('#directory_record_id').val()+'.json'+'</pre>');
                        $('.directory_record_submit').find('.response_code').html('<pre>'+500+'</pre>');
                    }
                });
            }
        });

        $('#text_asset_all_submit').click(function(){
            var param = [];
            if($('#query1').val().length > 0){
                param.push('query='+$('#query1').val());
            }
            if($('#date_filter1').val().length > 0){
                param.push('date_filter='+$('#date_filter1').val());
            }
            if($('#terms_filter1').val().length > 0){
                param.push('terms_filter='+$('#terms_filter1').val());
            }
            if($('#result_filter1').val().length > 0){
                param.push('result_filter='+$('#result_filter1').val());
            }
            if($('#page_size1').val().length > 0){
                param.push('page_size='+$('#page_size1').val());
            }
            if($('#page1').val().length > 0){
                param.push('page='+$('#page1').val());
            }
            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/api/v1/usagov/narratives.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.text_asset_all_submit').find('.response_throbber').hide();
                    $('.text_asset_all_submit').show();
                    $('.text_asset_all_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/narratives.json"+param_str+'</pre>');
                    $('.text_asset_all_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.text_asset_all_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.text_asset_all_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.text_asset_all_submit').find('.response_throbber').hide();
                    $('.text_asset_all_submit').show();
                    $('.text_asset_all_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/narratives.json"+param_str+'</pre>');
                    $('.text_asset_all_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        $('#dir1_submit').click(function(){
            var param = [];
            if($('#query_dir1').val().length > 0){
                param.push('query='+$('#query_dir1').val());
            }
            if($('#date_filter_dir1').val().length > 0){
                param.push('date_filter='+$('#date_filter_dir1').val());
            }
            if($('#terms_filter_dir1').val().length > 0){
                param.push('terms_filter='+$('#terms_filter_dir1').val());
            }
            if($('#result_filter_dir1').val().length > 0){
                param.push('result_filter='+$('#result_filter_dir1').val());
            }
            if($('#page_size_dir1').val().length > 0){
                param.push('page_size='+$('#page_size_dir1').val());
            }
            if($('#page_dir1').val().length > 0){
                param.push('page='+$('#page_dir1').val());
            }
            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/api/v1/usagov/directory_records.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.dir1_submit').find('.response_throbber').hide();
                    $('.dir1_submit').show();
                    $('.dir1_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records.json"+param_str+'</pre>');
                    $('.dir1_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.dir1_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.dir1_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.dir1_submit').find('.response_throbber').hide();
                    $('.dir1_submit').show();
                    $('.dir1_submit').find('.request_url').html('<pre>'+"/usaapi/api/v1/usagov/directory_records.json"+param_str+'</pre>');
                    $('.dir1_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        $('#entities_submit').click(function(){
            var param = [];

            if($('#entities_page_size').val().length > 0){
                param.push('page_size='+$('#entities_page_size').val());
            }

            var param_str = '';

            if(param.length > 0){
                param_str = '?'+param.join("&");
            }

            jQuery.ajax({
                url: "/usaapi/entities"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.entities_submit').find('.response_throbber').hide();
                    $('.entities_submit').show();
                    $('.entities_submit').find('.request_url').html('<pre>'+"/usaapi/entities"+param_str+'</pre>');
                    $('.entities_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.entities_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                },
                beforeSend: function ( xhr ) {
                    $('.entities_submit').find('.response_throbber').show();
                },
                error: function () {
                    $('.entities_submit').find('.response_throbber').hide();
                    $('.entities_submit').show();
                    $('.entities_submit').find('.request_url').html('<pre>'+"/usaapi/entities"+param_str+'</pre>');
                    $('.entities_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        function formatData(data){
/*            var tempstr=(JSON.stringify(data, null, "	").replace(/\n/g, "<br>"));
            var res = tempstr.split("<br>");
            console.log(res);*/

            return '<code>'+JSON.stringify(data, null, "	").replace(/\n/g, "<br>")+'</code>';
        }

    });
})(jQuery);