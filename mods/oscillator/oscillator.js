
define(['jquery', 'audioContext', 'text!mods/oscillator/oscillator_tmpl.html'], function( $, audioContext, oscillatorTmpl ) {

	"use strict";

	var oscillator = {

		$container: null,
		$body: null,
		$template: null,

		inst: null,
		freq: 440,
		wType: 'square',
		started: false,

		init : function() {
			console.log('osc init...');
			this.$container = $('#osc-display');
			this.$body = $('body');
			this.$template = $(oscillatorTmpl);
			this.$container.append(this.$template);
			this.setListeners();
			this.createOsc();
		},

		createOsc: function() {
			this.inst = null;
			this.inst = audioContext.createOscillator();
			this.inst.type = this.wType;
			this.inst.frequency.value = this.freq; // value in hertz
			this.inst.gainNode = audioContext.createGain();
			this.inst.gainNode.gain.value = 0.1;
			this.inst.connect(this.inst.gainNode);
			//this.inst.gainNode.connect(audioContext.destination);
			if (!audioContext.osc) {
				console.log('Define the source!');
				audioContext.osc = this.inst;//audioContext.createMediaElementSource(waveform.$player[0]);
			}
			
		},

		connectOsc: function() {
			this.inst.gainNode.connect(audioContext.destination);
		},
		disconnectOsc: function() {
			this.inst.gainNode.disconnect(audioContext.destination);
		},

		setListeners : function() {
			var self = this;
			$('#freq').on('input change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				self.freq = $targ.val();
				self.inst.frequency.value = self.freq;
				$('#freqDisplay').val(self.freq);
			});
			$('#freqDisplay').on('input change', function(e) {
				var $targ = $(e.currentTarget);
				self.freq = $targ.val();
				self.inst.frequency.value = self.freq;
				$('#freq').val(self.freq);
			});

			$('#wType').on('change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				self.wType = $targ.val();
				self.inst.type = self.wType;
			});
			$('#playPause').on('click', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				if(!$targ.hasClass('playing')) {
					$targ.addClass('playing');
					self.$body.trigger({
						type: 'player.playing',
						e: e
					});
					if (!self.started) {
						audioContext.osc.start();
						self.started = true;
					}
					self.connectOsc();
				} else {
					$targ.removeClass('playing');
					self.$body.trigger({
						type: 'player.pause',
						e: e
					});
					self.disconnectOsc();
				}
			});
		},
	};

	return oscillator;

});


