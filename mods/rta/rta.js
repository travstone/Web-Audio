
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var rta = {

		$player: $('#track-player'),

		cont : document.getElementById('ac'),
		gCont : document.getElementById('gc'),

		context : audioContext, //new (window.AudioContext || window.webkitAudioContext)(),
		source : null,
		grAnalyser : null,
		grBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,

		doBgd : false,
		bargraphId : null,

		init : function() {
			rta.grAnalyser = rta.context.createAnalyser();
			rta.grAnalyser.fftSize = 512;//128;// 256;
			rta.grAnalyser.minDecibels = -95;
			console.log(audioContext.source);
			rta.source = rta.context.createMediaElementSource(rta.$player[0]);
			rta.reset();
			rta.setListeners();
			rta.grBufferLength = rta.grAnalyser.frequencyBinCount;
			//FloatTimeDomainArray = new Float32Array(wfBufferLength);
			rta.ByteFrequencyArray = new Uint8Array(rta.grBufferLength);
			rta.source.connect(rta.grAnalyser);
			rta.grAnalyser.connect(rta.context.destination);
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
			 	//rta.$player[0].play();
			// 	//rta.setListeners();
			// });
			//console.log(wfd);

		},

		setListeners : function() {
			$('#track-player').on('playing', function(e) {
				//console.log('Playing',e);
				rta.doBgd = true;
				rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
			});

			$('#track-player').on('pause', function(e) {
				//console.log('Paused',e);
				rta.doBgd = false;
				// rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
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

		},

		test : 1000,
		count : 0,

		drawBarGraph : function() {
			//console.log('b');
			if (rta.doBgd) {
				while (rta.gCont.firstChild) {
					//The list is LIVE so it will re-index each call
					rta.gCont.removeChild(rta.gCont.firstChild);
				}
				var x = 0,
					d = '',
					i = 0,
					sliceWidth = 8 * 1.0 / rta.grBufferLength,
					v,
					y;

				var barWidth = (1024 / rta.grBufferLength);// * 2.5;
				var barHeight;
				//if (rta.count < rta.test) {
					//rta.count++;
					//console.log(rta.grBufferLength, barWidth);
				//};
				rta.grAnalyser.getByteFrequencyData(rta.ByteFrequencyArray);
				for(i; i < rta.grBufferLength; i++) {
					barHeight = rta.ByteFrequencyArray[i];///2;
					// if (rta.count < rta.test) {
					// 	rta.count++;
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
					rta.gCont.appendChild(bar);
					x += barWidth;
				}
				rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
			}
		}

	};

	return rta;

});


