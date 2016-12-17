
requirejs(['jquery', 'rta', 'trackSelect'], function( $, rta, trackSelect ) {
	"use strict";
    rta.init(true);
    trackSelect.init($('#track-select'), rta.$player, rta.reset);
});
