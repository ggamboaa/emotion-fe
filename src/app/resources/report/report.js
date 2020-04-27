(function () {
	'use strict';

	angular
	.module('utn')
	.factory('rReport', function ($resource) {
		return $resource('https://emotion-be.herokuapp.com/report', {
			id: '@id'
		},
		{
			'getCustomerReport': {
				method: 'GET',
				url: 'https://emotion-be.herokuapp.com/report/getCustomerReport'
			},
			'getEmployeeReport': {
				method: 'GET',
				url: 'https://emotion-be.herokuapp.com/report/getEmployeeReport'
			},
			'getUPLReport': {
				method: 'POST',
				url: 'https://emotion-be.herokuapp.com/report/getUPLReport'
			}
		});
	});
})();
