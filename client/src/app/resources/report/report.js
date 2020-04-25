(function () {
	'use strict';

	angular
	.module('utn')
	.factory('rReport', function ($resource) {
		return $resource('api/report', {
			id: '@id'
		},
		{
			'getCustomerReport': {
				method: 'GET',
				url: 'api/report/getCustomerReport'
			},
			'getEmployeeReport': {
				method: 'GET',
				url: 'api/report/getEmployeeReport'
			},
			'getUPLReport': {
				method: 'POST',
				url: 'api/report/getUPLReport'
			}
		});
	});
})();
