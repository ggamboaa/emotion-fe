(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rVehicle', function ($resource) {
      return $resource('api/vehicle', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/vehicle/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/vehicle',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/vehicle/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/vehicle/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/vehicle/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
