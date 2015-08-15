import getFile from './file-get.js';
import setFile from './file-set.js';

var fileStore = {
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

export default fileStore;