$(function(){
	$('#saveButton').click(saveRules);
	$('#addButton').click(addRule);
	$('#ruleTable').on('click', '.deleteButton', deleteRule);
	loadRules();
});

function loadRules(){
	chrome.storage.sync.get({'rules': []}, function(result) {
		var rules = result.rules;
		console.log(rules);
	});
}

function saveRules(){
	console.log('Saving rules...');
	var rules = [];
	$("#ruleTable").find('tbody tr').each(function(idx, el){
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
	

	chrome.storage.sync.set({'rules': rules}, function() {
		console.log(rules);	
		alert('Setting saved.');
	});
}

function addRule(){
	$("#ruleRowTemplate").clone().attr("id",null).appendTo("#ruleTable tbody");
}

function deleteRule(){
	$(this).closest('tr').remove();
}

