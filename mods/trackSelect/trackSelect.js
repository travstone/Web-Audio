
define(['jquery'], function( $ ) {

	"use strict";
	var trackSelect = {

		$markup: null,
		$container: null,
		$player: null,
		loadedCb: null,

		tracks: [
			//{tName: '', fType: ''},
			{tName: '02 - Aja.mp3', fType: 'audio/mp3'},
			{tName: '01 - Morph The Cat.mp3', fType: 'audio/mp3'},
			{tName: '02 Mandjou.mp3', fType: 'audio/mp3'},
			{tName: '02 - Clockout.mp3', fType: 'audio/mp3'},
			{tName: '01 The Nod.mp3', fType: 'audio/mp3'},
			{tName: '14 - Papa Don\'t Take No Mess - part 1.mp3', fType: 'audio/mp3'},
			{tName: '02 - I Wish I Had Duck Feet.mp3', fType: 'audio/mp3'},
			{tName: '03 - Sad But True.mp3', fType: 'audio/mp3'},
			{tName: 'TRACK02-1-AR.mp3', fType: 'audio/mp3'},
			{tName: '04. Think.mp3', fType: 'audio/mp3'},
			{tName: '05 The Jamaicans - Ba Ba Boom.mp3', fType: 'audio/mp3'},
			{tName: '11. Little Green Bag.mp3', fType: 'audio/mp3'},
			{tName: 'AmbientLizard_boosted_master.mp3', fType: 'audio/mp3'},
			{tName: 'DR000244.mp3', fType: 'audio/mp3'},
			{tName: 'moody_ambient.mp3', fType: 'audio/mp3'},
			{tName: 'steve_miller_jungle_mastered.mp3', fType: 'audio/mp3'},


			{tName: '01 El Yo-yo.m4a', fType: 'audio/mp4'},
			{tName: '01 M\'Badehou.m4a', fType: 'audio/mp4'},
			{tName: '05 Misty Mountain Hop.m4a', fType: 'audio/mp4'},
			{tName: '04 Breed.m4a', fType: 'audio/mp4'},
			{tName: '05 Vibrando Com A Seleção.m4a', fType: 'audio/mp4'},
			{tName: '03 Bameli Soy.m4a', fType: 'audio/mp4'},


			{tName: 'mellow_section_cd.wav', fType: 'audio/wav'},
			{tName: 'funky_squirrel_cd.wav', fType: 'audio/wav'},
			{tName: 'on_the_moon.wav', fType: 'audio/wav'}

		],

		setTrackList: function() {
			var count = 0,
				tl = trackSelect.tracks,
				tlLen = tl.length,
				prettyName = null;
			for (count; count<tlLen; count++) {
				prettyName = tl[count].tName.slice(0,-4);
				trackSelect.$markup.append('<option value="'+tl[count].tName+'" data-ftype="'+tl[count].fType+'">'+prettyName+'</option>');
			}
		},

		init: function($sel, $player, loadedCb) {
			//console.log('Init trackSelect');
			$.get('mods/trackSelect/trackSelect_tmpl.html').done(function(data) {
				trackSelect.$player = $player;
				trackSelect.$markup = $(data).clone();
				trackSelect.setTrackList();
				trackSelect.$container = $sel;
				trackSelect.loadedCb = loadedCb;
				//console.log('trackSelect template retrieved', data, $('#trackSelect'));
				trackSelect.$container.html( trackSelect.$markup );
				trackSelect.setHandlers();
			});
		},

		setHandlers: function() {
			trackSelect.$container.off().on('change', function(e) {
				var $targ = $(e.target),
					//d = $('[value="'+val+'"]').data(),
					type = e.target.selectedOptions[0].dataset.ftype; //$targ.data().ftype;
				//console.log('Clicked...', e, e.target.selectedOptions[0].dataset, $targ);
				trackSelect.$player[0].pause();
				trackSelect.$player.html('');
				trackSelect.$player.html('<source src="audio/'+$targ.val()+'" type="'+type+'"></source>');
				trackSelect.$player[0].load();
				trackSelect.loadedCb();
			});
		},

		trackLoaded: function() {

		}

	};

	return trackSelect;

});