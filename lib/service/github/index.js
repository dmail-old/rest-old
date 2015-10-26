/* global platform */

import getGithub from './lib/get.js';
import setGithub from './lib/set.js';

var githubService = {
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

export default githubService;