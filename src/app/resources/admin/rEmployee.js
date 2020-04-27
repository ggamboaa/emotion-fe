(function () {
	'use strict';

	angular
	.module('utn')
	.factory('rEmployee', function ($resource) {
		return $resource('https://emotion-be.herokuapp.com/employee', {
			id: '@id'
		},
		{
			'query': {
				method: 'GET',
					url: 'https://emotion-be.herokuapp.com/employee/:id',
						//isArray: true,
						params: {
							id: '@id'
						}
					},
					'save': {
						method: 'POST',
						url: 'https://emotion-be.herokuapp.com/employee',
						params: {
							id: '@id'
						}
					},
					'update': {
						method: 'PUT',
						url: 'https://emotion-be.herokuapp.com/employee/:id',
						params: {
							id: '@id'
						}
					},
					'delete': {
						method: 'DELETE',
						url: 'https://emotion-be.herokuapp.com/employee/:id',
						params: {
							id: '@id'
						}
					},
					'changeStatus': {
						method: 'PUT',
						url: 'https://emotion-be.herokuapp.com/employee/changeStatus/:id',
						params: {
							id: '@id'
						}
					},
					'getReport': {
						method: 'GET',
						url: 'https://emotion-be.herokuapp.com/report'
						//isArray: true,
						// params: {
						// 	id: '@id'
						// }
					}
				});
	});
})();
