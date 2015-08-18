/* globals System */

import URLSelector from './url-selector.js';
import http from '../node_modules/@dmail/http/index.js';

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

	ready: function(){
		return Promise.resolve();
	},

	define: function(name, properties){
		var store = this.createStore(name, properties);

		this.stores.push(store);

		this.stores = this.stores.sort(function(a, b){
			return b.urlSelector.toNumber() - a.urlSelector.toNumber();
		});

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

http.intercept(function(request){
	return ressource.fetch(request.url, request);
});

export default ressource;