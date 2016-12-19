
requirejs(['jquery', 'peaks', 'trackSelect', 'player'], function( $, peaks, trackSelect, player ) {
	"use strict";
	peaks.init();
	player.init();
	trackSelect.init();
});
