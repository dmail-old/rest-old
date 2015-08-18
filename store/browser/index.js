import githubStore from '../github/index.js';

ressource.define('github', githubStore);

ressource.define('file', {
	url: {
		protocol: 'file'
	},

	methods: {
		get: function(options){
			return ressource.findByName('http').fetch(options).then(function(response){
				// fix for browsers returning status == 0 for local file request
				if( response.status === 0 ){
					response.status = response.body ? 200 : 404;
				}
				return response;
			});
		}
	}
});