
requirejs(['jquery', 'peaks', 'waveform', 'rta', 'trackSelect', 'player'], function( $, peaks, waveform, rta, trackSelect, player ) {
	"use strict";
	peaks.init();
    waveform.init();
    rta.init();
	player.init();
	trackSelect.init();
});
