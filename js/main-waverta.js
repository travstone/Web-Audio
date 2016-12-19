
requirejs(['jquery', 'waveform', 'rta', 'trackSelect', 'player'], function( $, waveform, rta, trackSelect, player ) {
	"use strict";
    waveform.init();
    rta.init();
	player.init();
	trackSelect.init();
});
