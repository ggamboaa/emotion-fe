(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rRol', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/rol', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/rol/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/rol',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/rol/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/rol/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/rol/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
