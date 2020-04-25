(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rDocumentProduct', function ($resource) {
      return $resource('api/documentProduct', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/documentProduct/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/documentProduct',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/documentProduct/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/documentProduct/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/documentProduct/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
