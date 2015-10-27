/* global platform */

import getGithub from './lib/get.js';
import postGithub from './lib/post.js';

var githubFileServiceRoutes = {
	url: {
		protocol: 'github'
	},

	methods: {
		get(options){
			return getGithub(options);
		},

		post(options){
			return postGithub(options);
		}
	}
};

export default githubFileServiceRoutes;