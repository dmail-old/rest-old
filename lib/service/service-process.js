import ressource from '../ressource.js';
import fileService from './file-process/index.js';
import githubService from './github/index.js';

var services = {
	file: fileStore,
	github: githubStore
};

export default services;