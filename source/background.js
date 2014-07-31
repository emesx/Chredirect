console.log('Chredirect running...');

chrome.webRequest.onBeforeRequest.addListener(
	checkRedirect, {urls: ["<all_urls>"]}, ["blocking"]
);

function checkRedirect(details) {
	var location = getLocation(details.url);

	if(/wykop.pl/.test(location.hostname) && (details.type === 'main_frame' || details.type === 'sub_frame')) {
		var redirectUrl = 'http://w.rdir.pl' + location.pathname;
		console.info('Redirecting ', details.url, 'to', redirectUrl);			
		return {redirectUrl: redirectUrl};
	}
	return {cancel: false}; 
}

function getLocation(href) {
	var l = document.createElement('a');
	l.href = href;
	return l;
};

function arrayIs(array, element){
	return array[0] == element;
}