(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRepair', function ($resource) {
      return $resource('api/repair', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/repair/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/repair',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'api/repair/close',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/repair/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/repair/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/repair/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
