// Waveform Display 

function createAudioContext() {
	if (!window.audioContextInstance) {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if (window.AudioContext) {
			window.audioContextInstance = new AudioContext();
		} else {
			alert('Web Audio API is not supported in this browser');
		}
	}
	return window.audioContextInstance;
}

function getPeaks(bufferData) {

	var bufferLength = bufferData.length,
		maxVal = 0,
		minVal = 0,
		plotSize = 12000,
		batchSize = Math.ceil( bufferLength / plotSize ),
		inc = 0,
		peaks = [],
		curVal,
		sign,
		isPos,
		posCount = 0,
		negCount = 0,
		setValue;

	for (inc; bufferLength >= inc; inc++) {
		// curVal is the current peaks array element
		curVal = bufferData[inc];
		sign = Math.sign(curVal);

		// first determine if we're dealing with a positive or negative number
		// then, compare it to the currently stored value for whichever it is
		// and replace the stored value if current value is greater
		if(sign === 1) {
			isPos = true;
			posCount++;
			if( curVal > maxVal ) {
				maxVal = curVal;
			}
		}
		else if(sign === -1) {
			isPos = false;
			negCount++;
			if( curVal < minVal ) {
				minVal = curVal;
			}
		}

		// everytime we have processed [batchSize] peaks, store a value in output
		if(inc % batchSize === 0 ) {
			// find whichever value is greater (positive or negative) - hence use Math.abs
			if ( Math.abs(minVal) > Math.abs(maxVal) ) {
				setValue = minVal;
			}
			else if( Math.abs(minVal) < Math.abs(maxVal) ) {
				setValue = maxVal;
			} else {
				// if it's a tie, break tie by evaluating number of Positive compared to number of negative
				if(posCount > negCount) {
					setValue = maxVal;
				} else {
					setValue = minVal;
				}
			}

			// by now we should have a single value for this batch
			peaks.push(setValue);

			// reset for next batch
			maxVal = 0;
			minVal = 0;
			posCount = 0;
			negCount = 0;
		}

	}

	return peaks;
}


function drawWaveformSVG(peaks,smooth) {
	
	var peaksLength = peaks.length,
		strokeWidth = 5, // smooth ? 0.75 : 5;
		path = document.getElementById('waveform-path'),
		d = '';

	for(peakNumber = 0; peakNumber < peaksLength; peakNumber++) {
		if (peakNumber%2 === 0) {
			d += ' M'+ ~~(peakNumber/2) + ', ' + peaks.shift();
		} else {
			d += ' L'+ ~~(peakNumber/2) + ', ' + peaks.shift();
		}
	}
	path.setAttribute('stroke-width', strokeWidth);
	path.setAttribute('d', d);
}


function waveform(bufferData) {
	var myPeaks = getPeaks(bufferData.getChannelData(0));
	//console.log(myPeaks);
	//console.log(bufferData.getChannelData(1));
	drawWaveformSVG(myPeaks, false);
	//drawWaveformRaphael(myPeaks, false);
}


