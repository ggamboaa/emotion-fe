(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rTracking', function ($resource) {
      return $resource('api/tracking', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/tracking/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/tracking',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/tracking/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/tracking/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/tracking/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();