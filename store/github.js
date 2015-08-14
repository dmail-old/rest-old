import createResponsePromise from './lib/http/http.js';
import base64 from './utils/Base64.js';
import './object-complete.js';

function replace(string, values){
	return string.replace((/\\?\{([^{}]+)\}/g), function(match, name){
		if( match.charAt(0) == '\\' ) return match.slice(1);
		return (values[name] != null) ? values[name] : '';
	});
}

/*
live example
var giturl = 'https://api.github.com/repos/dmail/argv/contents/index.js?ref=master';
var xhr = new XMLHttpRequest();
//var date = new Date();
//date.setMonth(0);

xhr.open('GET', giturl);
xhr.setRequestHeader('accept', 'application/vnd.github.v3.raw');
//xhr.setRequestHeader('if-modified-since', date.toUTCString());
xhr.send(null);
*/
function completeGithubGetRequestOptions(options){
	var url = options.url;
	var parsed = new URL(url);
	var pathname = parsed.pathname;
	var parts = pathname.slice(1).split('/');
	var user = parts[0];
	var repo = parts[1];
	var file = parts.slice(2);

	var data = {
		user: user,
		repo: repo,
		path: file || 'index.js',
		version: parsed.hash ? parsed.hash.slice(1) : 'master'
	};

	var giturl = replace('https://api.github.com/repos/{user}/{repo}/contents/{path}?ref={version}', data);
	var headers = {
		'accept': 'application/vnd.github.v3.raw',
		'user-agent': 'jsenv' // https://developer.github.com/changes/2013-04-24-user-agent-required/
	};

	if( data.user && platform.config['github-' + data.user + '-token'] ){
		headers['authorization'] = 'token ' + platform.config['github-' + data.user + '-token'];
	}

	Object.complete(options, {headers: headers});

	options.url = giturl;

	return options;
}

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
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			'user-agent': 'jsenv'
		},
		body: JSON.stringify({
			message: 'update ' + giturl.pathname,
			content: Base64.encode(options.body)
		})
	});

	options.url = giturl;

	return options;
}

// because git respond with this content-type we have to detect the media from the extension
/*
jsenv.media.register('application/vnd.github.v3.raw', {
	toMedia: function(module){
		return jsenv.media.findByModuleExtension(module);
	}
});
*/

export default {
	url: {
		hostname: 'github.com'
	},

	methods: {
		GET: function(options){
			options = completeGithubGetRequestOptions(options);
			return createResponsePromise(options);
		},

		POST: function(options){
			options = completeGithubSetRequestOptions(options);
			return createResponsePromise(options);
		}
	}
};