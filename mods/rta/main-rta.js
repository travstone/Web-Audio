
requirejs(['jquery', 'rta', 'trackSelect'], function( $, rta, trackSelect ) {
	"use strict";
    rta.init();
    trackSelect.init($('#trackSelect'), rta.$player, rta.reset);
});
