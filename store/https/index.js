var httpsStore = {
	url: {
		protocol: 'https'
	},

	methods: {
		'*': function(options){
			return options;
		}
	}
};

export default httpsStore;