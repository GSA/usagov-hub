/**
 * @file Plugin to cleanup pasted text.
 */
CKEDITOR.plugins.add( 'noinlinestyles',
{
	init : function( editor )
	{
		function noinlinestyles_cleanup( ev )
		{
			if (ev.data.html || ev.data.dataValue) {
                var html = ev.data.html || ev.data.dataValue;
                var filtered_html = html.replace(/\s*style="[^"]*?"/gim,'');
                if (ev.data.html) {
                    ev.data.html = filtered_html;
                }
                else if (ev.data.dataValue) {
                    ev.data.dataValue = filtered_html;
                }
            }
		}
		editor.on( 'paste', noinlinestyles_cleanup );
	}
});
