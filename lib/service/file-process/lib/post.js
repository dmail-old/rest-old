import getFilePath from './get-filepath.js';
import mkdirto from './mkdir-to.js';

import nodefs from 'node/fs';

function createResponsePropertiesPromiseForPost(request){
	var url = getFilePath(request), promise;

	// faudrais renvoyer last-modified, size et tout non?
	promise = mkdirto(url).then(function(){
		return request.body.pipeTo(nodefs.createWriteStream(url)).then(function(){
			return {
				status: 200
			};
		});
	});

	return promise;
}

export default function postFile(request){
	return createResponsePropertiesPromiseForPost(request);
}