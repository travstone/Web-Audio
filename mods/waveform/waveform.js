
define(['jquery', 'audioContext', 'text!mods/waveform/waveform_tmpl.html'], function( $, audioContext, waveformTmpl ) {

	"use strict";

	var waveform = {

		$player: null,
		$container: null,
		$body: null,
		$template: null,
		$waveform: null,

		context : audioContext,
		wfAnalyser : null,
		grAnalyser : null,
		wfBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,

		doWfd : false,
		waveformId : null,

		init : function() {
			console.log('waveform init...');
			this.$container = $('#wave-display');
			this.$body = $('body');
			this.$template = $(waveformTmpl);
			this.$container.append(this.$template);
			this.$waveform = $('#waveform');
			this.$player = $('#track-player');
			//this.setHandlers();
			this.setListeners();
			this.getAudio();
		},

		getAudio: function() {

			this.wfAnalyser = this.context.createAnalyser();
			this.wfAnalyser.fftSize = 2048;
			this.wfAnalyser.smoothingTimeConstant = 0.9;

			//this.setListeners();
			this.wfBufferLength = this.wfAnalyser.frequencyBinCount;
			this.ByteTimeDomainArray = new Uint8Array(this.wfBufferLength);
			//FloatTimeDomainArray = new Float32Array(wfBufferLength);

			if (this.$player.length === 1) {
				if (!this.context.source) {
					//console.log('Define the source!');
					this.context.source = this.context.createMediaElementSource(this.$player[0]);
				}
				this.context.source.connect(this.wfAnalyser);
				//this.wfAnalyser.connect(this.context.destination);
				//this.getFFTInfo();

				if (!this.context.outputConnected) {
					this.wfAnalyser.connect(this.context.destination);
					this.context.outputConnected = true;
				}
			} else {
				console.log('we have an osc...');
				this.context.osc1.connect(this.wfAnalyser);
				//this.context.osc2.connect(this.wfAnalyser);

				this.wfAnalyser.getByteTimeDomainData(this.ByteTimeDomainArray);
				this.doWfd = true;
				this.waveformId = requestAnimationFrame( this.drawWaveform );
			}

		},

		round: function(number, precision) {
			var factor = Math.pow(10, precision);
			var tempNumber = number * factor;
			var roundedTempNumber = Math.round(tempNumber);
			return roundedTempNumber / factor;
		},

		// getFFTInfo: function() {
		// 	var self = this;
		// 	var binSize = self.context.sampleRate / self.wfAnalyser.frequencyBinCount;
		// 	var binDur = (1 / self.context.sampleRate) * self.wfAnalyser.frequencyBinCount;
		// 	console.log('Freq bandwidth: ', binSize);
		// 	console.log('Freq Dur: ', self.round(binDur,4));
		// 	$('#tH').text(self.round(binDur,4) + 's');
		// 	$('#tM').text( (self.round(binDur,4)/2)  + 's');
		// },

		setListeners : function() {
			var self = this;

			this.$body.on('player.playing', function(e) {
				console.log('play-ing');
				//self.getFFTInfo();
				self.doWfd = true;
				self.waveformId = requestAnimationFrame( self.drawWaveform );
			});

			this.$body.on('player.pause', function(e) {
				console.log('pause');
				self.doWfd = false;
			});

			$('#stroke').on('input change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
				self.$waveform.attr('stroke-width', value);
				$('#sizeVal').text(value);
			});

			$('#brightness').on('input change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
				self.$waveform.attr('stroke', 'rgba(133, 255, 235,' + value + ')');
				$('#brightnessVal').text(value);
			});

			$('#fftSizeWave').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
					self.wfAnalyser.fftSize = value;
					self.wfBufferLength = self.wfAnalyser.frequencyBinCount;
					self.ByteTimeDomainArray = new Uint8Array(self.wfBufferLength);
					//self.getFFTInfo();
				//$('#waveform-path').attr('stroke', 'rgba(133, 255, 235,' + value + ')');
			});

			$('#smoothingWave').on('input change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
					self.wfAnalyser.smoothingTimeConstant = value;
					self.wfBufferLength = self.wfAnalyser.frequencyBinCount;
					self.ByteTimeDomainArray = new Uint8Array(self.wfBufferLength);
				$('#smoothingWaveVal').text(self.wfAnalyser.smoothingTimeConstant);
			});

		},

		drawWaveform : function() {
			var self = this;
			//console.log('w');
			if (waveform.doWfd) {
				var x = 0,
					d = '',
					i = 0,
					sliceWidth = 1024 * 1.0 / waveform.wfBufferLength,
					v,
					y;

				waveform.wfAnalyser.getByteTimeDomainData(waveform.ByteTimeDomainArray);
				for(i; i < waveform.wfBufferLength; i++) {
					v = waveform.ByteTimeDomainArray[i] / 128.0;
					y = v * 256/2;
					if(i === 0) {
						d += 'M' + x + ', ' + y;
					} else {
						d += 'L' + x + ', ' + y;
					}
					x += sliceWidth;
				}
				waveform.$waveform[0].setAttribute('d', d);
				waveform.waveformId = requestAnimationFrame(waveform.drawWaveform);
			}
		}

	};

	return waveform;

});


