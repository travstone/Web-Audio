
requirejs.config({
	baseUrl: './',
	paths: {
		app: '../app',
		jquery: 'js/libs/jquery/jquery-2.2.2.min',
		peaks: 'mods/peaks/peaks',
		audioContext: 'mods/audioContext/audioContext',
		trackSelect: 'mods/trackSelect/trackSelect',
		waveform: 'mods/waveform/waveform',
		rta: 'mods/rta/rta'
	},
	shim: {
		// backbone: {
		// 	deps: ['jquery', 'underscore'],
		// 	exports: 'Backbone'
		// },
		// underscore: {
		// 	exports: '_'
		// }
	}
});

