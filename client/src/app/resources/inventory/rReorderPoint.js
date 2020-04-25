(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rReorderPoint', function ($resource) {
      return $resource('api/reorderPoint', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/reorderPoint/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/reorderPoint',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/reorderPoint/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/reorderPoint/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/reorderPoint/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
