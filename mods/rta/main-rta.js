
requirejs(['jquery', 'rta', 'trackSelect'], function( $, rta, trackSelect ) {
	"use strict";
    rta.init();
    trackSelect.init($('#track-select'), rta.$player, rta.reset);
});
