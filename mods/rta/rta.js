
define(['jquery', 'audioContext', 'text!mods/rta/rta_tmpl.html'], function( $, audioContext, rtaTmpl ) {

	"use strict";

	var rta = {

		$player: null,
		$container: null,
		$body: null,
		$template: null,
		$waveform: null,

		context : audioContext,
		grAnalyser : null,
		grBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,
		FloatFrequencyArray: null,
		heightFactor : 90,

		doBgd : false,
		bargraphId : null,

		init : function(useEl) {
			console.log('rta init...');
			this.$container = $('#rta-display');
			this.$body = $('body');
			this.$template = $(rtaTmpl);
			this.$container.append(this.$template);
			this.$rta = $('#rta');
			this.$player = $('#track-player');
			//this.setHandlers();
			this.setListeners();
			this.getAudio();
		},

		getAudio: function() {
			this.grAnalyser = this.context.createAnalyser();
			this.grAnalyser.fftSize = 256;//128;// 256;
			this.grAnalyser.maxDecibels = -15;
			this.grAnalyser.minDecibels = -80;
			//console.log(this.grAnalyser.minDecibels);
			//this.setListeners();
			this.grBufferLength = this.grAnalyser.frequencyBinCount;
			this.ByteFrequencyArray = new Uint8Array(this.grBufferLength);
			this.FloatFrequencyArray = new Float32Array(this.grBufferLength);

			if (this.$player.length === 1) {
				if (!this.context.source) {
					//console.log('Define the source!');
					this.context.source = this.context.createMediaElementSource(this.$player[0]);
				}
				this.context.source.connect(this.grAnalyser);
				if (!this.context.outputConnected) {
					this.grAnalyser.connect(this.context.destination);
					this.context.outputConnected = true;
				}
			} else {
				audioContext.osc.connect(this.grAnalyser);

				this.grAnalyser.getByteFrequencyData(this.ByteFrequencyArray);
				this.grAnalyser.getFloatFrequencyData(this.FloatFrequencyArray);
				this.doBgd = true;
				this.bargraphId = requestAnimationFrame( this.drawBarGraph );
			}
		},

		setListeners : function() {

			var self = this;

			this.$body.on('player.playing', function(e) {
				self.doBgd = true;
				self.bargraphId = requestAnimationFrame( self.drawBarGraph );
			});

			this.$body.on('player.pause', function(e) {
				self.doBgd = false;
			});

			$('#maxDb').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				self.grAnalyser.maxDecibels = val;
				$('#maxDbVal').text(val);
			});

			$('#minDb').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				self.grAnalyser.minDecibels = val;
				$('#minDbVal').text(val);
			});

			$('#fftSize').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				self.grAnalyser.fftSize = val;
				self.grBufferLength = self.grAnalyser.frequencyBinCount;
				self.ByteFrequencyArray = new Uint8Array(self.grBufferLength);
				//console.log(self.grBufferLength);
			});

		},

		drawBarGraph : function() {
			var self = this;
			if (rta.doBgd) {
				rta.$rta.children().not('#neg30, #neg60').remove();
				var x = 0,
					i = 0,
					sliceWidth = 8 * 1.0 / rta.grBufferLength,
					y;

				var barWidth = (1024 / rta.grBufferLength);// * 2.5;
				var barHeight,
					heightFactor = 256;

				rta.grAnalyser.getByteFrequencyData(rta.ByteFrequencyArray);
				for(i; i < rta.grBufferLength; i++) {
					barHeight = rta.ByteFrequencyArray[i];///2;
					var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
					bar.setAttribute('y', heightFactor-barHeight );
					bar.setAttribute('width',barWidth);
					bar.setAttribute('height',barHeight);
					var ha = heightFactor-barHeight;
					bar.setAttribute('style','fill: hsl('+ha+', 100%, 50%);');
					rta.$rta[0].appendChild(bar);
					x += barWidth;
				}

				rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
			}
		}

	};

	return rta;

});


