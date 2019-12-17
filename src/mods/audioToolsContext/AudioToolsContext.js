
'use strict';
import template from './AudioToolsContext_tmpl.html';

let AudioToolsContextProto = {

	init: function(initArgs) {
        if(initArgs && initArgs.sel) {
            this.el = document.querySelector(initArgs.sel);
        } else{
            this.el = document.querySelector('#atc');
        }
        if(this.el) {
            this.el.appendChild(this.buildTemplate())
        } else {
            console.error('Could not locate the target selector');
            return false;
		}
		

		this.el = document.querySelector('#atc');
		this.body = document.querySelector('body');
		this.volCtrl = this.el.querySelector('.volCtrl')
		this.volCtrlDisplay = this.el.querySelector('.volCtrlDisplay')
		this.playPause = this.el.querySelector('.playPause')
		this.playPause.innerHTML = 'Play'
		this.setupContext()
		this.setListeners()
	},

	buildTemplate: function() {
        let div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild
	},

	setupContext: function() {
		this.Ctxt = (window.webkitAudioContext) ? new webkitAudioContext() : new AudioContext()
		this.Ctxt.source = null
		this.Ctxt.outputConnected = false
		this.Ctxt.masterGain = this.Ctxt.createGain();
		this.setVolume(this.masterVolume)
		//this.Ctxt.masterGain.connect(this.Ctxt.destination);
		this.Ctxt.inst = []
		this.Ctxt.tools = []
		
	},

	setVolume: function(volLevel) {
		this.Ctxt.masterGain.gain.value = this.volCtrl.value = this.volCtrlDisplay.value = volLevel
	},

	masterPlayPause: function(action) {
		let self = this;
		if(action === 'start') {
			self.Ctxt.inst.forEach(element => {
				element._connect();
			});
			this.body.dispatchEvent(this.isPlaying)
			self.playing = true
			self.playPause.innerHTML = 'Pause'
		}
		if(action === 'stop') {
			self.Ctxt.inst.forEach(element => {
				element._disconnect();
			});
			this.body.dispatchEvent(this.isPaused)
			self.playing = false
			self.playPause.innerHTML = 'Play'
		}
	},

	setListeners: function() {

		let self = this;

		this.volCtrl.addEventListener('input', function(e) {
			self.setVolume(e.target.value)
		})
		this.volCtrl.addEventListener('change', function(e) {
			self.setVolume(e.target.value)
		})

		this.volCtrlDisplay.addEventListener('input', function(e) {
			self.setVolume(e.target.value)
		})
		this.volCtrlDisplay.addEventListener('change', function(e) {
			self.setVolume(e.target.value)
		})
	
        this.playPause.addEventListener('click', function(e) {
            if(self.playing) {
                self.masterPlayPause('stop');
            } else {
                self.masterPlayPause('start');
            }
        });

		document.addEventListener('keypress', function(e) {
			const keyName = e.key;
			if(keyName === 'p') {
				self.masterPlayPause('start');
			}
			if(keyName === 's') {
				self.masterPlayPause('stop');
			}
		});
	}

}

AudioToolsContext.prototype = AudioToolsContextProto

function AudioToolsContext(newArgs) {
	if(!window.AudioContext && !window.webkitAudioContext) {
		console.error('Web Audio API is not supported in this browser')
		return false
	}

	this.body = null
    this.el = null
    this.volCtrl = null
    this.volCtrlDisplay = null
    this.playPause = null
	this.Ctxt = null
	this.masterVolume = 0.8
	this.playing = false


	this.isPlaying = new Event('atcIsPlaying')
	this.isPaused = new Event('atcIsPaused')
	// this.el = document.querySelector('#atc');

	// let div = document.createElement('div');
	// div.innerHTML = template.trim();
	// let tempParsed = div.firstChild

	// if(this.el) {
	// 	this.el.appendChild(tempParsed)
	// } else {
	// 	console.error('Could not locate the target selector');
	// 	return false;
	// }
    if(newArgs) {
        this.init(newArgs)
    } else {
		this.init()
	}

	return this
}

export default AudioToolsContext
