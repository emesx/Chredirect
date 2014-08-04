console.log('Chredirect running...');

chrome.webRequest.onBeforeRequest.addListener(
	checkRedirect, {urls: ["<all_urls>"]}, ["blocking"]
);

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. ' +
					'Old value was "%s", new value is "%s".',
					key,
					namespace,
					storageChange.oldValue,
					storageChange.newValue
		);
	}
});

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