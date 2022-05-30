chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (
		tab.url &&
		tab.url.includes('nana-music.com/sounds') &&
		changeInfo.status == 'complete'
	) {
		try {
			const response = await chrome.tabs.sendMessage(tabId, 'SOUNDS');
			console.log(response);
		} catch (e) {
			console.log(e);
		}
	}
});
