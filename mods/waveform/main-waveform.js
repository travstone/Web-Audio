
requirejs(['jquery', 'waveform', 'trackSelect'], function( $, waveform, trackSelect ) {
	"use strict";
    waveform.init();
    trackSelect.init($('#trackSelect'), waveform.$player, waveform.reset);
});
