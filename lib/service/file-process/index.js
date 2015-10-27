import getFile from './lib/get.js';
import postFile from './lib/post.js';

var fileServiceRoutes = {
	url: {
		protocol: 'file'
	},

	methods: {
		get(options){
			return getFile(options);
		},

		// ce serais ptet put plutôt non?
		post(options){
			return postFile(options);
		}

		// on pourrais aussi mettre delete
	}
};

export default fileServiceRoutes;