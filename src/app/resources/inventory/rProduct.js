(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rProduct', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/product', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/product/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/product',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/product/:id',
            params: {
              id: '@id'
            }
          },
          'importProducts': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/product/importProducts',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/product/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/product/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
