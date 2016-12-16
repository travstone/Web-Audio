
var WaveformDisplay = (function() {
	"use strict";
	var wfd = {

		cont : document.getElementById('ac'),
		waveformPath : document.getElementById('waveform-path'),
		gCont : document.getElementById('gc'),

		context : new (window.AudioContext || window.webkitAudioContext)(),
		source : null,
		wfAnalyser : null,
		grAnalyser : null,
		wfBufferLength : null,
		grBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,

		doWfd : false,
		doBgd : false,
		waveformId : null,
		bargraphId : null,

		init : function() {
			$('#loading-indicator').hide();
			wfd.wfAnalyser = wfd.context.createAnalyser();
			wfd.grAnalyser = wfd.context.createAnalyser();

			wfd.wfAnalyser.fftSize = 2048;
			wfd.wfAnalyser.smoothingTimeConstant = 0.9;
			wfd.grAnalyser.fftSize = 128;// 256;
			wfd.grAnalyser.minDecibels = -95;

			$('#track-select').off().on('change', function(e) {
				var $cont = $('.audio-controls'),
					$targ = $(e.currentTarget),
					val = $targ.val(),
					d = $('[value="'+val+'"]').data(),
					$player = $('#track-player');
				//console.log('Track: ' , $targ,  $targ.val(), d);
				$player.html('');
				$player.append('<source src="audio/'+val+'" type="'+d.mtype+'">');
				$player[0].load();
				$player[0].play();
				//wfd.setListeners();
			});

			wfd.setListeners();

			var myAudio = document.querySelector('audio');
			//console.log(myAudio);
			wfd.source = wfd.context.createMediaElementSource(myAudio);
			wfd.wfBufferLength = wfd.wfAnalyser.frequencyBinCount;
			wfd.grBufferLength = wfd.grAnalyser.frequencyBinCount;
			wfd.ByteTimeDomainArray = new Uint8Array(wfd.wfBufferLength);
			//FloatTimeDomainArray = new Float32Array(wfBufferLength);
			wfd.ByteFrequencyArray = new Uint8Array(wfd.grBufferLength);
			wfd.source.connect(wfd.wfAnalyser);
			wfd.source.connect(wfd.grAnalyser);
			wfd.wfAnalyser.connect(wfd.context.destination);
			//console.log(wfd);

		},

		setListeners : function() {
			$('#track-player').on('playing', function(e) {
				//console.log('Playing',e);
				wfd.doWfd = true;
				wfd.doBgd = true;
				wfd.waveformId = requestAnimationFrame( wfd.drawWaveform );
				wfd.bargraphId = requestAnimationFrame( wfd.drawBarGraph );
			});

			$('#track-player').on('pause', function(e) {
				//console.log('Paused',e);
				wfd.doWfd = false;
				wfd.doBgd = false;
				// wfd.waveformId = requestAnimationFrame( wfd.drawWaveform );
				// wfd.bargraphId = requestAnimationFrame( wfd.drawBarGraph );
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

		},

		drawWaveform : function() {
			//console.log('w');
			if (wfd.doWfd) {
				var x = 0,
					d = '',
					i = 0,
					sliceWidth = 1024 * 1.0 / wfd.wfBufferLength,
					v,
					y;

				wfd.wfAnalyser.getByteTimeDomainData(wfd.ByteTimeDomainArray);
				for(i; i < wfd.wfBufferLength; i++) {
					v = wfd.ByteTimeDomainArray[i] / 128.0;
					y = v * 256/2;
					if(i === 0) {
						d += 'M' + x + ', ' + y;
					} else {
						d += 'L' + x + ', ' + y;
					}
					x += sliceWidth;
				}
				wfd.waveformPath.setAttribute('d', d);
				wfd.waveformId = requestAnimationFrame(wfd.drawWaveform);
			};
		},

		test : 1000,
		count : 0,

		drawBarGraph : function() {
			//console.log('b');
			if (wfd.doBgd) {
				while (wfd.gCont.firstChild) {
				    //The list is LIVE so it will re-index each call
				    wfd.gCont.removeChild(wfd.gCont.firstChild);
				}
				var x = 0,
					d = '',
					i = 0,
					sliceWidth = 8 * 1.0 / wfd.grBufferLength,
					v,
					y;

				var barWidth = (1024 / wfd.grBufferLength);// * 2.5;
				var barHeight;
				//if (wfd.count < wfd.test) {
					//wfd.count++;
					//console.log(wfd.grBufferLength, barWidth);
				//};
				wfd.grAnalyser.getByteFrequencyData(wfd.ByteFrequencyArray);
				for(i; i < wfd.grBufferLength; i++) {
					barHeight = wfd.ByteFrequencyArray[i];///2;
					// if (wfd.count < wfd.test) {
					// 	wfd.count++;
					// 	console.log('B: ', barHeight, 256-parseInt(barHeight,10));
					// };
					var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
					bar.setAttribute('y', 256-barHeight );
					bar.setAttribute('width',barWidth);
					bar.setAttribute('height',barHeight);
					//bar.setAttribute('fill','rgba(255,255,0,0.5)');
					bar.setAttribute('fill','hsl('+barHeight+', 100%, 50%);');
					var ha = 256-parseInt(barHeight,10);
					bar.setAttribute('style','fill: hsl('+ha+', 100%, 50%);');
					wfd.gCont.appendChild(bar);
					x += barWidth;
				}
				wfd.bargraphId = requestAnimationFrame( wfd.drawBarGraph );
			};
		}

	};

	wfd.init();
	return wfd;

}());

