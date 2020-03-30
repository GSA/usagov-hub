const fileSuffix = '/index.html';
const dirSuffix  = 'index.html';

// e.g. "/some/page" but not "/", "/some/" or "/some.jpg"
const regexSuffixless = /\/[^\/.]+$/;

// e.g. "/some/" or "/some/page/" but not root "/"
const regexTrailingSlash = /.+\/$/;

// e.g. begins with a certain directory
const regexCaseSensitive = /^\/?(css|fonts|images|js|sites|explore|explorar|analytics)(\/|$)/i;

/// this is the lambda entry point
exports.handler = (event, context, callback) => 
{
	const { request } = event.Records[0].cf;

	var uri = rewriteRequestUrl(request.uri);
	if ( uri !== request.uri)
	{
		request.uri = uri;
	}

	callback(null, request);
};

/// this logic that can be used outside of lambda in a standalone nodejs app
const rewriteRequestUrl =  ( url ) =>
{
	/// set lowercasing logic
	if ( ! url.match(regexCaseSensitive) )
	{
		url = url.toLowerCase();
	}

	// Append suffix to origin request
	if (fileSuffix && url.match(regexSuffixless)) {
		url += fileSuffix;

	// Append directory suffix to origin directory request
	} else if (dirSuffix && url.match(regexTrailingSlash)) {
		url += dirSuffix;
	}

	return url;
}


/// this is the nodejs export of our business logic
exports.rewriteRequestUrl = rewriteRequestUrl;

