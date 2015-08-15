import replace from './lib/replace.js';
import Base64 from './lib/base64.js';
import './object-complete.js';

/*
live example (only to create, updating need the SHA)
author & committer are optional
var giturl = 'https://api.github.com/repos/dmail/argv/contents/test.js';
var xhr = new XMLHttpRequest();

xhr.open('PUT', giturl);
xhr.setRequestHeader('Authorization', 'token 0b6d30a35dd7eac332909186379673b56e1f03c2');
xhr.setRequestHeader('content-type', 'application/json');
xhr.send(JSON.stringify({
	message: 'create test.js',
	content: btoa('Hello world'),
	branch: 'master'
}));
*/
// https://developer.github.com/v3/repos/contents/#create-a-file
// http://stackoverflow.com/questions/26203603/how-do-i-get-the-sha-parameter-from-github-api-without-downloading-the-whole-f
// en mode install il suffit de faire un create file avec PUT
// en mode update il faut update le fichier avec un PUT mais c'est plus complexe
function completeGithubSetRequestOptions(options){
	var giturl = replace('https://api.github.com/repos/{user}/{repo}/contents/{path}', {

	});

	Object.complete(options, {
		headers: {
			'content-type': 'application/json',
			'user-agent': 'jsenv'
		},
		body: JSON.stringify({
			message: 'update ' + giturl.pathname,
			content: Base64.encode(options.body)
		})
	});

	options.method = 'PUT';
	options.url = giturl;

	return options;
}

export default completeGithubSetRequestOptions;