(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rDocument', function ($resource) {
      return $resource('api/document', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/document/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/document',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/document/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/document/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/document/changeStatus/:id',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'api/document/close',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
