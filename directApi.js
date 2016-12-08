// Create an <audio> element dynamically.
// var audio = new Audio();
// audio.src = 'audio/TRACK02-1-AR.mp3';
// audio.controls = true;
// //audio.autoplay = true;
// document.body.appendChild(audio);




var WaveformDisplay = function() {
	"use strict";
	var wfd = {

		audioFile : '',
		audioData : null,
		pausePoint : 0,

		cont : document.getElementById('ac'),
		waveformPath : document.getElementById('waveform-path2'),
		gCont : document.getElementById('gc'),
		graphPath : document.getElementById('graph-path'),


		context : new (window.AudioContext || window.webkitAudioContext)(),
		source : null,
		wfAnalyser : null,
		grAnalyser : null,

		bufferLength : null,
		grBufferLength : null,
		ByteTimeDomainArray : null,
		//FloatTimeDomainArray : null,
		ByteFrequencyArray : null,

		waveformId : null,

		init : function() {

			//wfd.source = wfd.context.createBufferSource();
			wfd.wfAnalyser = wfd.context.createAnalyser();
			wfd.grAnalyser = wfd.context.createAnalyser();

			wfd.wfAnalyser.fftSize = 2048;
			wfd.wfAnalyser.smoothingTimeConstant = 0.2;
			wfd.grAnalyser.fftSize = 256;
			wfd.grAnalyser.minDecibels = -70;
			wfd.getAudio();

			$('#stroke').on('change', function(e) {
				var $targ = $(e.currentTarget),
					value = $targ.val();
				$('#waveform-path2').attr('stroke-width', value);
			});

			$('#btn-play').off().on('click', function(e) {
				var $targ = $(e.currentTarget);
				console.log('Click');
				if ($targ.hasClass('play')) {
					wfd.source.stop();
					wfd.pausePoint = wfd.context.currentTime;
					wfd.source = null;
					//wfd.updateCurrentTime(true);
					$targ.removeClass('play').addClass('pause');
				} else {
					$targ.removeClass('pause').addClass('play');
					wfd.decodeAudio();
				}
			});

			

		},

		updateCurrentTime : function(pause) {
			//if (pause) {
				//$('#curTime').val(wfd.pausePoint);
			//} else {
				if (wfd.context) {
					var ct = Math.round(wfd.context.currentTime);
					$('#curTime').val(ct);
				};
				var updater = wfd.updateCurrentTime;
				requestAnimationFrame(updater);
			//}
		},

		getAudio : function() {

			var request = new XMLHttpRequest();
			// Set the audio file src here
			//request.open('GET', 'audio/TRACK02-1-AR.mp3', true);
			//request.open('GET', 'audio/funky_squirrel_cd.wav', true);
			request.open('GET', 'audio/mellow_section_cd.wav', true);
			// Setting the responseType to arraybuffer sets up the audio decoding
			request.responseType = 'arraybuffer';
			request.onload = function() {
				console.log('loaded... ',wfd.context ); //
				// Decode the audio once the require is complete
				wfd.audioData = request.response;
				// Enable play button
				$('#btn-play').removeAttr('disabled');
			};
			// Send the request which kicks off 
			request.send();
		},


		decodeAudio : function() {
			wfd.source = wfd.context.createBufferSource();
			wfd.context.decodeAudioData(wfd.audioData, function(buffer) {
				wfd.source.buffer = buffer;
				// Connect the audio to source (multiple audio buffers can be connected!)
				//source.connect(context.destination);

				console.log('buffer filled... ' ); //
				wfd.bufferLength = wfd.wfAnalyser.frequencyBinCount;
				//grBufferLength = grAnalyser.frequencyBinCount;
				wfd.ByteTimeDomainArray = new Uint8Array(wfd.bufferLength);
				//FloatTimeDomainArray = new Float32Array(bufferLength);
				wfd.ByteFrequencyArray = new Uint8Array(wfd.bufferLength);

				wfd.source.connect(wfd.wfAnalyser);
				wfd.wfAnalyser.connect(wfd.context.destination);

				var updater = wfd.updateCurrentTime;
				requestAnimationFrame(updater);
				wfd.startDrawing();
				wfd.source.start(0, wfd.pausePoint);

			}, function(e) {
				console.log('Audio error! ', e);
				$('#errors').text(e.toString());
			});


		},

		startDrawing : function() {
			console.log(wfd);
			wfd.waveformId = requestAnimationFrame( wfd.drawWaveform );
		},

		drawWaveform : function() {
			var x = 0,
				d = '',
				i = 0,
				sliceWidth = 1024 * 1.0 / wfd.bufferLength,
				v,
				y;
				//console.log(wfd);
			wfd.wfAnalyser.getByteTimeDomainData(wfd.ByteTimeDomainArray);

			for(i; i < wfd.bufferLength; i++) {
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
		}



	};

	return wfd;

};

var myWave = new WaveformDisplay();
myWave.init();


// var cont = document.getElementById('ac'),
// 	waveformPath = document.getElementById('waveform-path2'),
// 	gCont = document.getElementById('gc'),
// 	graphPath = document.getElementById('graph-path'),
// 	context = new (window.AudioContext || window.webkitAudioContext)(),
// 	wfAnalyser = context.createAnalyser(),
// 	grAnalyser = context.createAnalyser();//,

 //  	context.onstatechange = function() {
	//   console.log('First: ', context.state);
	// }

// Create a buffer for the incoming sound content
//var source = context.createBufferSource();
// Create the XHR which will grab the audio contents


	//var waveformId;


function doThatThang() {
	//console.log('GO!!!!!', source);
	//source = context.createMediaElementSource(audio);

	// wfAnalyser.fftSize = 2048;
	// wfAnalyser.smoothingTimeConstant = 0.8;
	// grAnalyser.fftSize = 256;
	// grAnalyser.minDecibels = -70;

	// var bufferLength = wfAnalyser.frequencyBinCount,
	// 	grBufferLength = grAnalyser.frequencyBinCount,
	// 	ByteTimeDomainArray = new Uint8Array(bufferLength),
	// 	//FloatTimeDomainArray = new Float32Array(bufferLength),
	// 	ByteFrequencyArray = new Uint8Array(bufferLength);


	// // Wait for window.onload to fire. See crbug.com/112368
	// //window.addEventListener('load', function(e) {
	// 	source.connect(wfAnalyser);
	// 	wfAnalyser.connect(context.destination);
		//wfAnalyser.connect(grAnalyser);
		//source.connect(grAnalyser);
		//grAnalyser.connect(context.destination);
	//}, false);


		// wfAnalyser.getFloatTimeDomainData(FloatTimeDomainArray);
		// console.log(FloatTimeDomainArray);



	// function requestPaint() {
	// 	var x = 0,
	// 	d = '',
	// 	i = 0,
	// 	sliceWidth = 800 * 1.0 / bufferLength,
	// 	v,
	// 	y;

	// 	wfAnalyser.getByteTimeDomainData(ByteTimeDomainArray);

	// 	for(i; i < bufferLength; i++) {
	// 		v = ByteTimeDomainArray[i] / 128.0;
	// 		y = v * 256/2;
	// 		if(i === 0) {
	// 			d += 'M' + x + ', ' + y;
	// 		} else {
	// 			d += 'L' + x + ', ' + y;
	// 		}
	// 		x += sliceWidth;
	// 	}
	// 	waveformPath.setAttribute('d', d);
	// }


	// var countG = 0;
	// function drawBarGraph() {
	// 	if (countG < 100) {
	// 		while (gCont.firstChild) {
	// 		    //The list is LIVE so it will re-index each call
	// 		    gCont.removeChild(gCont.firstChild);
	// 		}
	// 		var drawVisual = requestAnimationFrame(drawBarGraph);

	// 		var x = 0,
	// 			d = '',
	// 			i = 0,
	// 			sliceWidth = 8 * 1.0 / grBufferLength,
	// 			v,
	// 			y;

	// 		var barWidth = (670 / grBufferLength);// * 2.5;
	// 		var barHeight;


	// 		//wfAnalyser.getByteTimeDomainData(ByteTimeDomainArray);
	// 		grAnalyser.getByteFrequencyData(ByteFrequencyArray);
	// 		//console.log(ByteFrequencyArray);


	// 		for(i; i < grBufferLength; i++) {
	// 			barHeight = ByteFrequencyArray[i];///2;
	// 			var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	// 			//canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
	// 			//canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
	// 			//d += '';
	// 			bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
	// 			bar.setAttribute('y', 256-barHeight );
	// 			bar.setAttribute('width',barWidth);
	// 			bar.setAttribute('height',barHeight);
	// 			bar.setAttribute('fill','rgba(255,255,0,0.5)');
	// 			//graphPath.setAttribute('d',d);
	// 			gCont.appendChild(bar);
	// 			x += barWidth + 1;
	// 		}
	// 		//countG++;

	// 	};
	// }


	// context.onstatechange = function() {
	//   console.log(context.state);
	// }

	// $('audio').on('playing', function(e) {
	// 	console.log('Playing');
	// 	//drawWaveform();
	// 	// drawBarGraph();
	// 	//var test = drawBarGraph();
	// 	waveformId = requestAnimationFrame(drawWaveform);
	// });

	// $('audio').on('pause', function(e) {
	// 	console.log('Stopped');
	// 	//drawWaveform();
	// 	// drawBarGraph();
	// 	//var test = drawBarGraph();
	// 	//requestAnimationFrame(drawWaveform);
	// 	cancelAnimationFrame(waveformId);
	// });


}


	//var count = 0;
	// function drawWaveform() {
	// 	console.log('Do paint..');
	// 	//requestAnimationFrame(requestPaint);
	// 	// if (count < 100) {
	// 	// 	var drawVisual = requestAnimationFrame(drawWaveform);
	// 	// }

	// 	var x = 0,
	// 		d = '',
	// 		i = 0,
	// 		sliceWidth = 800 * 1.0 / bufferLength,
	// 		v,
	// 		y;

	// 	wfAnalyser.getByteTimeDomainData(ByteTimeDomainArray);

	// 	for(i; i < bufferLength; i++) {
	// 		v = ByteTimeDomainArray[i] / 128.0;
	// 		y = v * 256/2;
	// 		if(i === 0) {
	// 			d += 'M' + x + ', ' + y;
	// 		} else {
	// 			d += 'L' + x + ', ' + y;
	// 		}
	// 		x += sliceWidth;
	// 	}
	// 	waveformPath.setAttribute('d', d);
	// 	//count++;
	// 	waveformId = requestAnimationFrame(drawWaveform);
	// }




// $('#btn-play').on('click', function(e) {
// 	console.log('Click');
// 	//if (source.context.state === 'running') {
// 		//source.stop();
// 	//} else {
// 		//doThatThang(source);
// 		waveformId = requestAnimationFrame(drawWaveform);
// 		source.start(0);
// 	//}
// })
