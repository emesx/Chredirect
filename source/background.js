console.log('Chredirect running...');

chrome.webRequest.onBeforeRequest.addListener(
    checkRedirect, {urls: ["<all_urls>"]}, ["blocking"]
);

chrome.storage.onChanged.addListener(updateRules);

var rules = [];

chrome.storage.sync.get({'rules': []}, function(result) {
    rules = result.rules;
});

function checkRedirect(details) {
    if(details.type !== 'main_frame' && details.type !== 'sub_frame')
        return {cancel: false};         

    for(var i=0; i<rules.length; ++i){
        var rule = rules[i];
        console.log("Testing rule `", rule.name, "` on request URL ", details.url);

        if(!rule.active)
            continue;

        var re = new RegExp(rule.pattern);
        if(re.test(details.url)){
            console.log("Rule `", rule.name, "` matched, redirecting...");

            var redirectUrl = details.url.replace(re, new RegExp(rule.replace));
            if(redirectUrl[0] == '/')
                redirectUrl = redirectUrl.substring(1, redirectUrl.length-1); // TODO dirty hack

            console.info('Redirecting', details.url, 'to', redirectUrl);           
            return {redirectUrl: redirectUrl};
        }
    }

    return {cancel: false};
}

function updateRules(changes, namespace) {
    var rulesChange = changes['rules'];

    console.info("Updating rules from", rulesChange.oldValue, "to", rulesChange.newValue);
    rules = rulesChange.newValue;
}
