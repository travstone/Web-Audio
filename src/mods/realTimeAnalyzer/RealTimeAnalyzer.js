
"use strict";
import template from './RealTimeAnalyzer_tmpl.html';
import './RealTimeAnalyzer.css';

var RealTimeAnalyzerProto = {

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
        this.frequencyAnimation = this.el.querySelector('#rta');
        this.fftSizeCtrl = this.el.querySelector('.fftSizeCtrl')
        this.maxDbCtrl = this.el.querySelector('.maxDbCtrl')
        this.maxDbReadout = this.el.querySelector('.maxDbReadout')
        this.minDbCtrl = this.el.querySelector('.minDbCtrl')
        this.minDbReadout = this.el.querySelector('.minDbReadout')



        this.canvas = document.querySelector('.canvas');
        this.canvasCtx = this.canvas.getContext("2d");
        this.intendedWidth = document.querySelector('.rta-window').clientWidth;
        this.WIDTH = this.canvas.width
        this.HEIGHT = this.canvas.height
        //this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        //this.canvas.setAttribute('width',this.intendedWidth);
        // this.canvasCtx.shadowColor = 'black';
        // this.canvasCtx.shadowOffsetY = 10;
        // this.canvasCtx.shadowOffsetX = 10;

        this.setListeners();
        this.setupAnalyzer();
    },

    buildTemplate: function() {
        let div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild
    },

    setupAnalyzer: function() {
        let self = this
        this.grAnalyser = this._AudioToolsContext.Ctxt.createAnalyser();
        this._AudioToolsContext.Ctxt.tools.push(this)
        this.setFftSize(this.fftSize)

        this.setMaxDecibels(this.maxDecibels)
        this.setMinDecibels(this.minDecibels)

        this.grBufferLength = this.grAnalyser.frequencyBinCount;
        this.ByteFrequencyArray = new Uint8Array(this.grBufferLength);

        this._AudioToolsContext.Ctxt.masterGain.connect(this.grAnalyser);
        this.grAnalyser.getByteFrequencyData(this.ByteFrequencyArray);

    },

    _onPlaying: function() {
        //console.log('onPlaying...');
        let self = this;
        self.doBgd = true;
        self.bargraphId = requestAnimationFrame( function() {
            self.drawBarGraph.call(self) 
        });
    },

    _onPaused: function() {
        let self = this;
        self.doBgd = false;
    },

    setFftSize: function(sizeArg) {
        this.grAnalyser.fftSize = this.fftSize = this.fftSizeCtrl.value = sizeArg
        this.grBufferLength = this.grAnalyser.frequencyBinCount;
        this.ByteFrequencyArray = new Uint8Array(this.grBufferLength);
        //this.graphWidth = this.grBufferLength*2
        //this.frequencyAnimation.setAttribute('viewbox', '0 0 '+this.graphWidth+' '+this.graphHeight)
    },

    setMaxDecibels: function(sizeArg) {
        this.grAnalyser.maxDecibels = this.maxDecibels = this.maxDbCtrl.value = this.maxDbReadout.innerHTML = sizeArg
    },

    setMinDecibels: function(sizeArg) {
        this.grAnalyser.minDecibels = this.minDecibels = this.minDbCtrl.value = this.minDbReadout.innerHTML = sizeArg
    },


    setListeners : function() {
        var self = this,
            body = document.querySelector('body');

        body.addEventListener('atcIsPlaying', function(e) {
            console.log('isPlaying listener in RTA', e);
            self._onPlaying()
        })

        body.addEventListener('atcIsPaused', function(e) {
            console.log('isPaused listener in RTA', e);
            self._onPaused()
        })

        this.fftSizeCtrl.addEventListener('change', function(e) {
            self.setFftSize(e.target.value)
        })

        this.maxDbCtrl.addEventListener('input', function(e) {
            self.setMaxDecibels(e.target.value)
        })
        
        this.maxDbCtrl.addEventListener('change', function(e) {
            self.setMaxDecibels(e.target.value)
        })


        this.minDbCtrl.addEventListener('input', function(e) {
            self.setMinDecibels(e.target.value)
        })
        
        this.minDbCtrl.addEventListener('change', function(e) {
            self.setMinDecibels(e.target.value)
        })
    },
    
    drawBarGraphX : function() {
        let self = this;
        self.test++
        if (self.doBgd) {
            //self.frequencyAnimation.children().not('#neg30, #neg60').remove();
            //self.frequencyAnimation.children().not('#neg30, #neg60').remove();
            while (self.frequencyAnimation.firstChild) {
                self.frequencyAnimation.removeChild(self.frequencyAnimation.firstChild);
            }
            let barWidth = (self.graphWidth / self.grBufferLength),
                barHeight,
                totalHeight = self.graphHeight,
                x = 0,
                i = 0;

            self.grAnalyser.getByteFrequencyData(self.ByteFrequencyArray);
            let c = document.createDocumentFragment();
            for(i; i < self.grBufferLength; i++) {
                barHeight = self.ByteFrequencyArray[i];///2;
                let bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
                    heightOffset = totalHeight-barHeight;
                bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
                bar.setAttribute('y', heightOffset );
                bar.setAttribute('width',barWidth);
                bar.setAttribute('height',barHeight);
                bar.setAttribute('style','fill: hsl('+heightOffset+', 100%, 50%);');
                //self.frequencyAnimation.appendChild(bar);
                c.appendChild(bar)
                x += barWidth;
            }
            self.frequencyAnimation.appendChild(c);
            if(self.test < 800) {
            //console.log(self.test)
            self.bargraphId = requestAnimationFrame( function() {
                self.drawBarGraph.call(self)
            });
            }
        }
    },

    drawBarGraph: function() {
        let self = this;

        if (self.doBgd) {

            self.canvasCtx.clearRect(0, 0, self.graphWidth, self.graphHeight);

            let barWidth = (self.graphWidth / self.grBufferLength),
                barHeight,
                totalHeight = self.graphHeight,
                x = 0,
                i = 0;

            self.grAnalyser.getByteFrequencyData(self.ByteFrequencyArray);
            for(i; i < self.grBufferLength; i++) {
                barHeight = self.ByteFrequencyArray[i];

                self.canvasCtx.fillStyle = 'hsl(' + (totalHeight-barHeight) + ', 100%, 50%)';
                self.canvasCtx.fillRect(x,self.graphHeight-barHeight,barWidth,barHeight);
        
                x += barWidth// + 1;
            }

            self.bargraphId = requestAnimationFrame( function() {
                self.drawBarGraph.call(self)
            });

        }

    }


};

RealTimeAnalyzer.prototype = RealTimeAnalyzerProto

function RealTimeAnalyzer(newArgs) {
    this.test = 0,
    this.el = null
    this.frequencyAnimation = null
    this.fftSizeCtrl = null
    this.maxDbCtrl = null
    this.maxDbReadout = null
    this.minDbCtrl = null
    this.minDbReadout = null
    this._AudioToolsContext = null
    this.fftSize = 256
    this.maxDecibels = -12
    this.minDecibels = -60
    this.grAnalyser = null
    this.grBufferLength = null
    this.ByteTimeDomainArray = null
    this.ByteFrequencyArray = null
    this.doBgd = false
    this.bargraphId = null

    this.graphHeight = 256
    this.graphWidth = 1024

    this.canvas = null
    this.canvasCtx = null
    this.intendedWidth = null
    
    this.WIDTH = null
    this.HEIGHT = null


    if(newArgs) {
        this.init(newArgs)
    }
    return this
}

export default RealTimeAnalyzer
