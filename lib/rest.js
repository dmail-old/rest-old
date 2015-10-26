import restService from './service-handler.js';
import services from './service/service-#{platform-type}.js';

import http from '../node_modules/@dmail/http/index.js';

// service can return the request, it means :
// let other services handle the request and let it be transported (to the server) if no service handles it

// mirror http service
restService.define('http', {
	url: {
		protocol: 'http'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
});
// mirror https service
restService.define('https', {
	url: {
		protocol: 'https'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
});
// set platform specific services
for(var storeName in stores){
	restService.define(storeName, stores[storeName]);
}
// log supported services
var supportedServices = restService.services.map(function(service){
	return service.name + '=' + Object.keys(service.properties.methods).join(' ');
});
platform.info('supported ressources', supportedServices.join(', '));




// rest will is an http client with one service : the rest service
var rest = http.create();
rest.ResponseGenerator.services.add(function(request){
	return restService.fetch(request);
});

export default rest;