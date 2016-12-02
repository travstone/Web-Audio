// Create an <audio> element dynamically.
var audio = new Audio();
audio.src = '../jamazon/uploads/on_the_moon.mp3';
audio.controls = true;
//audio.autoplay = true;
document.body.appendChild(audio);

var cont = document.getElementById('ac'),
	waveformPath = document.getElementById('waveform-path2'),
	gCont = document.getElementById('gc'),
	graphPath = document.getElementById('graph-path'),
	context = new (window.AudioContext || window.webkitAudioContext)(),
	wfAnalyser = context.createAnalyser(),
	grAnalyser = context.createAnalyser(),
	source = context.createMediaElementSource(audio);

wfAnalyser.fftSize = 2048;
wfAnalyser.smoothingTimeConstant = 0.8;
grAnalyser.fftSize = 256;

var bufferLength = wfAnalyser.frequencyBinCount,
	grBufferLength = grAnalyser.frequencyBinCount,
	ByteTimeDomainArray = new Uint8Array(bufferLength),
	//FloatTimeDomainArray = new Float32Array(bufferLength),
	ByteFrequencyArray = new Uint8Array(bufferLength);


// Wait for window.onload to fire. See crbug.com/112368
window.addEventListener('load', function(e) {
	source.connect(wfAnalyser);
	wfAnalyser.connect(grAnalyser);
	//source.connect(grAnalyser);
	grAnalyser.connect(context.destination);
}, false);


	// wfAnalyser.getFloatTimeDomainData(FloatTimeDomainArray);
	// console.log(FloatTimeDomainArray);

var count = 0;
function drawWaveform() {
	if (count < 100) {
		var drawVisual = requestAnimationFrame(drawWaveform);
	}

	var x = 0,
		d = '',
		i = 0,
		sliceWidth = 800 * 1.0 / bufferLength,
		v,
		y;

	wfAnalyser.getByteTimeDomainData(ByteTimeDomainArray);

	for(i; i < bufferLength; i++) {
		v = ByteTimeDomainArray[i] / 128.0;
		y = v * 256/2;
		if(i === 0) {
			d += 'M' + x + ', ' + y;
		} else {
			d += 'L' + x + ', ' + y;
		}
		x += sliceWidth;
	}
	waveformPath.setAttribute('d', d);
	//count++;
}
var countG = 0;
function drawBarGraph() {
	if (countG < 100) {
		while (gCont.firstChild) {
		    //The list is LIVE so it will re-index each call
		    gCont.removeChild(gCont.firstChild);
		}
		var drawVisual = requestAnimationFrame(drawBarGraph);

		var x = 0,
			d = '',
			i = 0,
			sliceWidth = 8 * 1.0 / grBufferLength,
			v,
			y;

		var barWidth = (670 / grBufferLength);// * 2.5;
		var barHeight;


		//wfAnalyser.getByteTimeDomainData(ByteTimeDomainArray);
		grAnalyser.getByteFrequencyData(ByteFrequencyArray);
		//console.log(ByteFrequencyArray);


		for(i; i < grBufferLength; i++) {
			barHeight = ByteFrequencyArray[i];///2;
			var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			//canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
			//canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
			//d += '';
			bar.setAttribute('x',x); // x="10" y="10" width="100" height="100"
			bar.setAttribute('y', 256-barHeight );
			bar.setAttribute('width',barWidth);
			bar.setAttribute('height',barHeight);
			bar.setAttribute('fill','rgba(255,255,0,0.5)');
			//graphPath.setAttribute('d',d);
			gCont.appendChild(bar);
			x += barWidth + 1;
		}
		//countG++;

	};
}


$('audio').on('playing', function(e) {
	console.log('Playing');
	drawWaveform();
	drawBarGraph();
});


