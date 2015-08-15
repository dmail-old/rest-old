var httpsStore = {
	url: {
		protocol: 'https'
	},

	methods: {
		'*': function(request){
			return request;
		}
	}
};

export default httpsStore;