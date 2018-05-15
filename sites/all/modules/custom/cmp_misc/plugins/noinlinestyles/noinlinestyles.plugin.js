/**
 * @file Plugin to cleanup pasted text.
 */
CKEDITOR.plugins.add( 'noinlinestyles',
{
	init : function( editor )
	{
		function noinlinestyles_cleanup( ev )
		{
			console.log(ev.data);
			if (ev.data.html || ev.data.dataValue) {
                var html = ev.data.html || ev.data.dataValue;
                var filtered_html = html.replace(/\s*style="[^"]*"/i,'');
                if (ev.data.html) {
                    ev.data.html = filtered_html;
                }
                else if (ev.data.dataValue) {
                    ev.data.dataValue = filtered_html;
                }
            }
			/onsole.log(ev.data);
		}
		editor.on( 'paste', noinlinestyles_cleanup );
	}
});
