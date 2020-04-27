(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rGeneralRegister', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/generalRegister', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/generalRegister/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/generalRegister',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/generalRegister/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/generalRegister/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/generalRegister/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();