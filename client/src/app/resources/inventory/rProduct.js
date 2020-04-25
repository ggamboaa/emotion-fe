(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rProduct', function ($resource) {
      return $resource('api/product', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/product/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/product',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/product/:id',
            params: {
              id: '@id'
            }
          },
          'importProducts': {
            method: 'POST',
            url: 'api/product/importProducts',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/product/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/product/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
