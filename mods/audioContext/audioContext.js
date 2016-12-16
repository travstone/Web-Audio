
define(function() {

	"use strict";
	var audioContextInstance;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if (window.AudioContext) {
		if(!window.audioContextInstance) {
			audioContextInstance = new AudioContext();
			window.audioContextInstance = audioContextInstance;
		}
	} else {
		alert('Web Audio API is not supported in this browser');
	}

	//console.log(audioContextInstance);
	return window.audioContextInstance;

});
