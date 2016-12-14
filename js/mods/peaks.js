
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var peaks = {

		audioFile: 'audio/steve_miller_jungle_mastered.mp3',
		$player: null,
		currentPct: null,
		plotSize: 12000,

		getPeaks: function(bufferData) {

			var bufferLength = bufferData.length,
				maxVal = 0,
				minVal = 0,
				//plotSize = 12000,
				batchSize = Math.ceil( bufferLength / this.plotSize ),
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
		},



		drawWaveformSVG: function(peaks,smooth) {
			
			var peaksLength = peaks.length,
				strokeWidth = 0.75, //5, // smooth ? 0.75 : 5;
				path = document.getElementById('waveform-path'),
				d = '',
				peakNumber;

			for(peakNumber = 0; peakNumber < peaksLength; peakNumber++) {
				if (peakNumber%2 === 0) {
					d += ' M'+ ~~(peakNumber/2) + ', ' + peaks.shift();
				} else {
					d += ' L'+ ~~(peakNumber/2) + ', ' + peaks.shift();
				}
			}
			path.setAttribute('stroke-width', strokeWidth);
			path.setAttribute('d', d);
		},


		waveform: function(bufferData) {
			var self = this;
			var myPeaks = self.getPeaks(bufferData.getChannelData(0));
			//console.log(myPeaks);
			//console.log(bufferData.getChannelData(1));
			self.drawWaveformSVG(myPeaks, false);
			//drawWaveformRaphael(myPeaks, false);
		},


		moveTheNeedle: function(e) {
			var self = this;
			//console.log('Time: ', e.currentTarget.currentTime);
			var time =  e.currentTarget.currentTime,
				duration = this.$player.data().time,
				pct = (duration / 100);
				this.currentPct = ( time / pct );
			//console.log(duration, time , pct, currentPct);

			var svgWidth = this.plotSize / 2,
				svgPct = svgWidth / 100;

				var newLocation = svgPct * this.currentPct;
				//console.log(newLocation);
				$('#playHead').attr('d', 'M'+newLocation+', -1 L'+newLocation+', 1' );
		},

		initAudio: function() {

			var self = this;
				//var wfAudioContext = createAudioContext(),
			//var wfAudioContext = audioContext,
			var bufferData,
				//plotSize = 12000,
				xhr = new XMLHttpRequest(),
				file = this.audioFile;
			//this.plotSize = 12000;

			xhr.open('GET', file, true);
			xhr.responseType = 'arraybuffer';
			 
			xhr.onload = function(e) {

				$('#player').attr('src', file);
				audioContext.decodeAudioData(this.response,function(bufferData) {
					self.waveform(bufferData);
				});
			};
			 
			xhr.send();

		},

		init: function() {
			var self = this;
			this.initAudio();
			this.$player = $('#player');
			this.$player.on('loadedmetadata', function(e) {
				//console.log('Event: ', e);
				self.$player.attr('data-time',e.currentTarget.duration);
			});

			this.$player.on('playing', function(e) {
				//console.log('Event: ', e);
				//moveTheNeedle(e);
			});
			this.$player.on('progress', function(e) {
				//console.log('Event: ', e);
				//console.log($player.data());
				//moveTheNeedle(e);
			});
			this.$player.on('timeupdate', function(e) {
				self.moveTheNeedle(e);
			});


		}



	};

	return peaks;

});


