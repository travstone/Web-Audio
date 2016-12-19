
define(['jquery'],function($) {

	"use strict";

	var player = {

		duration: null,
		currentTime: null,
		sampleRate: null,
		$body: null,
		$player: null,

		init: function() {
			console.log('player init...');
			this.$body = $('body');
			this.$player = $('#track-player');
			this.setHandlers();
			this.setListeners();
		},

		loadTrack: function(track) {
			this.$player[0].pause();
			this.$player.html('');
			this.$player.html('<source src="audio/'+track.file+'" type="'+track.type+'"></source>');
			this.$player[0].load();
		},

		setListeners: function() {
			var self = this;
			this.$body.on('trackSelect.selected', function(data) {
				console.log('Selected: ', data.track);
				self.loadTrack(data.track);
			});
		},

		setHandlers: function() {
			var self = this;

			this.$player.on('loadstart', function(e) {
				self.$body.trigger({
					type: 'player.loadstart',
					e: e
				});
			});

			this.$player.on('loadedmetadata', function(e) {
				self.$body.trigger({
					type: 'player.loadedmetadata',
					e: e
				});
			});

			this.$player.on('loadeddata', function(e) {
				self.$body.trigger({
					type: 'player.loadeddata',
					e: e
				});
			});

			this.$player.on('canplay', function(e) {
				self.$body.trigger({
					type: 'player.canplay',
					e: e
				});
			});

			this.$player.on('canplaythrough', function(e) {
				self.$body.trigger({
					type: 'player.canplaythrough',
					e: e
				});
			});

			this.$player.on('durationchange', function(e) {
				self.$body.trigger({
					type: 'player.durationchange',
					e: e
				});
			});



			this.$player.on('play', function(e) {
				self.$body.trigger({
					type: 'player.play',
					e: e
				});
			});

			this.$player.on('playing', function(e) {
				self.$body.trigger({
					type: 'player.playing',
					e: e
				});
			});

			this.$player.on('progress', function(e) {
				self.$body.trigger({
					type: 'player.progress',
					e: e
				});
			});

			this.$player.on('pause', function(e) {
				self.$body.trigger({
					type: 'player.pause',
					e: e
				});
			});



			this.$player.on('timeupdate', function(e) {
				self.$body.trigger({
					type: 'player.timeupdate',
					e: e
				});
			});

			this.$player.on('seeking', function(e) {
				self.$body.trigger({
					type: 'player.seeking',
					e: e
				});
			});

			this.$player.on('seeked', function(e) {
				self.$body.trigger({
					type: 'player.seeked',
					e: e
				});
			});

		},

	};

	return player;

});
