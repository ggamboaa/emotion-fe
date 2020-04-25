(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rStore', function ($resource) {
      return $resource('api/store', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/store/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/store',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/store/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/store/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/store/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
