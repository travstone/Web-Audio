
"use strict";
import template from './oscillator_tmpl.html';
import '../../../css/styles.css';
import './oscillator.css';
const Oscillator = {

    el: null,
    //body: null,

    inst: null,
    freq: 440,
    wType: 'square',
    started: false,
    playing: false,

    _ATC: null,

    init: function(initArgs) {
        console.log('osc init...');
        // if(window._audioToolsContext) {
        //     this._ATC = window._audioToolsContext;
        // }
        if(initArgs.context) {
            this._ATC = initArgs.context;
        } else {
            console.error('Audio Context not valid or not provided');
            return false;
        }
        this.el = document.getElementById('osc');
        this.el.appendChild(this.buildTemplate())
        this.setListeners();
        this.createOsc();
    },

    buildTemplate: function() {
        let div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild
    },

    createOsc: function() {
        //this.inst = null;
        this.inst = this._ATC.createOscillator();
        this.inst.type = this.wType;
        this.inst.frequency.value = this.freq; // value in hertz
        this.inst.gainNode = this._ATC.createGain();
        this.inst.gainNode.gain.value = 0.1;
        this.inst.connect(this.inst.gainNode);
        //this.inst.gainNode.connect(this._ATC.destination);
        if (!this._ATC.osc) {
            console.log('Define the source!');
            this._ATC.osc = this.inst;//this._ATC.createMediaElementSource(waveform.$player[0]);
        }
        
    },

    connectOsc: function() {
        this.inst.gainNode.connect(this._ATC.destination);
    },
    disconnectOsc: function() {
        this.inst.gainNode.disconnect(this._ATC.destination);
    },

    onFreqChange: function(e, fi, fd) {
        console.log('onFreqChange...', e.target.value);
        this.inst.frequency.value = fi.value = fd.value = e.target.value;
    },

    setListeners : function() {
        let self = this,
            freqInput = document.querySelector('#freq'),
            freqDisplay = document.querySelector('#freqDisplay'),
            wType = document.querySelector('#wType'),
            playPause = document.querySelector('#playPause');

        freqInput.addEventListener('change', function(e) {
            console.log('Freq Input changed... ');
            self.onFreqChange(e, freqInput, freqDisplay);
        });

        freqInput.addEventListener('input', function(e) {
            console.log('Freq Input input... ');
            self.onFreqChange(e, freqInput, freqDisplay);
        });

        freqDisplay.addEventListener('change', function(e) {
            console.log('Freq Display change... ');
            self.onFreqChange(e, freqInput, freqDisplay);
        });

        freqDisplay.addEventListener('input', function(e) {
            console.log('Freq Display input... ');
            self.onFreqChange(e, freqInput, freqDisplay);
        });

        wType.addEventListener('change', function(e) {
            console.log('Wave Type change... ');
            self.inst.type = self.wType = e.target.value;
        });

        playPause.addEventListener('click', function(e) {
            console.log('playPause... ');
            if(self.playing) {
                self.disconnectOsc();
                self.playing = false;
            } else {
                if (!self.started) {
                    self._ATC.osc.start();
                    self.started = true;
                }
                self.connectOsc();
                self.playing = true;
            }
        });

    },
};

export default Oscillator
