console.log('Chredirect running...');

chrome.webRequest.onBeforeRequest.addListener(
    checkRedirect, {urls: ['<all_urls>']}, ['blocking']
);

chrome.storage.onChanged.addListener(updateRules);

chrome.storage.sync.get({'rules': []}, function(result){
    rules = result['rules'];
});

var rules = [];

function checkRedirect(details){
    if(details.type != 'main_frame' && details.type != 'sub_frame')
        return {cancel: false};

    for(var i=0; i<rules.length; ++i){
        var rule = rules[i];

        if(!rule.active)
            continue;

        console.log('Testing rule `%s` on request URL %s', rule.name, details.url);
        
        var re = new RegExp(rule.pattern, 'g');
        if(re.test(details.url)){
            var redirectUrl = details.url.replace(re, new RegExp(rule.replace));
            if(redirectUrl[0] == '/')
                redirectUrl = redirectUrl.substring(1, redirectUrl.length-1); // TODO dirty hack

            console.info('Redirecting %s to %s', details.url, redirectUrl);
            return {redirectUrl: redirectUrl};
        }
    }

    console.log('No rule matched');
    return {cancel: false};
}

function updateRules(changes, namespace){
    var rulesChange = changes['rules'];

    console.info('Updating rules from', rulesChange.oldValue, 'to', rulesChange.newValue);
    rules = rulesChange.newValue;
}
