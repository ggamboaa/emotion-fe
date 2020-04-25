(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rFuel', function ($resource) {
      return $resource('api/fuel', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/fuel/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/fuel',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/fuel/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/fuel/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/fuel/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
