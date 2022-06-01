export async function getStorage(key) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(key, function (result) {
			resolve(result[key]);
		});
	});
}

export async function getUserSounds(userId) {
	return new Promise((resolve, reject) => {
		fetch(`https://nana-music.com/v2/users/${userId}/sounds?count=99999`)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getActiveTabURL() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
