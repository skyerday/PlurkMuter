var blockList = "var outSideBlockList = [";

function loop() {
	var blockScript = document.createElement('script');
	blockScript.type = 'text/javascript';
	blockScript.text = blockList;
	document.body.appendChild(blockScript);

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = safari.extension.baseURI + 'Scripts/automute.js';
	document.body.appendChild(script);

	console.log('Add script');
}

function performMessage(event) {
	if (event.name == "mutekeyword") {
		if (event.message.length == 0) return;
		
		var arr = event.message.split(",");
		for (var i=0; i<arr.length; ++i) {
			if (arr[i].length > 0) {
				blockList = blockList + "'" + arr[i] + "',"
			}
		}
		if (blockList.charAt(blockList.length-1) === ",") blockList = blockList.substring(0, blockList.length-1);
		blockList = blockList + "];";
		console.log(blockList);

		window.setTimeout(loop, 2000);
	}
}

if (window.top === window) {
	console.log('PlurkMuter');

	safari.self.addEventListener("message", performMessage, false);
	safari.self.tab.dispatchMessage("fetch", 1);
}