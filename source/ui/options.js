$(function(){
    $('#saveButton').click(saveRules);
    $('#addButton').click(addRule);
    $('#ruleTable').on('click', '.deleteButton', deleteRule);
    loadRules();
});

function loadRules(){
    chrome.storage.sync.get({'rules': []}, function(result) {
        var rules = result.rules;
        console.info('Loaded rules', rules);

        for(var idx=0; idx<rules.length; ++idx){
            var rule = rules[idx],
                $el = addRule();

            $el.find('.inputActive').prop('checked', rule.active);
            $el.find('.inputName').val(rule.name);
            $el.find('.inputPattern').val(rule.pattern);
            $el.find('.inputReplace').val(rule.replace);
        }
    });
}

function saveRules(){
    var rules = [];
    $('#ruleTable').find('tbody tr').each(function(idx, el){
        var $el = $(el);
        
        var rule = {
            id      : idx,
            active  : $el.find('.inputActive').is(':checked'),
            name    : $el.find('.inputName').val(),
            pattern : $el.find('.inputPattern').val(),
            replace : $el.find('.inputReplace').val()
        };
        
        rules.push(rule);
    });
    
    console.info('Saving rules', rules);
    chrome.storage.sync.set({'rules': rules}, function() {
        var $msg = $('#saveMessage');
        $msg.text('Saved...').fadeIn(100);
        setTimeout(function(){$msg.fadeOut();}, 1500);
    });
}

function addRule(){
    var row$ = $("#ruleRowTemplate").clone().attr("id",null);
    row$.appendTo("#ruleTable tbody");
    return row$;
}

function deleteRule(){
    $(this).closest('tr').remove();
}

