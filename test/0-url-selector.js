import URLSelector from '../lib/url-selector.js';

export function suite(add){

	add('match protocol', function(test){
		var fileUrlSelector = URLSelector.create({
			protocol: 'file'
		});
		var fileUrl = new URL('file:///C:/Users/file.txt');
		var httpUrl = new URL('http://google.com/file.txt');

		test.equal(fileUrlSelector.match(fileUrl), true);
		test.equal(fileUrlSelector.match(httpUrl), false);
	});

	add('match hostname', function(test){
		var githubUrlSelector = URLSelector.create({
			hostname: 'github.com'
		});
		var githubUrl = new URL('http://dmail@github.com:8000');
		var googleUrl = new URL('http://anonymous@google.com:80');

		test.equal(githubUrlSelector.match(githubUrl), true);
		test.equal(githubUrlSelector.match(googleUrl), false);
	});

	add('toNumber() reflects selector priority wich increase as property is located to the end of url', function(test){
		var properties = [
			'protocol',
			'hostname',
			'port',
			'pathname',
			'dirname',
			'extname'
		];

		var values = properties.map(function(name){
			var selector = {};
			selector[name] = 'foo';
			return URLSelector.create(selector).toNumber();
		});

		var sortedValues = values.sort();

		test.equal(values.join(), sortedValues.join());
	});

}