
requirejs(['jquery', 'peaks', 'trackSelect'], function( $, peaks, trackSelect ) {
	"use strict";
    peaks.init();
    trackSelect.init($('#trackSelect'), peaks.$player, peaks.initAudio);
});
