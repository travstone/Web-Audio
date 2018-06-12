'use strict';

let audioCapable = false
if (!window.AudioContext || window.webkitAudioContext) {
	console.error('Web Audio API is not supported in this browser')
} else {
	audioCapable = true
}

function AudioToolsContext() {
	if(!audioCapable) {
		return false;
	}
	let _atcInstance = new AudioContext()
	_atcInstance.source = null
	_atcInstance.outputConnected = false
	return _atcInstance
}

export default AudioToolsContext
