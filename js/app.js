
//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
//console.log('app config...');
requirejs.config({
	baseUrl: './',
	paths: {
		//app: '../app',
		jquery: 'js/libs/jquery/jquery-2.2.2.min',
		audioContext: 'mods/audioContext/audioContext',
		trackSelect: 'mods/trackSelect/trackSelect',
		peaks: 'mods/peaks/peaks',
		waveform: 'mods/waveform/waveform',
		rta: 'mods/rta/rta',
		oscillator: 'mods/oscillator/oscillator'
	},
	shim: {
		// backbone: {
		// 	deps: ['jquery', 'underscore'],
		// 	exports: 'Backbone'
		// },
		// underscore: {
		// 	exports: '_'
		// }
		jquery: {
			exports: '$'
		}
	}
});


// Start loading the main app file. Put all of
// your application logic in there.
//requirejs(['js/main.js']);