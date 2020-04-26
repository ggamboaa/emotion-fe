(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rDocument', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/document', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/document/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/document',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/document/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/document/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/document/changeStatus/:id',
            params: {
              id: '@id'
            }
          },
          'close': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/document/close',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
