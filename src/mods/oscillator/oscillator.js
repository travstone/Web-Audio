
"use strict";
import template from './Oscillator_tmpl.html';
import './Oscillator.css';

const OscProto = {

    init: function(initArgs) {
        if(initArgs.context) {
            this._AudioToolsContext = initArgs.context;
        } else {
            console.error('Audio Context not valid or not provided');
            return false;
        }
        if(initArgs.sel) {
            this.el = document.querySelector(initArgs.sel);
        } else{
            this.el = document.querySelector('#osc');
        }
        if(this.el) {
            this.el.appendChild(this.buildTemplate())
        } else {
            console.error('Could not locate the target selector');
            return false;
        }
        this.freqInput = this.el.querySelector('.freq'),
        this.freqDisplay = this.el.querySelector('.freqDisplay'),
        this.wTypeSelect = this.el.querySelector('.wType'),
        this.playPause = this.el.querySelector('.playPause')
        this.playPause.innerHTML = 'Play'
        this.setListeners();
        this.setupOscillator();
    },

    buildTemplate: function() {
        let div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild
    },

    setupOscillator: function() {
        this._OscillatorInstance = this._AudioToolsContext.Ctxt.createOscillator()
        this._AudioToolsContext.Ctxt.inst.push(this)
        this.setWaveType(this.wType)
        this.setFreq(this.freq)
        this._OscillatorInstance.gainNode = this._AudioToolsContext.Ctxt.createGain()
        this._OscillatorInstance.gainNode.gain.value = 0.9
        this._OscillatorInstance.connect(this._OscillatorInstance.gainNode)
        // Note that we start this immediately, but it only becomes audible 
        // When we connect the gain node to the destination; see _connect()
        this._OscillatorInstance.start()
        
    },

    setFreq: function(newFreq) {
        this._OscillatorInstance.frequency.value = this.freq = this.freqInput.value = this.freqDisplay.value = newFreq;
    },

    setWaveType: function(newWaveType) {
        this._OscillatorInstance.type = this.wType = this.wTypeSelect.value = newWaveType; 
    },

    _connect: function() {
        if(!this.playing) {
            this._OscillatorInstance.gainNode.connect(this._AudioToolsContext.Ctxt.masterGain);
        }
        this.playing = true;
        this.playPause.innerHTML = 'Pause'
    },
    _disconnect: function() {
        if(this.playing) {
            this._OscillatorInstance.gainNode.disconnect(this._AudioToolsContext.Ctxt.masterGain);
        }
        this.playing = false;
        this.playPause.innerHTML = 'Play'
    },

    setListeners : function() {
        let self = this;

        this.freqInput.addEventListener('change', function(e) {
            self.setFreq(e.target.value);
        });

        this.freqInput.addEventListener('input', function(e) {
            self.setFreq(e.target.value);
        });

        this.freqDisplay.addEventListener('change', function(e) {
            self.setFreq(e.target.value);
        });

        this.freqDisplay.addEventListener('input', function(e) {
            self.setFreq(e.target.value);
        });

        this.wTypeSelect.addEventListener('change', function(e) {
            self.setWaveType(e.target.value);
        });

        this.playPause.addEventListener('click', function(e) {
            if(self.playing) {
                self._disconnect();
            } else {
                self._connect();
            }
        });

    },
};

Oscillator.prototype = OscProto;

function Oscillator(newArgs) {
    this.el = null
    this.freqInput = null
    this.freqDisplay = null
    this.wType = null
    this.playPause = null
    this._OscillatorInstance = null
    this.freq = 440
    this.wType = 'square'
    this.started = false
    this.playing = false
    this._AudioToolsContext = null
    if(newArgs) {
        this.init(newArgs)
    }
    return this
}

export default Oscillator
