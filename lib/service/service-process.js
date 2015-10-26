import fileService from './file-process/index.js';
import githubService from './github/index.js';

var services = {
	file: fileService,
	github: githubService
};

export default services;