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

	constructor: function(name, properties){
		this.name = name;
		this.properties = properties;
		this.urlSelector = URLSelector.create(properties.url);
	},

	create: function(){
		var store = Object.create(this);
		store.constructor.apply(store, arguments);
		return store;
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

	fetch: function(options){
		Promise.resolve().then(function(){		
			var handler = this.get(options.method);

			if( handler ){
				return handler(options);
			}
			else{
				throw new Error('method not found : ' + options.method + ' for store ' + this.name);
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

	createStore: function(name, properties){
		return Store.create(name, properties);
	},

	import: function(name){
		return System.import(storeLocation + '/' + name + '/index.js').then(function(properties){
			return this.define(name, properties);
		}.bind(this));
	},

	define: function(name, properties){
		var store = this.createStore(name, properties);

		this.stores.push(store);

		return store;
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
	}
};

/*
// on browser you can get a file using xmlhttprequest
// so you force using http even with file:/// protocol
ressource.define('file', {
	url: {
		protocol: 'file'
	},

	methods: {
		get: function(options){
			return ressources.findByName('http').fetch(options).then(response){
				// fix for browsers returning status == 0 for local file request
				if( response.status === 0 ){
					response.status = response.body ? 200 : 404;
				}
				return response;
			});
		}
	}
});
*/

ressource.define('http', {
	url: {
		protocol: 'http'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
});

ressource.define('https', {
	url: {
		protocol: 'https'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
});

// ressource.import('file');
// ressource.import('github');

/*
store.storages = storages.map(function(storage){
	return store.createStorage(storage);
}).sort(function(a, b){
	return b.urlSelector.toNumber() - a.urlSelector.toNumber();
});
*/

http.intercept(function(request){
	return ressource.fetch(request.url, request);
});

export default ressource;