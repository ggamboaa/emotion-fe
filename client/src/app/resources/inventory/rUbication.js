(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUbication', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/ubication', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/ubication/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'findByWarehouseId': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/ubication/findByWarehouseId/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/ubication',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/ubication/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/ubication/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
