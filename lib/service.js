import proto from 'proto';

import URLSelector from './url-selector.js';

var Service = proto.extend({
	name: undefined,
	url: null,
	urlSelector: null,
	methods: {},

	constructor: function(name, properties){
		this.name = name;
		this.properties = properties;
		this.urlSelector = URLSelector.create(properties.url);
	},

	get: function(method){
		method = String(method).toLowerCase();

		var methods = this.properties.methods;

		// all methods supported
		if( typeof methods === 'function' ) return methods;
		// specifice method handler
		if( method in methods ) return methods[method];
		// default handler for any method
		if( '*' in methods ) return methods['*'];

		return null;
	},

	fetch: function(request){
		return Promise.resolve().then(function(){
			var handler = this.get(request.method);

			if( handler ){
				return handler.call(this, request);
			}
			else{
				throw new Error('method not found : ' + request.method + ' for store ' + this.name);
			}
		}.bind(this)).then(function(response){
			console.log(response.status, String(request.url));
			return response;
		});
	}
});

export default Service;