(() => {
	async function replaceNanaNuxtData() {
		// Send data to contentScript.js as message payload
		window.postMessage({
			type: 'FROM_PAGE',
			nanaNuxtData: window.__NUXT__,
		});
	}

	function locationChangeHandler() {
		replaceNanaNuxtData();
	}

	history.pushState = ((f) =>
		function pushState() {
			let ret = f.apply(this, arguments);
			window.dispatchEvent(new Event('pushstate'));
			window.dispatchEvent(new Event('locationchange'));
			return ret;
		})(history.pushState);

	history.replaceState = ((f) =>
		function replaceState() {
			let ret = f.apply(this, arguments);
			window.dispatchEvent(new Event('replacestate'));
			window.dispatchEvent(new Event('locationchange'));
			return ret;
		})(history.replaceState);

	window.addEventListener('popstate', () => {
		window.dispatchEvent(new Event('locationchange'));
	});

	window.addEventListener('locationchange', async () => {
		locationChangeHandler();
	});
	locationChangeHandler();
})();
