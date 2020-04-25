(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rCustomer', function ($resource) {
      return $resource('api/customer', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/customer/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/customer/:id',
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/customer',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/customer/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/customer/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
