
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var oscillator = {

		// $player: $('#track-player'),

		// cont : document.getElementById('ac'),
		// waveformPath : document.getElementById('waveform-path'),

		// context : audioContext, //new (window.AudioContext || window.webkitAudioContext)(),
		// //source : null,
		// wfAnalyser : null,
		// grAnalyser : null,
		// wfBufferLength : null,
		// ByteTimeDomainArray : null,
		// //FloatTimeDomainArray : null,
		// ByteFrequencyArray : null,

		// doWfd : false,
		// waveformId : null,

		freq: 440,
		wType: 'square',

		init : function() {
			console.log('Osc init...');


			oscillator.setListeners();

			oscillator.instance = audioContext.createOscillator();

			oscillator.instance.type = oscillator.wType;
			oscillator.instance.frequency.value = oscillator.freq; // value in hertz
			oscillator.instance.gainNode = audioContext.createGain();
			oscillator.instance.gainNode.gain.value = 0.05;

			oscillator.instance.connect(oscillator.instance.gainNode);
//gainNode.connect(audioCtx.destination);
			oscillator.instance.gainNode.connect(audioContext.destination);
			//oscillator.instance.start();

			if (!audioContext.osc) {
				console.log('Define the source!');
				audioContext.osc = oscillator.instance;//audioContext.createMediaElementSource(waveform.$player[0]);
			};

			// waveform.wfAnalyser = waveform.context.createAnalyser();
			// waveform.wfAnalyser.fftSize = 2048;
			// waveform.wfAnalyser.smoothingTimeConstant = 0.9;
			// if (!waveform.context.source) {
			// 	console.log('Define the source!');
			// 	waveform.context.source = waveform.context.createMediaElementSource(waveform.$player[0]);
			// };
			// //waveform.source = waveform.context.createMediaElementSource(waveform.$player[0]);
			// console.log(waveform.context);
			// waveform.reset();
			// waveform.setListeners();
			// waveform.wfBufferLength = waveform.wfAnalyser.frequencyBinCount;
			// waveform.ByteTimeDomainArray = new Uint8Array(waveform.wfBufferLength);
			// //FloatTimeDomainArray = new Float32Array(wfBufferLength);
			// waveform.context.source.connect(waveform.wfAnalyser);
			// waveform.wfAnalyser.connect(waveform.context.destination);
		},

		reset: function() {
			$('#loading-indicator').hide();

			// $('#track-select').off().on('change', function(e) {
			// 	var $cont = $('.audio-controls'),
			// 		$targ = $(e.currentTarget),
			// 		val = $targ.val(),
			// 		d = $('[value="'+val+'"]').data(),
			// 		$player = $('#track-player');
			// 	//console.log('Track: ' , $targ,  $targ.val(), d);
			// 	$player.html('');
			// 	$player.append('<source src="audio/'+val+'" type="'+d.mtype+'">');
			// 	$player[0].load();
			 	//waveform.$player[0].play();
			// 	//waveform.setListeners();
			// });
			//console.log(wfd);

		},

		setListeners : function() {
			$('#freq').on('change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				oscillator.freq = $targ.val();
				oscillator.instance.frequency.value = oscillator.freq;
				$('#freqDisplay').text(oscillator.freq);
			});
			$('#wType').on('change', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				oscillator.wType = $targ.val();
				oscillator.instance.type = oscillator.wType;
			});
			$('#playPause').on('click', function(e) {
				//console.log('Playing',e);
				var $targ = $(e.currentTarget);
				if(!$targ.hasClass('playing')) {
					$targ.addClass('playing');
					audioContext.osc.start();
				} else {
					audioContext.osc.stop();
				}
			});
		},
	};

	return oscillator;

});


