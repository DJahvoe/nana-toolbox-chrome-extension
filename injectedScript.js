(() => {
	async function replaceNanaNuxtData() {
		const pathname = window.location.pathname;
		let page = null;
		if (pathname.includes('sounds')) page = 'SOUNDS';
		else if (pathname.includes('users')) page = 'USERS';
		// Send data to contentScript.js as message payload
		const message = {
			type: 'FROM_PAGE',
			page,
			nanaNuxtData: window.__NUXT__,
		};
		window.postMessage(message);
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
