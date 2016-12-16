
requirejs(['jquery', 'peaks', 'trackSelect'], function( $, peaks, trackSelect ) {
	"use strict";
    peaks.init();
    trackSelect.init($('#track-select'), peaks.$player, peaks.initAudio);
});
