
requirejs(['jquery', 'waveform', 'trackSelect'], function( $, waveform, trackSelect ) {
	"use strict";
    waveform.init(true);
    trackSelect.init($('#track-select'), waveform.$player, waveform.reset);
});
