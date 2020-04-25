(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUbication', function ($resource) {
      return $resource('api/ubication', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/ubication/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'findByWarehouseId': {
            method: 'GET',
            url: 'api/ubication/findByWarehouseId/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/ubication',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/ubication/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/ubication/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
