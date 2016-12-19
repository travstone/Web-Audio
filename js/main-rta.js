
requirejs(['jquery', 'rta', 'trackSelect', 'player'], function( $, rta, trackSelect, player ) {
	"use strict";
    rta.init();
	player.init();
	trackSelect.init();
});
