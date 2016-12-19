
define(['jquery', 'audioContext', 'text!mods/peaks/peaks_tmpl.html'], function( $, audioContext, peaksTmpl ) {

	"use strict";

	var peaks = {

		$container: null,
		$body: null,
		$template: null,
		$playhead: null,

		plotSize: 12000,
		peaks: {'left': [], 'right': []},

		getPeaks: function(bufferData) {
			var bufferLength = bufferData.length,
				maxVal = 0,
				minVal = 0,
				batchSize = Math.ceil( bufferLength / this.plotSize ),
				inc = 0,
				batchPeaks = [],
				curVal,
				setValue;

			for (inc; bufferLength >= inc; inc++) {
				curVal = bufferData[inc];
				if( curVal > maxVal ) {
					maxVal = curVal;
				}
				// everytime we have processed [batchSize] batchPeaks, store a value in output
				if(inc % batchSize === 0 ) {
					//console.log('store batch...');
					// find whichever value is greater (positive or negative) - hence use Math.abs
					if ( Math.abs(minVal) > Math.abs(maxVal) ) {
						setValue = minVal;
					}
					else if( Math.abs(minVal) < Math.abs(maxVal) ) {
						setValue = maxVal;
					} else {
						setValue = maxVal;
					}
					// by now we should have a single value for this batch
					batchPeaks.push( this.round(setValue, 4) );
					// reset for next batch
					maxVal = 0;
					minVal = 0;
				}
			}
			return batchPeaks;
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
				} else {
					sign = '';
				}
				var chPeaks = this.peaks[channels[chCount]],
					peaksLength = chPeaks.length,
					strokeWidth = 1,
					path = document.getElementById('peak-path-' + channels[chCount]),
					d = '',
					peakNumber;

				for(peakNumber = 0; peakNumber < peaksLength; peakNumber++) {
					var val = (chPeaks.shift() * 100);
					d += ' M'+ peakNumber + ', 0';
					d += ' L'+ peakNumber + ', ' + sign + val;
				}
				path.setAttribute('stroke-width', strokeWidth);
				path.setAttribute('d', d);
			}
			$('.loading').remove();
		},

		clearWaveformSVG: function() {
			var lPath = document.getElementById('peak-path-left'),
				rPath = document.getElementById('peak-path-right');
				lPath.setAttribute('d', '');
				rPath.setAttribute('d', '');
		},

		initAudio: function(track) {
			var self = this,
				bufferData,
				xhr = new XMLHttpRequest();

			self.clearWaveformSVG();
			self.resetNeedle();
			$('.peaks-container').append('<div class="loading">Loading... </div>');


			xhr.open('GET', 'audio/' + track.file, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				$('.loading').text('Decoding Audio');
				audioContext.decodeAudioData(this.response,function(bufferData) {
					$('.loading').text('Drawing Peaks');
					self.peaks.left = self.getPeaks(bufferData.getChannelData(0));
					self.peaks.right = self.getPeaks(bufferData.getChannelData(1));
					self.drawWaveformSVG();
				});
			};
			xhr.send();

		},

		setListeners: function() {
			var self = this;
			this.$body.on('trackSelect.selected', function(data) {
				self.initAudio(data.track);
			});
			this.$body.on('player.timeupdate', function(data) {
				//console.log('player timeupdate...', data.e);
				requestAnimationFrame( function() {
					self.moveTheNeedle(data.e);
				});
			})
		},

		//setHandlers: function() {
			//var self = this;

			// this.$body.on('player.durationchange', function(e) {
			// 	console.log('player durationchange...');
			// })

			// this.$body.on('player.loadedmetadata', function(e) {
			// 	console.log('player loadedmetadata...');
			// })

			// this.$body.on('player.loadeddata', function(e) {
			// 	console.log('player loadeddata...');
			// })

			// this.$body.on('player.canplay', function(e) {
			// 	console.log('player canplay...');
			// })

			// this.$body.on('player.canplaythrough', function(e) {
			// 	console.log('player canplaythrough...');
			// })



			// this.$body.on('player.play', function(e) {
			// 	console.log('player play...');
			// })

			// this.$body.on('player.playing', function(e) {
			// 	console.log('player playing...');
			// })

			// this.$body.on('player.progess', function(e) {
			// 	console.log('player progess...');
			// })



			// this.$body.on('player.pause', function(e) {
			// 	console.log('player pause...');
			// })



			// this.$body.on('player.seeking', function(e) {
			// 	console.log('player seeking...');
			// })

			// this.$body.on('player.seeked', function(e) {
			// 	console.log('player seeked...');
			// })






			// $('#ac1').on('mousedown.playhead', '#playHead', function(e) {
			// 	console.log('Playhead... ',e);
			// 	this.$body.on('mousemove.playhead', function(e) {
			// 		console.log('dragging... ',e);
			// 	});
			// });
			// $('#ac1').on('mouseup', function(e) {
			// 	this.$body.off('mousemove.playhead');
			// 	console.log('clear drag listener... ',e);
			// });
		//},

		init: function() {
			console.log('peaks init...');
			this.$container = $('#peaks-display');
			this.$body = $('body');
			this.$template = $(peaksTmpl);
			this.$container.append(this.$template);
			this.$playhead = $('#playHead');
			//this.setHandlers();
			this.setListeners();
			//console.log(this.$playhead);
		},


		moveTheNeedle: function(e) {
			//var self = this;
			//console.log(e.currentTarget.currentTime, e.currentTarget.duration);
			if (this.$playhead.length !== 1) {this.$playhead = $('#playHead'); console.log('setting playhead after...', this);};
			var time =  e.currentTarget.currentTime,
				duration = e.currentTarget.duration,
				pct = (duration / 100),
				currentPct = ( time / pct ),
				svgWidth = this.plotSize,
				svgPct = svgWidth / 100,
				newLocation = svgPct * currentPct;

			if ($.isNumeric(newLocation)) {
				//console.log(newLocation, this.$playhead, this);
				this.$playhead.attr('d', 'M'+newLocation+', -100 L'+newLocation+', 100' );
			} else {
				//console.log('Whoops... ');
			}
		},

		resetNeedle: function() {
			this.$playhead.attr('d', 'M0, -100 L0, 100' );
		}



	};

	return peaks;

});


