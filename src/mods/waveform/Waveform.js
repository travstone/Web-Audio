
"use strict";
import template from './Waveform_tmpl.html';
import './Waveform.css';

var WaveformProto = {

    init : function(initArgs) {
        if(initArgs.context) {
            this._AudioToolsContext = initArgs.context;
        } else {
            console.error('Audio Context not valid or not provided');
            return false;
        }
        if(initArgs.sel) {
            this.el = document.querySelector(initArgs.sel);
        } else{
            this.el = document.querySelector('#wave');
        }
        if(this.el) {
            this.el.appendChild(this.buildTemplate())
        } else {
            console.error('Could not locate the target selector');
            return false;
        }
        this._waveformAnimation = this.el.querySelector('#waveform');
        this.fftSizeCtrl = this.el.querySelector('.fftSize');
        this.traceSizeCtrl = this.el.querySelector('.tSize');
        this.traceSizeReadout = this.el.querySelector('.tSizeReadout');
        this.traceBrightnessCtrl = this.el.querySelector('.tBrightness');
        this.traceBrightnessReadout = this.el.querySelector('.tBrightnessReadout');
        this.smoothingCtrl = this.el.querySelector('.smoothing');
        this.smoothingCtrlReadout = this.el.querySelector('.smoothingReadout');


        this.canvas = document.querySelector('.wave-canvas');
        this.canvasCtx = this.canvas.getContext("2d");
        this.canvasCtx.clearRect(0, 0, this.graphWidth, this.graphHeight);
        
        this.canvasCtx.lineWidth = 1;
        this.setTraceSize(this.canvasCtx.lineWidth);
        this.canvasCtx.lineJoin = 'round'
        //this.canvasCtx.strokeStyle = 'rgba(133, 255, 235, 0.8)';
        this.canvasCtx.strokeStyle = 'rgba(212, 255, 248, 0.8)'
        this.canvasCtx.shadowBlur = 5;
        this.canvasCtx.shadowColor = 'rgba(255,255,255, 0.9)';

        this.setListeners();
        this.setupAnalyzer();
    },

    buildTemplate: function() {
        let div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild
    },

    setupAnalyzer: function() {
        let self = this;
        this.wfAnalyser = this._AudioToolsContext.Ctxt.createAnalyser();
        this._AudioToolsContext.Ctxt.tools.push(this)
        this.setFftSize(this._fftSize)
        this.setSmoothing(this._smoothingTimeConstant)
        this.wfBufferLength = this.wfAnalyser.frequencyBinCount;
        this.ByteTimeDomainArray = new Uint8Array(this.wfBufferLength);
        this._AudioToolsContext.Ctxt.masterGain.connect(this.wfAnalyser);
        this.wfAnalyser.getByteTimeDomainData(this.ByteTimeDomainArray);

    },

    _onPlaying: function() {
        console.log('onPlaying...');
        let self = this;
        self.doWfd = true;
        self.waveformId = requestAnimationFrame( function() {
            self.drawWaveform.call(self);
        });
    },

    _onPaused: function() {
        let self = this;
        self.doWfd = false;
    },

    setFftSize: function(sizeArg) {
        this.wfAnalyser.fftSize = this._fftSize = this.fftSizeCtrl.value = sizeArg
        this.wfBufferLength = this.wfAnalyser.frequencyBinCount
        this.ByteTimeDomainArray = new Uint8Array(this.wfBufferLength)
    },

    setTraceSize: function(sizeArg) {
        this.traceSizeReadout.innerHTML = this.traceSizeCtrl.value = sizeArg
        //this._waveformAnimation.setAttribute('stroke-width', sizeArg)
        this.canvasCtx.lineWidth = sizeArg;
    },

    setTraceBrightness: function(sizeArg) {
        this.traceBrightnessReadout.innerHTML = this.traceBrightnessCtrl.value = sizeArg
        //this._waveformAnimation.setAttribute('stroke', 'rgba(133, 255, 235,' + sizeArg + ')')
        //this.canvasCtx.strokeStyle = 'rgba(133, 255, 235, '+sizeArg+')';
        this.canvasCtx.strokeStyle = 'rgba(212, 255, 248, '+sizeArg+')'
        this.canvasCtx.shadowBlur = sizeArg*10;
        this.canvasCtx.shadowColor = 'rgba(255,255,255, '+sizeArg+')';
    },

    setSmoothing: function(sizeArg) {
        this.smoothingCtrlReadout.innerHTML = this.smoothingCtrl.value = sizeArg
        this.wfAnalyser.smoothingTimeConstant = this._smoothingTimeConstant = sizeArg
        this.wfBufferLength = this.wfAnalyser.frequencyBinCount
        this.ByteTimeDomainArray = new Uint8Array(this.wfBufferLength)
    },

    setListeners: function() {
        let self = this,
        body = document.querySelector('body');

        body.addEventListener('atcIsPlaying', function(e) {
            console.log('isPlaying listener in Waveform', e);
            self._onPlaying()
        })

        body.addEventListener('atcIsPaused', function(e) {
            console.log('isPaused listener in Waveform', e);
            self._onPaused()
        })

        this.fftSizeCtrl.addEventListener('change', function(e) {
            self.setFftSize(e.target.value)
        })

        this.traceSizeCtrl.addEventListener('change', function(e) {
            self.setTraceSize(e.target.value);
        });

        this.traceSizeCtrl.addEventListener('input', function(e) {
            self.setTraceSize(e.target.value);
        });

        this.traceBrightnessCtrl.addEventListener('change', function(e) {
            self.setTraceBrightness(e.target.value)
        });

        this.traceBrightnessCtrl.addEventListener('input', function(e) {
            self.setTraceBrightness(e.target.value)
        });

        this.smoothingCtrl.addEventListener('input', function(e) {
            self.setSmoothing(e.target.value)
        })

        this.smoothingCtrl.addEventListener('change', function(e) {
            self.setSmoothing(e.target.value)
        })
    },

    drawWaveformX: function() {
        let self = this;
        //console.log(this);
        if (self.doWfd) {
            let x = 0,
                d = '',
                i = 0,
                sliceWidth = 1024 * 1.0 / self.wfBufferLength,
                v,
                y;

            self.wfAnalyser.getByteTimeDomainData(self.ByteTimeDomainArray);
            for(i; i < self.wfBufferLength; i++) {
                v = self.ByteTimeDomainArray[i] / 128.0;
                y = v * 256/2;
                if(i === 0) {
                    d += 'M' + x + ', ' + y;
                } else {
                    d += 'L' + x + ', ' + y;
                }
                x += sliceWidth;
            }
            self._waveformAnimation.setAttribute('d', d);
            self.waveformId = requestAnimationFrame( function() {
                self.drawWaveform.call(self)
            });
        }
    },

    drawWaveform: function() {
        let self = this;
        //console.log(this);
        if (self.doWfd) {

            // self.canvasCtx.fillStyle = 'rgb(5, 45, 39)';
            // self.canvasCtx.fillRect(0, 0, self.graphWidth, self.graphHeight);

            self.canvasCtx.clearRect(0, 0, self.graphWidth, self.graphHeight);
      
            self.canvasCtx.strokeStyle = 'rgba(0, 255, 0, 0.8)'
            self.canvasCtx.beginPath();
            self.canvasCtx.moveTo(0, self.graphHeight/2);
            self.canvasCtx.lineTo(self.graphWidth, self.graphHeight/2);
            self.canvasCtx.stroke();

            let x = 0,
                d = '',
                i = 0,
                sliceWidth = self.graphWidth * 1.0 / self.wfBufferLength,
                v,
                y;

            self.wfAnalyser.getByteTimeDomainData(self.ByteTimeDomainArray);

            self.canvasCtx.strokeStyle = 'rgba(212, 255, 248, 0.8)'
            self.canvasCtx.beginPath();
            for(var i = 0; i < self.wfBufferLength; i++) {
   
                var v = self.ByteTimeDomainArray[i] / 128.0;
                var y = v * self.graphHeight/2;
        
                if(i === 0) {
                  self.canvasCtx.moveTo(x, y);
                } else {
                  self.canvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
              }

              //self.canvasCtx.lineTo(self.graphWidth, self.graphHeight/2);
              self.canvasCtx.stroke();
            

            // for(i; i < self.wfBufferLength; i++) {
            //     v = self.ByteTimeDomainArray[i] / 128.0;
            //     y = v * 256/2;
            //     if(i === 0) {
            //         d += 'M' + x + ', ' + y;
            //     } else {
            //         d += 'L' + x + ', ' + y;
            //     }
            //     x += sliceWidth;
            // }
            // self._waveformAnimation.setAttribute('d', d);
            self.waveformId = requestAnimationFrame( function() {
                self.drawWaveform.call(self)
            });
        }
    }

};

Waveform.prototype = WaveformProto

function Waveform(newArgs) {
    this._waveformAnimation = null
    this._AudioToolsContext  = null
    this.wfAnalyser  = null
    this.wfBufferLength  = null
    this.ByteTimeDomainArray  = null
    this._fftSize = 2048
    this. _smoothingTimeConstant = 0.8
    this.doWfd  = false
    this.waveformId  = null
    this.fftSizeCtrl = null
    this.traceSizeCtrl = null
    this.traceSizeReadout = null
    this.traceBrightnessCtrl = null
    this.traceBrightnessReadout = null
    this.smoothingCtrl = null
    this.smoothingCtrlReadout = null

    this.graphHeight = 256
    this.graphWidth = 1024
    this.canvas = null
    this.canvasCtx = null

    if(newArgs) {
        this.init(newArgs)
    }
    return this
}

export default Waveform
