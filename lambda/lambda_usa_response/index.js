const https = require('https');

const english404Path = '/page-error/index.html';
const spanish404Path = '/espanol/pagina-error/index.html';
const api404Path     = '/search-error/index.html';
const spanishPrefix  = '/espanol/';

exports.handler = async (event, context, callback) =>
{
    var response = event.Records[0].cf.response;
    var request  = event.Records[0].cf.request;

    /// add sts header
    response.headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubdomains; preload'
    }];

    // JKH added
    const headers = response;
    /**
     * JKH
     * research, this function updates the response status to 416 and generates static
     * body content to return to the viewer.  Status 416 is not cached by CloudFront
     */
    const headerCacheControl = 'Cache-Control';
    const noStore = 'no-store';
    // JKH if bad request (400), or request too large (494)
    if (response.status == 400 || response.status == 494)
    {
        // JKH looked up, Cloud Front won't cache this if status is 416...
        // the code below should defeat a cache poisoning denial of service attack
        response.status = 416;
        response.statusDescription = 'Bad Request';
        response.body = 'Back request, please try again.';
        // belt and suspenders...
        if (!headers[headerCacheControl.toLowerCase()]) {
            headers[headerCacheControl.toLowerCase()] = [{
                key: headerCacheControl,
                value: noStore,
            }];
        } else {
            headers[headerCacheControl.toLowerCase()] = [{
                key: headerCacheControl,
                value: noStore,
            }];
        }
        callback(null, response);
        return;
    }

    /// api 404
    if ( response.status == 200 && request.uri.startsWith(api404Path) )
    {
        response.status = 404;
        response.statusDescription = 'Search Error';
        callback(null, response);
        return;
    }

    // JKH changed range, we're doing 400 above
    /// process 404
    if (response.status >= 401 && response.status <= 599 )
    {
        var loader = null;
        /// spanish language 404
        if ( request.uri.startsWith(spanishPrefix) )
        {
            loader = loadPageBody(event,spanish404Path);
            /// english language 404
        } else {
            loader = loadPageBody(event,english404Path);
        }

        /// loader sanity check
        if ( !loader ) {
            callback(null, response);
            return;
        }

        /// prep response with body-replacement headers
        response.headers['cache-control'] = [{
            key:   'Cache-Control',
            value: 'max-age=1'
        }];
        response.headers['content-type'] = [{
            key:   'Content-Type',
            value: 'text/html'
        }];
        response.headers['content-encoding'] = [{
            key:   'Content-Encoding',
            value: 'UTF-8'
        }];

        /// replace body with alternate 404 page body
        await loader.then((body)=>{
            response.body = body;
        }).catch((err)=>{
            console.error(err);
            response.body = default404HTML();
        });
    }

    callback(null, response);
};

const loadPageBody = (event,path) =>
{
    return new Promise( (resolve,reject) =>
    {
        var config  = event.Records[0].cf.config;
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        const req = https.get('https://'+config.distributionDomainName+path, (res) =>
        {
            if (res.statusCode < 200 || res.statusCode >= 300)
            {
                reject('rejected: status='+res.statusCode);
                return;
            }
            var body = [];
            res.on('data', chunk => {
                body.push(chunk);
            }).on('end', () => {
                try {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                } catch(e) {
                    reject('rejected: body concat',e);
                }
            });
        }).on('error', (e) => {
            reject('rejected: 404request error',e);
        });
        /// set a tight turnaround on loading 404 page.
        req.setTimeout( 1000, () => {
            req.abort();
            reject('rejected: internal load timeout');
        });
    });
};

const default404HTML = () =>
{
    return '<!DOCTYPE html><html lang="en" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>404 Page Error &#124; USAGov</title><meta name="robots" content="noindex"></head><body><header><h1 style="color:#c61f0c;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBGRjFCQzgyQjI5RDExRTg4QTI5QUZGNTM1QjM4NjBGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBGRjFCQzgzQjI5RDExRTg4QTI5QUZGNTM1QjM4NjBGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEZGMUJDODBCMjlEMTFFODhBMjlBRkY1MzVCMzg2MEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEZGMUJDODFCMjlEMTFFODhBMjlBRkY1MzVCMzg2MEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7rUGKuAAAgmklEQVR42uxdB3gU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" alt="USAGov Logo" align="middle" widht="80" height="80" /> Page Not Found</h1></header><article style="clear:both;"><header><h2 style="color:#154285;">We Can\'t Find the Page You\'re Looking For</h2></header><p>We\'re sorry, but the page you\'re looking for might have been removed, had its name changed, or is temporarily unavailable.</p><p>If you typed the URL directly, check your spelling and capitalization. Our URLs look like this: usa.gov/example-one.</p></article><article><header><h2 style="color:#154285;">La página que busca no está disponible</h2></header><p>Lo sentimos, pero puede que la página que busca haya sido eliminada, se le haya cambiado el nombre o no esté disponible por ahora.</p><p>Si escribió el URL a mano, verifique su ortografía y el uso de mayúsculas. Nuestros URLs aparecen así: www.usa.gov/espanol/ejemplo-uno. </p></article></body></html>';
}
