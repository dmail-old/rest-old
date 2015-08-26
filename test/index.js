/* global System */

require('system-platform');

global.platform.ready(function(){
	System.import('./index.js').then(function(exports){
		return exports.default;
	}).then(function(ressource){
		ressource.get('./index.js').then(function(response){
			return response.text();
		}).then(function(body){
			console.log(body);
		});
	});
});