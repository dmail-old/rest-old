import githubService from './github/index.js';
import fileService from './file-browser/index.js';

var services = {
	github: githubService,
	file: fileService
};

export default services;