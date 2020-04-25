(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rBrand', function ($resource) {
      return $resource('api/brand', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/brand/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/brand',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/brand/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/brand/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/brand/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
