
define(function() {

	"use strict";
	var audioContextInstance;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if (window.AudioContext) {
		//window.audioContextInstance = new AudioContext();
		audioContextInstance = new AudioContext();
	} else {
		alert('Web Audio API is not supported in this browser');
	}

	//console.log(audioContextInstance);
	return audioContextInstance;

});
