// oscillator

var context = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
console.log(context);



// Create an <audio> element dynamically.
//var audio = new Audio();
// audio.src = '../jamazon/uploads/on_the_moon.mp3';
//audio.controls = true;
// audio.autoplay = true;
//document.body.appendChild(audio);

var cont = document.getElementById('ac'),
	waveformPath = document.getElementById('waveform-path2'),
	gCont = document.getElementById('gc'),
	graphPath = document.getElementById('graph-path'),
	//context = new AudioContext(),
	wfAnalyser = context.createAnalyser(),
	grAnalyser = context.createAnalyser();//,
	//source = context.createMediaElementSource(audio);

var oscillator = context.createOscillator();
var gainNode = context.createGain();


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
	oscillator.connect(wfAnalyser);
	wfAnalyser.connect(grAnalyser);
	//oscillator.connect(grAnalyser);
	grAnalyser.connect(gainNode);

	//oscillator.connect(gainNode);
	gainNode.connect(context.destination);

	gainNode.gain.value = 0.4;
	//console.log(gainNode);

	oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
	oscillator.frequency.value = 200; //99; // value in hertz
	//oscillator.start();

	drawWaveform();
	drawBarGraph();
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
		    //console.log(grBufferLength);
		}
		var drawVisual = requestAnimationFrame(drawBarGraph);

		var x = 0,
			d = '',
			i = 0,
			sliceWidth = 8 * 1.0 / grBufferLength,
			v,
			y;

		var barWidth = (512 / grBufferLength);// * 2.5;
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
			x += barWidth;// + 1;
		}
		//countG++;

	};
}

$('#vol').val(0.4);
$('#freq').val(99);
$('#vol-lvl').text(0.4);
$('#freq-hz').text(99);
$('#vol').on('change', function(e) {
	var $targ = $(e.currentTarget),
		val = $targ.val();

	console.log(val);
	gainNode.gain.value = val;
$('#vol-lvl').text(val);

});


$('#freq').on('change', function(e) {
	var $targ = $(e.currentTarget),
		val = $targ.val();

	console.log(val);
	oscillator.frequency.value = val;
$('#freq-hz').text(val);

});

var playing = false;

$('#playToggle').on('click', function(e) {
	var $targ = $(e.currentTarget);
	playing = !playing;
	if (playing) {
		$targ.text('Stop');
		oscillator.start();
	} else {
		$targ.text('Start');
		oscillator.stop();
	}

});

$('#shape').on('change', function(e) {
	var $targ = $(e.currentTarget),
		val = $targ.val();

	console.log(val);
	oscillator.type = val;
//$('#freq-hz').text(val);

});