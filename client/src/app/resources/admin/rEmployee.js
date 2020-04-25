(function () {
	'use strict';

	angular
	.module('utn')
	.factory('rEmployee', function ($resource) {
		return $resource('api/employee', {
			id: '@id'
		},
		{
			'query': {
				method: 'GET',
					url: 'api/employee/:id',
						//isArray: true,
						params: {
							id: '@id'
						}
					},
					'save': {
						method: 'POST',
						url: 'api/employee',
						params: {
							id: '@id'
						}
					},
					'update': {
						method: 'PUT',
						url: 'api/employee/:id',
						params: {
							id: '@id'
						}
					},
					'delete': {
						method: 'DELETE',
						url: 'api/employee/:id',
						params: {
							id: '@id'
						}
					},
					'changeStatus': {
						method: 'PUT',
						url: 'api/employee/changeStatus/:id',
						params: {
							id: '@id'
						}
					},
					'getReport': {
						method: 'GET',
						url: 'api/report'
						//isArray: true,
						// params: {
						// 	id: '@id'
						// }
					}
				});
	});
})();
