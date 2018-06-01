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
                    url: "/usaapi/narratives/"+$('#text_asset_id').val(),
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        $('.text_asset_submit_response').show();
                        $('.text_asset_submit_response').find('.request_url').html('<pre>'+"/usaapi/narratives/"+$('#text_asset_id').val()+'</pre>');
                        $('.text_asset_submit_response').find('.response_code').html('<pre>'+200+'</pre>');
                        $('.text_asset_submit_response').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                        console.log(data);
                    },
                    complete: function(xhr, status){
                    },
                    error: function () {
                        $('.text_asset_submit_response').show();
                        $('.text_asset_submit_response').find('.request_url').html('<pre>'+"/usaapi/narratives/"+$('#text_asset_id').val()+'</pre>');
                        $('.text_asset_submit_response').find('.response_code').html('<pre>'+500+'</pre>');
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
                url: "/usaapi/narratives.json"+param_str,
                dataType: 'json',
                type: 'GET',
                success: function (data,status) {
                    $('.text_asset_all_submit').show();
                    $('.text_asset_all_submit').find('.request_url').html('<pre>'+"/usaapi/narratives.json"+param_str+'</pre>');
                    $('.text_asset_all_submit').find('.response_code').html('<pre>'+200+'</pre>');
                    $('.text_asset_all_submit').find('.response_body').addClass('json').html('<pre class="json">'+formatData(data)+'</pre>');
                    console.log(data);
                },
                complete: function(xhr, status){
                },
                error: function () {
                    $('.text_asset_all_submit').show();
                    $('.text_asset_all_submit').find('.request_url').html('<pre>'+"/usaapi/narratives/"+$('#text_asset_id').val()+'</pre>');
                    $('.text_asset_all_submit').find('.response_code').html('<pre>'+500+'</pre>');
                }
            });
        });

        function formatData(obj){
            formattedHTML = '';
            return JSON.stringify(obj, null, "	").replace(/\n/g, "<br>");
        }
    });
})(jQuery);