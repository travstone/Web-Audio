// Main.js
// requires waveform.js

$('document').ready(function() {
	//console.log('ready... ');
	var wfAudioContext = createAudioContext(),
		bufferData,
		plotSize = 12000,
		$player = $('#player'),
		xhr = new XMLHttpRequest(),
		file = '../jamazon/uploads/steve_miller_jungle_mastered.mp3';


	// var ac = document.getElementById('ac1');

	// var audio = new Audio();
	// audio.src = 'uploads/Track13.mp3';
	// audio.controls = true;
	// //audio.autoplay = true;
	// ac.appendChild(audio);

	//var analyser = wfAudioContext.createAnalyser();

	//var source = wfAudioContext.createMediaElementSource($player.get(0));
	//console.log(source);
//

// window.addEventListener('load', function(e) {
//   // Our <audio> element will be the audio source.
//   // console.log(e);
//   // var source = wfAudioContext.createMediaElementSource(audio);
//   // // source.connect(analyser);
//   // // analyser.connect(wfAudioContext.destination);
//   // source.connect(wfAudioContext.destination);
// 	wfAudioContext.decodeAudioData(this.response,function(e) {
// 		waveform(bufferData);
// 	});

// }, false);


	xhr.open('GET', file, true);
	xhr.responseType = 'arraybuffer';
	 
	xhr.onload = function(e) {

		  // /var source = wfAudioContext.createMediaElementSource(audio);
		  // source.connect(analyser);
		  // analyser.connect(wfAudioContext.destination);
		  // audio.src = 'uploads/Track13.mp3';
		  // source.connect(wfAudioContext.destination);

		$('#player').attr('src', file);
		wfAudioContext.decodeAudioData(this.response,function(bufferData) {
			waveform(bufferData);
		});
	};
	 
	xhr.send();

	function moveTheNeedle(e) {
		//console.log('Time: ', e.currentTarget.currentTime);
		var time =  e.currentTarget.currentTime,
			duration = $player.data().time,
			pct = (duration / 100);
			currentPct = ( time / pct );
		//console.log(duration, time , pct, currentPct);

		var svgWidth = plotSize / 2,
			svgPct = svgWidth / 100;

			var newLocation = svgPct * currentPct;
			//console.log(newLocation);
			$('#playHead').attr('d', 'M'+newLocation+', -1 L'+newLocation+', 1' );
	}

	$player.on('loadedmetadata', function(e) {
		//console.log('Event: ', e);
		$player.attr('data-time',e.currentTarget.duration);
	});

	$player.on('playing', function(e) {
		//console.log('Event: ', e);
		//moveTheNeedle(e);
	});
	$player.on('progress', function(e) {
		//console.log('Event: ', e);
		//console.log($player.data());
		//moveTheNeedle(e);
	});
	$player.on('timeupdate', function(e) {
		moveTheNeedle(e);
	});



});

