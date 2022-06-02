(() => {
	function init() {
		// We just need to inject it once because Nana page is SSR
		injectScript(chrome.runtime.getURL('injectedScript.js'), 'body');

		chrome.runtime.onMessage.addListener((page, sender, sendResponse) => {});

		window.addEventListener('message', (event) => {
			// Check if the message is coming from the same page
			if (event.source != window) return;

			// Check if the message is the one that's coming from injectedScript.js (from page)
			if (event.data.type && event.data.type == 'FROM_PAGE') {
				// Check if nanaNuxtData is exist
				if (!(event.data && event.data.nanaNuxtData)) return;

				// Logic
				onMessageLogicHandler(event);
			}
		});
	}

	function injectScript(file_path, tag) {
		var node = document.getElementsByTagName(tag)[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', file_path);
		node.appendChild(script);
	}

	function onMessageLogicHandler(event) {
		const nanaNuxtData = event.data.nanaNuxtData;
		setLocalStorage(nanaNuxtData, event.data.page);
		insertDownloadButton(nanaNuxtData.state.posts.mainPost.sound_url);
	}

	function setLocalStorage(nanaNuxtData, page) {
		let mainUser,
			mainPostUser,
			user = {};
		if (page === 'USERS') {
			mainUser = nanaNuxtData.state.users?.mainUser;
			user = {
				id: mainUser?.user_id,
				picUrl: mainUser?.pic_url,
				screenName: mainUser?.screen_name,
			};
		} else if (page === 'SOUNDS') {
			mainPostUser = nanaNuxtData.state.posts?.mainPost?.user;
			user = {
				id: mainPostUser?.user_id,
				picUrl: mainPostUser?.pic_url,
				screenName: mainPostUser?.screen_name,
			};
		}
		chrome.storage.sync.set({ user });
	}

	async function insertDownloadButton(soundUrl) {
		const li = document.createElement('li');
		li.onclick = () => {
			window.open(soundUrl, '_blank').focus();
		};
		li.style.display = 'inherit';
		li.style.flexDirection = 'column';
		li.style.alignItems = 'center';
		li.style.cursor = 'pointer';
		li.style.marginLeft = '18px';
		li.className = 'download-btn';

		const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
		<path d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z" fill="#fff"/></svg>`;
		const downloadIconContainer = document.createElement('div');
		downloadIconContainer.innerHTML = downloadIcon;
		downloadIconContainer.style.display = 'flex';
		downloadIconContainer.style.alignItems = 'center';
		downloadIconContainer.style.justifyContent = 'center';
		downloadIconContainer.style.width = '36px';
		downloadIconContainer.style.height = '36px';
		downloadIconContainer.style.borderRadius = '50%';
		downloadIconContainer.style.backgroundColor = '#000';
		downloadIconContainer.style.marginBottom = '5px';
		downloadIconContainer.style.cursor = 'pointer';

		const downloadTextElement = document.createElement('div');
		downloadTextElement.style.fontFamily = 'Helvetica';
		downloadTextElement.style.fontSize = '10px';
		downloadTextElement.style.fontWeight = '600';
		downloadTextElement.style.color = '#757575';
		downloadTextElement.innerHTML = 'DOWNLOAD';

		li.appendChild(downloadIconContainer);
		li.appendChild(downloadTextElement);

		const copyBtn = await waitForElement('.share-btn__list .copy-btn');
		if (copyBtn) {
			copyBtn.insertAdjacentElement('afterend', li);
		}
	}

	function waitForElement(selector) {
		return new Promise((resolve) => {
			let current = null;
			let timeoutId = null;
			const observer = new MutationObserver((mutations) => {
				// If there is any change in the document, remove timeout
				current = document.querySelector(selector);
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					observer.disconnect();
					resolve(current);
				}, 100);
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		});
	}

	init();
})();
