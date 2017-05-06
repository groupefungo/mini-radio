chrome.runtime.getBackgroundPage(function (backgroundPage) {
	var volume	= backgroundPage.volume(),
		play	= backgroundPage.playing(),
		mute 	= backgroundPage.muted();

	chrome.storage.local.get('history', function (data) {

		new Vue({
			el: '#player',
			data: {
				stations: JSON.parse(data.history),
				play: play,
				mute: mute,
				volume: volume,
				volumeIcon: volumeIcon (mute, volume),
				titPopup: chrome.i18n.getMessage("titPopup"),
				msgEmptyHistory: chrome.i18n.getMessage("msgHistory"),
				msgStations: chrome.i18n.getMessage("msgStations"),
				msgStop: chrome.i18n.getMessage("msgStop"),
				msgPlay: chrome.i18n.getMessage("msgPlay")
			},
			methods: {
				btnPlay: function (index, event) {
					event.preventDefault();

					var stations = this.stations,
						station = stations[index];

					backgroundPage.playerPlay(station.stream);

					if (index) {
						stations.unshift(station); // Go to first element
						stations.splice(index + 1, 1); // Delete now element

						// On enregistre dans le bonne ordre
						chrome.storage.local.set({'history': JSON.stringify(stations)});
					}
					
					this.play = true;

					_gaq.push(['_trackEvent', 'Radio', 'Popup play', station.name + ' - ' + station.city]);
				},
				btnStop: function () {
					backgroundPage.playerStop();
					this.play = false;
				},
				btnMute: function () {
					backgroundPage.playerMute();

					if (this.mute) {
						this.mute = false;
					} else {
						this.mute = true;
					}
					
					this.volumeIcon = volumeIcon (this.mute, this.volume);
				},
				btnVolume: function (value) {
					this.volume = value;
					backgroundPage.playerVolume(value);
					this.volumeIcon = volumeIcon (this.mute, this.volume);
				}
			}
		})
	});
	
	document.getElementById('options').onclick = function () {
		chrome.runtime.openOptionsPage();
	};
});

function volumeIcon (isMute, volume) {
	icon = 'mute';

	if (!isMute && volume > 6) {
		icon = 'high';
	} else if (!isMute && volume > 2 && volume < 7) {
		icon = 'medium';
	} else if (!isMute && volume && volume < 3) {
		icon = 'low';
	} else if (isMute) {
		icon = 'mute2';
	}

	return icon;
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-72863921-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();