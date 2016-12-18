
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var rta = {

		$player: $('#track-player'),

		cont : document.getElementById('ac'),
		gCont : document.getElementById('gc'),

		context : audioContext, //new (window.AudioContext || window.webkitAudioContext)(),
		//source : null,
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
			//$(rta.gCont).removeAttr('viewbox').attr('viewbox', '0 0 1024 ' + rta.heightFactor);
			rta.grAnalyser = rta.context.createAnalyser();
			rta.grAnalyser.fftSize = 256;//128;// 256;
			rta.grAnalyser.maxDecibels = -15;
			rta.grAnalyser.minDecibels = -80;
			console.log(rta.grAnalyser.minDecibels);
			//console.log(audioContext.source);
			// if (!rta.context.source) {
			// 	console.log('Define the source!');
			// 	rta.context.source = rta.context.createMediaElementSource(rta.$player[0]);
			// };
			//rta.source = rta.context.createMediaElementSource(rta.$player[0]);
			rta.reset();
			rta.setListeners();
			rta.grBufferLength = rta.grAnalyser.frequencyBinCount;
			//FloatTimeDomainArray = new Float32Array(wfBufferLength);
			rta.ByteFrequencyArray = new Uint8Array(rta.grBufferLength);
			rta.FloatFrequencyArray = new Float32Array(rta.grBufferLength);
			//rta.context.source.connect(rta.grAnalyser);
			//rta.grAnalyser.connect(rta.context.destination);

			if (useEl) {
				if (!rta.context.source) {
					console.log('Define the source!');
					rta.context.source = rta.context.createMediaElementSource(rta.$player[0]);
				}
				rta.context.source.connect(rta.grAnalyser);
				if (!rta.context.outputConnected) {
					rta.grAnalyser.connect(rta.context.destination);
					rta.context.outputConnected = true;
				};
			} else {
				audioContext.osc.connect(rta.grAnalyser);

				rta.grAnalyser.getByteFrequencyData(rta.ByteFrequencyArray);
				rta.grAnalyser.getFloatFrequencyData(rta.FloatFrequencyArray);
				rta.doBgd = true;
				rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
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

			$('#maxDb').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				rta.grAnalyser.maxDecibels = val;
				$('#maxDbVal').text(val);
			});

			$('#minDb').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				rta.grAnalyser.minDecibels = val;
				$('#minDbVal').text(val);
			});

			$('#fftSize').on('change', function(e) {
				//console.log('canplay',e);
				var $targ = $(e.currentTarget),
					val = $targ.val();
				rta.grAnalyser.fftSize = val;
				rta.grBufferLength = rta.grAnalyser.frequencyBinCount;
				rta.ByteFrequencyArray = new Uint8Array(rta.grBufferLength);
				//console.log(rta.grBufferLength);
			});

		},

		test : 5000,
		count : 0,

		fHi: -100,
		fLo: -100,

		drawBarGraph : function() {
			//console.log('b');
			if (rta.doBgd) {
				$(rta.gCont).children().not('#neg30, #neg60').remove();
				// while (rta.gCont.firstChild) {
				// 	//The list is LIVE so it will re-index each call
				// 	rta.gCont.removeChild(rta.gCont.firstChild);
				// }
				var x = 0,
					d = '',
					i = 0,
					sliceWidth = 8 * 1.0 / rta.grBufferLength,
					v,
					y;

				var barWidth = (1024 / rta.grBufferLength);// * 2.5;
				var barHeight,
					heightFactor = 256;

				rta.grAnalyser.getByteFrequencyData(rta.ByteFrequencyArray);
				for(i; i < rta.grBufferLength; i++) {
					barHeight = rta.ByteFrequencyArray[i];///2;
					// if (rta.count < rta.test) {
					// 	rta.count++;
					// 	console.log('B: ', barHeight, 256-parseInt(barHeight,10));
					// };
					//if (!barHeight) {console.log('Error: ', rta.ByteFrequencyArray[i]);};
					var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
					bar.setAttribute('y', heightFactor-barHeight );
					bar.setAttribute('width',barWidth);
					bar.setAttribute('height',barHeight);
					//bar.setAttribute('fill','rgba(255,255,0,0.5)');
					//bar.setAttribute('fill','hsl('+barHeight+', 100%, 50%);');
					var ha = heightFactor-barHeight;
					bar.setAttribute('style','fill: hsl('+ha+', 100%, 50%);');
					rta.gCont.appendChild(bar);
					x += barWidth;
				}

				// rta.grAnalyser.getFloatFrequencyData(rta.FloatFrequencyArray);

				// if (rta.count < rta.test) {
				// 	rta.count++;
				// 	//console.log(rta.FloatFrequencyArray);
				// };



				// for(i; i < rta.grBufferLength; i++) {
				// 	if (rta.FloatFrequencyArray[i] > rta.fHi) {rta.fHi = rta.FloatFrequencyArray[i]; console.log('Hi:', rta.fHi, rta.fLo);};
				// 	if (rta.FloatFrequencyArray[i] < rta.fLo) {rta.fLo = rta.FloatFrequencyArray[i]; console.log('Lo:', rta.fLo, rta.fHi);};
				// 	barHeight = (rta.FloatFrequencyArray[i] > (-rta.heightFactor)) ? rta.FloatFrequencyArray[i] + rta.heightFactor : 0;///2;

				// if (rta.count < rta.test) {
				// 	rta.count++;
				// 	console.log(barHeight);
				// };
				// 	// if (rta.count < rta.test) {
				// 	// 	rta.count++;
				// 	// 	console.log('B: ', barHeight, 256-parseInt(barHeight,10));
				// 	// };
				// 	var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				// 	bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
				// 	bar.setAttribute('y', rta.heightFactor-barHeight );
				// 	bar.setAttribute('width',barWidth);
				// 	bar.setAttribute('height',barHeight);
				// 	//bar.setAttribute('fill','rgba(255,255,0,0.5)');
				// 	//bar.setAttribute('fill','hsl('+barHeight+', 100%, 50%);');
				// 	var ha = ( rta.heightFactor - parseInt(barHeight,10) ) * 2;
				// 	bar.setAttribute('style','fill: hsl('+ha+', 100%, 50%);');
				// 	rta.gCont.appendChild(bar);
				// 	x += barWidth;
				// }


				rta.bargraphId = requestAnimationFrame( rta.drawBarGraph );
			}
		}

	};

	return rta;

});


