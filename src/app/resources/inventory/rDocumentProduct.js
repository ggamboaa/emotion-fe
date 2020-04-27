(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rDocumentProduct', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/documentProduct', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/documentProduct/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/documentProduct',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/documentProduct/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/documentProduct/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/documentProduct/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
