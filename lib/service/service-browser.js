import githubFileServiceRoutes from './github/index.js';
import fileServiceRoutes from './file-browser/index.js';

var serviceRoutes = {
	github: githubFileServiceRoutes,
	file: fileServiceRoutes
};

export default serviceRoutes;