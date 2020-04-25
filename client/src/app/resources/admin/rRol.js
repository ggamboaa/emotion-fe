(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRol', function ($resource) {
      return $resource('api/rol', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/rol/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/rol',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/rol/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/rol/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/rol/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
