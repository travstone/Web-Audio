
//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
console.log('app config...');
requirejs.config({
	baseUrl: 'js',
	paths: {
		app: '../app',
		jquery: 'libs/jquery/jquery-2.2.2.min',
		peaks: 'mods/peaks',
		audioContext: 'mods/audioContext'
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


// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['js/main.js']);