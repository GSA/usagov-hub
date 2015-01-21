(function ($) {
 
/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/
 
$.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {

	if ( typeof shouldRunHandlerOnce == 'undefined' ) {
		shouldRunHandlerOnce = true;
	}

	var found	= 'found';
	var $this	= $(this.selector);
	
	if ( $this.length > 0 ) {
		handler();
	}
	
	if (!isChild)
	{
		(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
			window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
		;
	}
	else if (shouldRunHandlerOnce && $this.length > 0)
	{
		window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
	}
	
	return $this;
}

$.fn.waitUntilNotExists	= function (handler, shouldRunHandlerOnce, isChild) {

	if ( typeof shouldRunHandlerOnce == 'undefined' ) {
		shouldRunHandlerOnce = true;
	}

	var found	= 'found';
	var $this	= $(this.selector);
	
	if ( $this.length == 0 ) {
		handler();
	}
	
	if (!isChild)
	{
		(window.waitUntilNotExists_Intervals = window.waitUntilNotExists_Intervals || {})[this.selector] =
			window.setInterval(function () { $this.waitUntilNotExists(handler, shouldRunHandlerOnce, true); }, 500)
		;
	}
	else if (shouldRunHandlerOnce && $this.length == 0)
	{
		window.clearInterval(window.waitUntilNotExists_Intervals[this.selector]);
	}
	
	return $this;
}
 
}(jQuery));