import ressource from './lib/ressource.js';
import stores from './lib/store/store-{platform}.js';

for(var storeName in stores){
	ressource.define(storeName, stores[storeName]);
}

var supportedRessources = ressource.stores.map(function(store){
	return store.name + '=' + Object.keys(store.properties.methods).join(' ');
});

console.log('supported ressources', supportedRessources.join(','));

export default ressource;