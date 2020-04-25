(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rGeneralRegister', function ($resource) {
      return $resource('api/generalRegister', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/generalRegister/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/generalRegister',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/generalRegister/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/generalRegister/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/generalRegister/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();