import { getStorage, getUserSounds, getActiveTabURL } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
	async function main() {
		const content = document.getElementById('content');
		const container = document.querySelector('.container');
		const title = document.querySelector('.container .title');

		const activeTab = await getActiveTabURL();

		if (activeTab.url.match(/nana-music.com\/(sounds|users)/)) {
			container.style.height = '500px';
			content.style.display = 'block';
			title.innerText = 'Nana Toolbox';

			const user = await getStorage('user');
			if (user) {
				// Add user information
				const userPicDOM = document.querySelector('.user-profile-image img');
				userPicDOM.src = user.picUrl;
				userPicDOM.alt = user.screenName;
				const userProfileNameDOM = document.querySelector('.user-profile-name');
				userProfileNameDOM.innerText = user.screenName;

				// Add user sounds
				const userSounds = await getUserSounds(user.id);
				const soundsHTML = userSounds
					.map((sound) => soundCardTemplate(sound))
					.join('');
				const soundsContainer = document.querySelector('.sounds-container');
				soundsContainer.innerHTML = soundsHTML;

				// Add click event on card
				const cardsDOM = document.querySelectorAll('.sound-card');
				cardsDOM.forEach((card) => {
					card.addEventListener('click', () => {
						window.open(card.dataset.player_url, '_blank').focus();
					});
				});

				// Stop propagation of click event on download button
				const downloadButtons = document.querySelectorAll(
					'.sound-btn-download'
				);
				downloadButtons.forEach((button) => {
					button.addEventListener('click', (e) => {
						e.stopPropagation();
					});
				});

				// Add user statistics
				const userProfileStatisticsDOM = document.querySelector(
					'.user-profile-statistics'
				);
				userProfileStatisticsDOM.innerText = `${userSounds.length} sound(s)`;

				// Add search bar functionality
				const searchBar = document.getElementById('searchbar');
				searchBar.addEventListener('input', (e) => {
					const search = e.target.value.toLowerCase();
					const sounds = soundsContainer.querySelectorAll('.sound-card');
					sounds.forEach((sound) => {
						const isTitleMatch = sound.dataset.title
							.toLowerCase()
							.includes(search);
						const isArtistMatch = sound.dataset.artist
							.toLowerCase()
							.includes(search);
						if (isTitleMatch || isArtistMatch) {
							sound.style.display = 'flex';
						} else {
							sound.style.display = 'none';
						}
					});
				});
			}
		} else {
			title.innerText = 'This is not Nana Sounds/Users page';
			container.style.height = null;
			content.style.display = 'none';
		}
	}

	function soundCardTemplate(sound) {
		return `
		<div class="sound-card" data-title="${sound.title}" data-artist="${sound.artist}" data-player_url="${sound.player_url}">
			<div class="sound-description">
				<p class="sound-title">${sound.title}</p>
				<p class="sound-artist">${sound.artist}</p>
			</div>
			<a class="sound-btn-download" href="${sound.sound_url}" target="_blank">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
					<path
						d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z"
					/>
				</svg>
			</a>
		</div>`;
	}

	main();
});
