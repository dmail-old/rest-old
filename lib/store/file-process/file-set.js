import getFilePath from './lib/get-filepath.js';
import mkdirto from './lib/mkdir-to.js';
var fs = require('fs');

function createResponsePropertiesPromiseForSet(request){
	var url = getFilePath(request), promise;

	// faudrais renvoyer last-modified, size et tout non?
	promise = mkdirto(url).then(function(){
		return request.body.pipe(fs.createWriteStream(url)).then(function(){
			return {
				status: 200
			};
		});
	});

	return promise;
}

export default function setFile(request){
	return createResponsePropertiesPromiseForSet(request);
}