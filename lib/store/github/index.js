/* global platform */

import getGithub from './github-get.js';
import setGithub from './github-set.js';

var githubStore = {
	url: {
		protocol: 'github'
	},

	methods: {
		get(options){
			return getGithub(options);
		},

		set(options){
			return setGithub(options);
		}
	}
};

export default githubStore;