
// define(function (require) {
// 	"use strict";
// 	jq = require('jquery');
// 	var test = jq('h1');
// 	console.log(test);

// });


requirejs(['jquery', 'peaks'], function( $, peaks ) {
	"use strict";
 //    console.log( $ ); // OK
	// var test = $('h1');
	// console.log(test);

    console.log( peaks ); // OK
});