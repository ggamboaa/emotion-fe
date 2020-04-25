(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rWarehouse', function ($resource) {
      return $resource('api/warehouse', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/warehouse/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/warehouse',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/warehouse/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/warehouse/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/warehouse/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
