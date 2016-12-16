
define(['jquery', 'audioContext'], function( $, audioContext ) {

	"use strict";

	var peaks = {

		audioFile: null,

		$container: null,
		$player: null,
		graphMarkup: null,
		currentPct: null,
		plotSize: 12000,
		peaks: {'left': [], 'right': []},
		analyser: null,

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
			//console.log(bufferLength, bufferData, batchSize);
			for (inc; bufferLength >= inc; inc++) {

					//var abufferLength = this.analyser.frequencyBinCount;
					//var adataArray = new Uint8Array(abufferLength);
					//this.analyser.getByteTimeDomainData(adataArray);

					//console.log(adataArray, adataArray.length);

				// curVal is the current peaks array element
				curVal = bufferData[inc];
				sign = Math.sign(curVal);

				// first determine if we're dealing with a positive or negative number
				// then, compare it to the currently stored value for whichever it is
				// and replace the stored value if current value is greater
				// if(sign === 1) {
				// 	isPos = true;
				// 	posCount++;
				// 	if( curVal > maxVal ) {
				// 		maxVal = curVal;
				// 	}
				// }
				// else if(sign === -1) {
				// 	isPos = false;
				// 	negCount++;
				// 	if( curVal < minVal ) {
				// 		minVal = curVal;
				// 	}
				// }

				if(curVal > maxVal) {
					maxVal = curVal
				}

				// everytime we have processed [batchSize] peaks, store a value in output
				if(inc % batchSize === 0 ) {
					//console.log('store batch...');
					// find whichever value is greater (positive or negative) - hence use Math.abs
					if ( Math.abs(minVal) > Math.abs(maxVal) ) {
						setValue = minVal;
					}
					else if( Math.abs(minVal) < Math.abs(maxVal) ) {
						setValue = maxVal;
					} else {
						// if it's a tie, break tie by evaluating number of Positive compared to number of negative
						//if(posCount > negCount) {
							setValue = maxVal;
						//} else {
							//setValue = minVal;
						//}
					}

					// by now we should have a single value for this batch
					peaks.push( this.round(setValue, 4) );

					// reset for next batch
					maxVal = 0;
					minVal = 0;
					posCount = 0;
					negCount = 0;
				}

			}

			return peaks;
		},
		
		round: function(number, precision) {
			var factor = Math.pow(10, precision);
			var tempNumber = number * factor;
			var roundedTempNumber = Math.round(tempNumber);
			return roundedTempNumber / factor;
		},


		drawWaveformSVG: function() {

			$('.loading').text('Drawing Peaks');
			var channels = ['left','right'],
				chCount = 0,
				sign = '';
			for(chCount; chCount < channels.length; chCount++) {

				if (channels[chCount] === 'left') {
					sign = '-';
					//console.log('flip sign...');
				} else {
					sign = '';
				}

				//console.log('Drawing...', channels[chCount]);
				var chPeaks = this.peaks[channels[chCount]],
					peaksLength = chPeaks.length,
					strokeWidth = 1, // smooth ? 0.75 : 5;
					path = document.getElementById('waveform-path-' + channels[chCount]),
					d = '',//M0,0',
					peakNumber;

				for(peakNumber = 0; peakNumber < peaksLength; peakNumber++) {
					// if (peakNumber%2 === 0) {
					// 	d += ' M'+ ~~(peakNumber/2) + ', ' + peaks.shift();
					// } else {
					// 	d += ' L'+ ~~(peakNumber/2) + ', ' + peaks.shift();
					// }



					//d += ' L'+ peakNumber + ', ' + ( peaks.shift() ) ;

					var val = (chPeaks.shift() * 100);
					//if (peakNumber%2 === 0) {
						d += ' M'+ peakNumber + ', 0';
					//} else {
						d += ' L'+ peakNumber + ', ' + sign + val;
						//d += ' L'+ peakNumber + ', -' + val;
					//}



				}
				path.setAttribute('stroke-width', strokeWidth);
				path.setAttribute('d', d);


			}

			$('.loading').remove();

		},

		clearWaveformSVG: function() {
			var lPath = document.getElementById('waveform-path-left'),
				rPath = document.getElementById('waveform-path-right');
				lPath.setAttribute('d', '');
				rPath.setAttribute('d', '');
		},


		initAudio: function() {

			$('.plot-container').append('<div class="loading">Loading... </div>');
			// audioContext.createMediaElementSource(this.$player[0]);
			// console.log(audioContext)
			//$('#player').load();
			this.audioFile = $('#track-player').find('source').attr('src');
			peaks.clearWaveformSVG();
			peaks.resetNeedle();

			//peaks.resetMarkup();
			//peaks.setHandlers();

			var self = this,
				bufferData,
				xhr = new XMLHttpRequest(),
				file = this.audioFile;
				console.log(file);
			//self.resetNeedle();
			xhr.open('GET', file, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				//$('#player').find('source').attr('src', file);//.attr('type','mp4');

				$('.loading').text('Decoding Audio');

				audioContext.decodeAudioData(this.response,function(bufferData) {
					$('.loading').text('Drawing Peaks');
					peaks.peaks.left = peaks.getPeaks(bufferData.getChannelData(0));
					peaks.peaks.right = peaks.getPeaks(bufferData.getChannelData(1));
					peaks.drawWaveformSVG();

					// var mySource = audioContext.createMediaElementSource($('#player')[0]);
					// mySource.connect(self.analyser);

					// var bufferLength = self.analyser.frequencyBinCount;
					// var dataArray = new Uint8Array(bufferLength);
					// self.analyser.getByteTimeDomainData(dataArray);

					//console.log(dataArray, dataArray.length);

					//console.log('Data: ', peaks.$player.data());
					//peaks.$player.attr('data-time',peaks.$player.data().time);

				});
			};
			 
			xhr.send();

		},

		// resetMarkup: function() {
		// 	var self = this;
		// 	self.$container.html(self.graphMarkup);
		// 	self.$player = $('#player');
		// },

		setHandlers: function() {
			var self = this;
			self.$player.on('loadedmetadata', function(e) {
				//console.log('Loaded metadata: ', e.currentTarget.duration);
				//self.$player.attr('data-time',e.currentTarget.duration);
			});
			// self.$player.on('durationchange', function(e) {
			// 	//console.log('dURATION cHANGED: ', e.currentTarget.duration);
			// 	//self.$player.attr('data-time',e.currentTarget.duration);
			// });

			self.$player.on('playing', function(e) {
				//console.log('Event: ', e);
				//moveTheNeedle(e);
			});
			self.$player.on('progress', function(e) {
				//console.log('Event: ', e);
				//console.log($player.data());
				//moveTheNeedle(e);
			});
			self.$player.on('timeupdate', function(e) {
				requestAnimationFrame( function() {
					self.moveTheNeedle(e);
				});
				//self.moveTheNeedle(e);
			});

			$('#ac1').on('mousedown.playhead', '#playHead', function(e) {
				console.log('Playhead... ',e);
				$('body').on('mousemove.playhead', function(e) {
					console.log('dragging... ',e);
				});
			});
			$('#ac1').on('mouseup', function(e) {
				$('body').off('mousemove.playhead');
				console.log('clear drag listener... ',e);
			});
		},

		init: function() {
			var self = this;
			this.$container = $('#ac1');
			this.$player = $('#track-player');
			//this.initAudio();
			//$.get('mods/peaks/peaks_tmpl.html').done(function(data) {
				//self.graphMarkup = $(data).clone();
				//self.resetMarkup();
				self.setHandlers();
			//});
			//this.analyser = audioContext.createAnalyser();
		},


		moveTheNeedle: function(e) {
			var self = this;
			//console.log(e.currentTarget.currentTime, e.currentTarget.duration);
			var time =  e.currentTarget.currentTime,
				duration = e.currentTarget.duration,
				pct = (duration / 100);
				this.currentPct = ( time / pct );
			//console.log(duration, time , pct, this.currentPct);

			var svgWidth = this.plotSize,
				svgPct = svgWidth / 100,
				newLocation = svgPct * this.currentPct;
				//console.log(newLocation);
			if ($.isNumeric(newLocation)) {
				$('#playHead').attr('d', 'M'+newLocation+', -100 L'+newLocation+', 100' );
			}
		},
		resetNeedle: function() {
			$('#playHead').attr('d', 'M0, -100 L0, 100' );
		}



	};

	return peaks;

});


