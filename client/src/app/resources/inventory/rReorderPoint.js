(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rReorderPoint', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/reorderPoint', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/reorderPoint/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/reorderPoint',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/reorderPoint/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/reorderPoint/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/reorderPoint/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
