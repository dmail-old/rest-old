var httpStore = {
	url: {
		protocol: 'http'
	},

	methods: {
		'*': function(options){
			return options;
		}
	}
};

export default httpStore;