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

	fetch: function(request){
		return Promise.resolve().then(function(){
			var handler = this.get(request.method);

			if( handler ){
				return handler(request);
			}
			else{
				throw new Error('method not found : ' + request.method + ' for store ' + this.name);
			}
		}.bind(this)).then(function(response){
			console.log(response.status, String(request.url));
			return response;
		});
	}
};

var ressource = {
	stores: [],

	createStore(name, properties){
		return Store.create(name, properties);
	},

	ready(){
		return Promise.resolve();
	},

	define(name, properties){
		if( this.findByName(name) ){
			this.delete(name);
		}

		var store = this.createStore(name, properties);

		this.stores.push(store);

		this.stores = this.stores.sort(function(a, b){
			return b.urlSelector.toNumber() - a.urlSelector.toNumber();
		});

		return store;
	},

	delete(name){
		var store = this.findByName(name);

		if( store ){
			this.stores.splice(this.stores.indexOf(store), 1);
			return true;
		}

		return false;
	},

	find(fn, bind){
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

	findByName(name){
		return this.find(function(store){
			return store.name === name;
		});
	},

	findByURL(location){
		var store = this.find(function(store){
			return store.urlSelector.match(location);
		});

		if( !store ){
			throw this.createStoreNotFoundError(location);
		}

		return store;
	},

	createStoreNotFoundError(location){
		var error = new Error(location + ' has no associated store');
		return error;
	},

	fetch(request){
		try{
			return this.findByURL(request.url).fetch(request);
		}
		catch(e){
			return Promise.reject(e);
		}
	}
};

['get', 'post', 'put', 'delete'].forEach(function(name){
	ressource[name] = function(){
		return http[name].apply(http, arguments);
	};
});

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
	return ressource.fetch(request);
});

export default ressource;