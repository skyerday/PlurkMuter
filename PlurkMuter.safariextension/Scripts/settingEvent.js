function updateSetting() {
	var list = document.getElementById("keywords");
	var setting = "";
	for (var i=0; i<list.length; ++i) {
		setting = setting + "," + list.options[i].text;
	}
	if (setting.length > 0) setting = setting.substring(1, setting.length);
	safari.extension.settings.mutekeyword = setting;
}

function onAddClick() {
	var list = document.getElementById("keywords");
	var input = document.getElementById("keyword");

	var option = document.createElement("option");
	option.text = input.value;
	list.add(option, null);	

	updateSetting();
}

function onDelClick() {
	var list = document.getElementById("keywords");
	var index = list.selectedIndex;
	if (index == -1) return;

	list.remove(index);

	updateSetting();
}

// function performMessage(event) {
// 	if (event.name === "mutekeyword") {
// 		var arr = event.message.split(",");
// 		var list = document.getElementById("keywords");
// 		for (var i=0; i<arr.length; ++i) {
// 			if (arr[i].length > 0) {
// 				var option = document.createElement("option");
// 				option.text = arr[i];
// 				list.add(option, null);
// 			}
// 		}
// 	}
// }

function fetchKeywords() {
	var keywords = safari.extension.settings.mutekeyword;
	var arr = keywords.split(",");
	var list = document.getElementById("keywords");
	for (var i=0; i<arr.length; ++i) {
		if (arr[i].length > 0) {
			var option = document.createElement("option");
			option.text = arr[i];
			list.add(option, null);
		}
	}
}