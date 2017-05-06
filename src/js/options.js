chrome.runtime.getBackgroundPage(function (backgroundPage) {

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "stations.json", true);
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

			new Vue({
				el: '#stations',
				data: {
					stations: JSON.parse(xmlhttp.response),
					titOptions: chrome.i18n.getMessage("titOptions"),
					msgFilter: chrome.i18n.getMessage("msgFilter"),
					msgPlay: chrome.i18n.getMessage("msgPlay")
				},
				methods: {
					btnPlay: function (station, event) {
						event.preventDefault();

						if (station.stream) {
							backgroundPage.playerPlay(station.stream);
							createNotification(station);
						}

						_gaq.push(['_trackEvent', 'Radio', 'Options play', station.name + ' - ' + station.city]);
					}
				}
			});
		}
	};
});

function createNotification (station) {

    chrome.notifications.create('stationPlay', {
		type: 'basic',
		title: station.name + ' ' + station.city,
		message: station.stream,
		iconUrl: 'img/stations/'  + station.logo
	});
	
	history(station);

    // Clear the notification after 5 seconds
    setTimeout(function () {
		chrome.notifications.clear('stationPlay');
	}, 3000);
}

function history (station) {

	chrome.storage.local.get('history', function (data) {

		var historyPlay = [station];

		if (data.history) {
			JSON.parse(data.history).forEach(function (element) {
				if (station.id != element.id) {
					if (historyPlay.length < 8) {
						historyPlay.push(element);
					}
				}
			});
		}

		chrome.storage.local.set({'history': JSON.stringify(historyPlay)});
	});
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-72863921-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();