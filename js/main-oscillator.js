
requirejs(['jquery', 'waveform', 'rta', 'oscillator'], function( $, waveform, rta, oscillator ) {
	"use strict";
    
    oscillator.init();
    waveform.init();
    rta.init();
});
