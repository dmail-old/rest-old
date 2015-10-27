var fileServiceRoutes = {
	url: {
		protocol: 'file'
	},

	methods: {
		get: function(request){
			return this.transportRequest(request).then(function(response){
				// fix for browsers returning status == 0 for local file request
				if( response.status === 0 ){
					if( response.body ){
						return response.body.readAsString().then(function(string){
							response.status = string ? 200 : 404;
							return response;
						});
					}
					else{
						response.status = 404;
					}
				}

				return response;
			});
		}
	}
};

export default fileServiceRoutes;