import Service from '../lib/service.js';

export function suite(add){

	add('service name', function(test){
		var service = Service.create({name: 'foo'});

		test.equal(service.name, 'foo');
	});

	add('service priority', function(test){
		var serviceWithExplicitPriority = Service.create({priority: 100});
		var serviceWithImplicitPriority = Service.create({url: {protocol: 'file'}});

		test.equal(serviceWithExplicitPriority.priority, 100);
		test.equal(typeof serviceWithImplicitPriority.priority, 'number');
	});

	add('service get()', function(test){
		function getMethod(){}
		function postMethod(){}
		function starMethod(){}
		function allMethod(){}

		var getMethodService = Service.create({methods: {get: getMethod}});
		var starMethodService = Service.create({methods: {'*': starMethod}});
		var allMethodService = Service.create({methods: allMethod});

		test.equal(getMethodService.get('get'), getMethod);
		test.equal(starMethodService.get('get'), starMethod);
		test.equal(starMethodService.get('post'), starMethod);
		test.equal(allMethodService.get('put'), allMethod);
	});

}