import ressource from './index.js';

export function getIndex(test){
	return test.resolveTo(ressource.get('./index.js').then(function(response){
		console.log(response.headers);

		return response.headers.get('content-type');
	}), 'application/javascript');
}