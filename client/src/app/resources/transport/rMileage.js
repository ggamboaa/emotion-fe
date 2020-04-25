(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rMileage', function ($resource) {
      return $resource('api/mileage', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/mileage/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/mileage',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/mileage/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/mileage/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/mileage/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
