
requirejs(['jquery', 'waveform', 'trackSelect', 'player'], function( $, waveform, trackSelect, player ) {
	"use strict";
    waveform.init();
	player.init();
	trackSelect.init();
});
