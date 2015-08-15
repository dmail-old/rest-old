import getFilePath from './lib/get-filepath.js';
import filesystem from './lib/filesystem.js';
import mimetype from './lib/mimetype.js';

var fs = require('fs');
var canReadDirectory = false;

function createResponsePropertiesPromiseForGet(request){
	var filepath = getFilePath(request), promise;

	promise = filesystem('stat', filepath).then(function(stat){
		if( stat.isDirectory() ){
			if( canReadDirectory ){
				return filesystem('readdir', filepath).then(JSON.stringify).then(function(body){
					return {
						status: 200,
						headers: {
							'content-type': 'application/json',
							'content-length': body.length
						},
						body: body
					};
				});			
			}
			else{
				return {
					status: 403
				};
			}
		}

		// new Date request if modified-since peut échouer, dans ce cas renvoyer 400 bad request
		if( request.headers['if-modified-since'] && stat.mtime <= new Date(request.headers['if-modified-since']) ){
			return {
				status: 304,
				headers: {
					'last-modified': stat.mtime.toUTCString()
				}
			};
		}

		var properties = {
			status: 200,
			headers: {
				'last-modified': stat.mtime.toUTCString(),
				'content-type': mimetype(filepath),
				'content-length': stat.size
			}
		};

		if( request.method != 'HEAD' ){
			properties.body = fs.createReadStream(filepath);
		}

		return properties;
	});

	promise = promise.catch(function(error){
		if( error ){
			if( error.code == 'ENOENT' ){
				return {
					status: 404
				};
			}
			// https://iojs.org/api/errors.html#errors_eacces_permission_denied
			if( error.code === 'EACCES' ){
				return {
					status: 403
				};
			}
			if( error.code === 'EPERM' ){
				return {
					status: 403
				};
			}
			// file access may be temporarily blocked (by an antivirus scanning it because recently modified for instance)
			if( error.code === 'EBUSY' ){
				return {
					status: 503,
					headers: {
						'retry-after': 0.01 // retry in 10ms
					}
				};
			}
			// emfile means there is too many files currently opened
			if( error.code === 'EMFILE' ){
				return {
					status: 503,
					headers: {
						'retry-after': 0.1 // retry in 100ms
					}
				};
			}
		}
		return Promise.reject(error);
	});

	/*
	promise = promise.catch(function(error){
		if( error ){
			return {
				status: 500,
				body: error
			};
		}

		return {
			status: 500
		};
	});
	*/

	return promise;
}

export default function getFile(options){
	return createResponsePropertiesPromiseForGet;
}