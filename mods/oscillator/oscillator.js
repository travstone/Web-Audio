
define(['jquery', 'audioContext', 'text!mods/oscillator/oscillator_tmpl.html'], function( $, audioContext, oscillatorTmpl ) {

	"use strict";

	var oscillator = {

		$container: null,
		$body: null,
		$template: null,

		inst: {},
		freq: 440,
		wType: 'square',
		started: {
			'osc1': false,
			'osc2': false
		},

		init : function() {
			console.log('osc init...');
			this.$container = $('#osc-display');
			this.$body = $('body');
			this.$template = $(oscillatorTmpl);
			this.$container.append(this.$template);
			this.setListeners();
			this.createOsc('osc1');
			this.createOsc('osc2');
		},

		createOsc: function(oscId) {
			//this.inst1 = null;

			this.inst[oscId] = audioContext.createOscillator();


			this.inst[oscId].type = this.wType;
			//this.inst.frequency.value = this.freq; // value in hertz
			this.inst[oscId].frequency.setValueAtTime(this.freq, audioContext.currentTime); // value in hertz
			this.inst[oscId].gainNode = audioContext.createGain();
			//this.inst.gainNode.gain.value = 0.1;
			this.inst[oscId].gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
			this.inst[oscId].connect(this.inst[oscId].gainNode);
			//this.inst.gainNode.connect(audioContext.destination);
			if (!audioContext[oscId]) {
				console.log('Define the source!');
				audioContext[oscId] = this.inst[oscId];//audioContext.createMediaElementSource(waveform.$player[0]);
			}
			
		},

		connectOsc: function(inst) {
			this.inst[inst].gainNode.connect(audioContext.destination);
		},
		disconnectOsc: function(inst) {
			this.inst[inst].gainNode.disconnect(audioContext.destination);
		},

		setListeners : function() {
			var self = this;
			$('.control-freq-slider').on('input change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget),
					inst = $targ.closest('.osc-instance').data('instance'),
					freq = $targ.val();
				//self.inst.frequency.value = self.freq;
				self.inst[inst].frequency.setValueAtTime(freq, audioContext.currentTime);
				$targ.closest('.osc-instance').find('.control-freq-display').val(freq);
			});
			$('.control-freq-display').on('input change', function(e) {
				console.log('beep');
				var $targ = $(e.currentTarget),
					inst = $targ.closest('.osc-instance').data('instance'),
					freq = $targ.val();
				//self.inst.frequency.value = self.freq;
				self.inst[inst].frequency.setValueAtTime(freq, audioContext.currentTime);
				$targ.closest('.osc-instance').find('.control-freq-slider').val(freq);
			});

			$('.control-wavetype').on('change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget),
					inst = $targ.closest('.osc-instance').data('instance');
				self.inst[inst].type = $targ.val();
				//self.inst1.type = self.wType;
			});
			$('.control-play').on('click', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget),
					inst = $targ.closest('.osc-instance').data('instance');
				console.log(inst);	
				if(!$targ.hasClass('playing')) {
					$targ.addClass('playing');
					self.$body.trigger({
						type: 'player.playing',
						e: e
					});
					if (!self.started[inst]) {
						audioContext[inst].start();
						self.started[inst] = true;
					}
					self.connectOsc(inst);
				} else {
					$targ.removeClass('playing');
					self.$body.trigger({
						type: 'player.pause',
						e: e
					});
					self.disconnectOsc(inst);
				}
			});
		},
	};

	return oscillator;

});


