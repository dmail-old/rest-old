import ressource from './lib/ressource.js';
import stores from './store-{platform}.js';

for(var storeName in stores){
	ressource.define(storeName, stores[storeName]);
}

export default ressource;