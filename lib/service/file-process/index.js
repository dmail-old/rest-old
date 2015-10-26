import getFile from './lib/get.js';
import setFile from './lib/set.js';

var fileService = {
	url: {
		protocol: 'file'
	},

	methods: {
		get(options){
			return getFile(options);
		},

		set(options){
			return setFile(options);
		}
	}
};

export default fileService;