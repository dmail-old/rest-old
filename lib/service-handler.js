import Service from './service.js';

var restService = {
	services: [],

	define(name, properties){
		if( this.findByName(name) ){
			this.delete(name);
		}

		var service = Service.create(name, properties);

		this.services.push(service);

		this.services = this.services.sort(function(a, b){
			return b.priority - a.priority;
		});

		return service;
	},

	delete(name){
		var service = this.findByName(name);

		if( service ){
			this.services.splice(this.services.indexOf(service), 1);
			return true;
		}

		return false;
	},

	find(fn, bind){
		var services = this.services, i = 0, j = services.length, service;

		for(;i<j;i++){
			service = services[i];

			if( fn.call(bind, service, i, services) ){
				break;
			}
			else{
				service =null;
			}
		}

		return service;
	},

	findByName(name){
		return this.find(function(service){
			return service.name === service;
		});
	},

	createServiceNotFoundError(location){
		var error = new Error(location + ' has no associated service');
		return error;
	},

	findByURL(location){
		var service = this.find(function(service){
			return service.match(location);
		});

		if( !service ){
			throw this.createServiceNotFoundError(location);
		}

		return service;
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

export default restService;