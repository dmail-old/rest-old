/* globals debug, System, platform */

import '../node_modules/@dmail/url/index.js';
import URLSelector from './url-selector.js';
import http from '../node_modules/@dmail/http/index.js';
//import '../object-complete.js';

var storeLocation = './store';

var Store = {
	name: undefined,
	url: null,
	urlSelector: null,
	methods: {},

	constructor: function(store, options){
		this.store = store;
		Object.assign(this, options);
		this.urlSelector = URLSelector.create(options.url);
	},

	create: function(){
		var storage = Object.create(this);
		storage.constructor.apply(storage, arguments);
		return storage;
	},

	get: function(method){
		method = String(method).toLowerCase();

		var methods = this.properties.methods;

		// all methods supported
		if( typeof methods === 'function' ) return methods;
		// specifice method handler
		if( method in this.methods ) return this.methods[method];
		// default handler for any method
		if( '*' in this.methods ) return this.methods['*'];

		return null;
	},

	import: function(){
		return System.import(storeLocation + '/' + this.name + '/index.js');
	},

	fetch: function(options){
		return this.import().then(function(properties){
			this.properties = properties;
		}.bind(this)).then(function(){
			var handler = this.get(options.method);

			if( handler ){
				return handler(options);
			}
			else{
				throw new Error('method not found : ' + options.method + ' for storage ' + this.name);
			}
		}.bind(this)).then(function(value){
			return http.createResponsePromise(value);
		}).then(function(response){
			console.log(response.status, String(options.url));
			return response;
		});
	}
};

var ressource = {
	stores: [],

	createStore: function(options){
		return Store.create(this, options);
	},

	find: function(fn, bind){
		var stores = this.stores, i = 0, j = stores.length, store;

		for(;i<j;i++){
			store = stores[i];

			if( fn.call(bind, store, i, stores) ){
				break;
			}
			else{
				store =null;
			}
		}

		return store;
	},

	findByName: function(name){
		return this.find(function(store){
			return store.name === name;
		});
	},

	findByURL: function(location){
		location = new URL(location);

		var store = this.find(function(store){
			return store.urlSelector.match(location);
		});

		if( !store ){
			throw this.createStoreNotFoundError(location);
		}

		return store;
	},

	createStoreNotFoundError: function(location){
		var error = new Error(location + ' has no associated store');
		return error;
	},

	fetch: function(request){
		try{
			return this.findByURL(request.url).fetch(request);
		}
		catch(e){
			return Promise.reject(e);
		}
	},

	/*
	get(location, options = {}){
		Object.complete(options, {method: 'GET'});
		return this.fetch(location, options);
	},

	set(location, body, options = {}){
		Object.complete(options, {method: 'POST', body: body});
		return this.fetch(location, options);
	},

	update(url, body, options = {}){
		Object.complete(options, {method: 'PUT', body: body});
		return this.fetch(location, options);
	},

	delete(url, options = {}){
		Object.complete(options, {method: 'DELETE'});
		return this.fetch(location, options);
	}
	*/
};

var stores = [];

/*
file storage on browser, you can get a file using xmlhttprequest
but how to include it with this API ?

// force file get to use http get and transform the returned response
ressource.findByName('file').properties.methods = {
	get: function(){
		return ressources.findByName('http').fetch(options).then(response){
			// fix for browsers returning status == 0 for local file request
			if( response.status === 0 ){
				response.status = response.body ? 200 : 404;
			}
			return response;
		});
	}
};

store.storages = storages.map(function(storage){
	return store.createStorage(storage);
}).sort(function(a, b){
	return b.urlSelector.toNumber() - a.urlSelector.toNumber();
});

instead of providing ressource.get in order to make an http request
we will do the following

Request.intercept(function(request){
	if( request.protocol === 'file' ) // get ressource as filed instead of http
});

*/

http.intercept(function(request){
	return ressource.fetch(request.url, request);
});

export default ressource;