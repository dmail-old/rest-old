import proto from 'proto';

import URLSelector from './url-selector.js';

var Service = proto.extend({
	name: undefined,
	url: {},
	urlSelector: null,
	methods: {},

	constructor: function(options = {}){
		Object.assign(this, options);
		this.urlSelector = URLSelector.create(this.url);
		if( false === this.hasOwnProperty('priority') ){
			Object.defineProperty(this, 'priority', {
				get: function(){
					return this.urlSelector.toNumber();
				}
			});
		}
	},

	match(url){
		return this.urlSelector.match(url);
	},

	get: function(method){
		method = String(method).toLowerCase();

		var methods = this.methods;

		// all methods supported
		if( typeof methods === 'function' ) return methods;
		// specific method handler
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
			platform.info(response.status, String(request.url));
			return response;
		});
	}
});

export default Service;