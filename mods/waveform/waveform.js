
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var waveform = {

		$player: $('#track-player'),

		cont : document.getElementById('ac'),
		waveformPath : document.getElementById('waveform-path'),

		context : audioContext, //new (window.AudioContext || window.webkitAudioContext)(),
		//source : null,
		wfAnalyser : null,
		grAnalyser : null,
		wfBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,

		doWfd : false,
		waveformId : null,

		init : function(useEl) {
			waveform.wfAnalyser = waveform.context.createAnalyser();
			waveform.wfAnalyser.fftSize = 2048;
			waveform.wfAnalyser.smoothingTimeConstant = 0.9;
			console.log(waveform.context);
			waveform.reset();
			waveform.setListeners();
			waveform.wfBufferLength = waveform.wfAnalyser.frequencyBinCount;
			waveform.ByteTimeDomainArray = new Uint8Array(waveform.wfBufferLength);
			//FloatTimeDomainArray = new Float32Array(wfBufferLength);

			if (useEl) {
				if (!waveform.context.source) {
					console.log('Define the source!');
					waveform.context.source = waveform.context.createMediaElementSource(waveform.$player[0]);
				}
				waveform.context.source.connect(waveform.wfAnalyser);
				//waveform.wfAnalyser.connect(waveform.context.destination);
				if (!waveform.context.outputConnected) {
					waveform.wfAnalyser.connect(waveform.context.destination);
					waveform.context.outputConnected = true;
				};
			} else {
				audioContext.osc.connect(waveform.wfAnalyser);

				waveform.wfAnalyser.getByteTimeDomainData(waveform.ByteTimeDomainArray);
				waveform.doWfd = true;
				waveform.waveformId = requestAnimationFrame( waveform.drawWaveform );
			}

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
			$('#track-player').on('playing', function(e) {
				//console.log('Playing',e);
				waveform.doWfd = true;
				waveform.waveformId = requestAnimationFrame( waveform.drawWaveform );
			});

			$('#track-player').on('pause', function(e) {
				//console.log('Paused',e);
				waveform.doWfd = false;
				// waveform.waveformId = requestAnimationFrame( waveform.drawWaveform );
			});

			$('#track-player').on('loadstart', function(e) {
				//console.log('loadstart',e);
				$('#track-player').hide();
				$('#loading-indicator').show();
			});

			$('#track-player').on('canplay', function(e) {
				//console.log('canplay',e);
				$('#loading-indicator').hide();
				$('#track-player').show();
			});

			$('#stroke').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
				$('#waveform-path').attr('stroke-width', value);
			});

			$('#brightness').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
				$('#waveform-path').attr('stroke', 'rgba(133, 255, 235,' + value + ')');
			});


			$('#fftSizeWave').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
					waveform.wfAnalyser.fftSize = value;
					waveform.wfBufferLength = waveform.wfAnalyser.frequencyBinCount;
					waveform.ByteTimeDomainArray = new Uint8Array(waveform.wfBufferLength);
				//$('#waveform-path').attr('stroke', 'rgba(133, 255, 235,' + value + ')');
			});

			$('#smoothingWave').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
					waveform.wfAnalyser.smoothingTimeConstant = value;
					waveform.wfBufferLength = waveform.wfAnalyser.frequencyBinCount;
					waveform.ByteTimeDomainArray = new Uint8Array(waveform.wfBufferLength);
				$('#smoothingWaveVal').text(waveform.wfAnalyser.smoothingTimeConstant);
			});


		},

		drawWaveform : function() {
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
				waveform.waveformPath.setAttribute('d', d);
				waveform.waveformId = requestAnimationFrame(waveform.drawWaveform);
			}
		}

	};

	return waveform;

});


