(() => {
	function init() {
		// We just need to inject it once because Nana page is SSR
		injectScript(chrome.runtime.getURL('injectedScript.js'), 'body');

		chrome.runtime.onMessage.addListener((page, sender, sendResponse) => {
			if (page == 'SOUNDS') {
				chrome.storage.local.get(null, (items) => {
					sendResponse({ test: items });
				});
			}
			sendResponse({});
		});
	}

	function injectScript(file_path, tag) {
		var node = document.getElementsByTagName(tag)[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', file_path);
		node.appendChild(script);
	}

	init();
})();
