import fileServiceRoutes from './file-process/index.js';
import githubFileServiceRoutes from './github/index.js';

var serviceRoutes = {
	file: fileServiceRoutes,
	github: githubFileServiceRoutes
};

export default serviceRoutes;