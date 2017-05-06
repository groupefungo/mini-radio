var audio = new rPlayer(),
	streamPrev = '';

function volume () {
	return audio.volume;
}

function playing () {
	return audio.playing;
}

function muted () {
	return audio.muted;
}
	
/* Play */
function playerPlay (stream) {
	audio.play(stream);
	
	streamPrev = stream;
}

/* Stop */
function playerStop () {
	audio.stop();
}

/* Mute */
function playerMute () {
	audio.mute();
}

/* Volume */
function playerVolume (volume) {
	audio.setVolume(volume);
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    var version = chrome.runtime.getManifest().version;

	if (details.reason === 'install') {

        // Set history & volume
		chrome.storage.local.set({'history': null});

    } else if (details.reason === 'update' && details.previousVersion !== version) {
        
		// Update history
		var xmlhttp = new XMLHttpRequest(),
			updateStations = [],
			updateHistory = [];

		xmlhttp.open("GET", "stations.json", true);
		xmlhttp.send();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				// Read new data
				JSON.parse(xmlhttp.response).forEach(function (item) {
					updateStations[item.id] = item;
				});

				// Update History
				chrome.storage.local.get('history', function (data) {
					JSON.parse(data.history).forEach(function (item, key) {
						updateHistory.push(updateStations[item.id]);
					});

					chrome.storage.local.set({'history': JSON.stringify(updateHistory)});
					
					// Clear varibles
					updateStations = [];
					updateHistory = [];
				});
			}
		}
  }
});

// PlayerRadio.com
// radioplayer.com
// RPLAYER.COM
// rPLAYER
// rplayerapp.com

/* ShortKey Play/Stop */
chrome.commands.onCommand.addListener(function (command) {
	if (command === 'play_stop' && audio.playing) {
		playerStop(); // Stop Ctrl+Shift+9
	} else {
		playerPlay(streamPrev);
	}
});