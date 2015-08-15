var httpStore = {
	url: {
		protocol: 'http'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
};

export default httpStore;