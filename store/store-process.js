import ressource from '../lib/ressource.js';
import fileStore from './file-process/index.js';
import githubStore from './github/index.js';

export default {
	file: fileStore,
	github: githubStore
};