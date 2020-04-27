(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rCustomer', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/customer', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/customer/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/customer/:id',
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/customer',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/customer/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/customer/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
