(function() {
	'use strict';


	angular.module('utn')
	.factory('authHttpResponseInterceptor', function($q, $rootScope) {
		return {
			response: function(response) {
				if(response.status === 401) {
					$rootScope.$broadcast('401UnauthorizedError');
				}
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				if(rejection.status === 401) {
					$rootScope.$broadcast('401UnauthorizedError');
				}
				return $q.reject(rejection);
			}
		};
	});
})();
