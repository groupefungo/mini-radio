function volume(){return audio.volume}function playing(){return audio.playing}function muted(){return audio.muted}function playerPlay(stream){audio.play(stream),streamPrev=stream}function playerStop(){audio.stop()}function playerMute(){audio.mute()}function playerVolume(volume){audio.setVolume(volume)}var audio=new rPlayer,streamPrev="";chrome.runtime.onInstalled.addListener(function(details){var version=chrome.runtime.getManifest().version;if("install"===details.reason)chrome.storage.local.set({history:null});else if("update"===details.reason&&details.previousVersion!==version){var xmlhttp=new XMLHttpRequest,updateStations=[],updateHistory=[];xmlhttp.open("GET","stations.json",!0),xmlhttp.send(),xmlhttp.onreadystatechange=function(){4==xmlhttp.readyState&&200==xmlhttp.status&&(JSON.parse(xmlhttp.response).forEach(function(item){updateStations[item.id]=item}),chrome.storage.local.get("history",function(data){JSON.parse(data.history).forEach(function(item,key){updateHistory.push(updateStations[item.id])}),chrome.storage.local.set({history:JSON.stringify(updateHistory)}),updateStations=[],updateHistory=[]}))}}}),chrome.commands.onCommand.addListener(function(command){"play_stop"===command&&audio.playing?playerStop():playerPlay(streamPrev)});