(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rCheckLoad', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/checkLoad', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/checkLoad/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          // ,
          // 'save': {
          //   method: 'POST',
          //   url: 'https://emotion-be.herokuapp.com/adminVehicle',
          //   params: {
          //     id: '@id'
          //   }
          // },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/checkLoad/:id',
            params: {
              id: '@id'
            }
          }
          // ,
          // 'delete': {
          //   method: 'DELETE',
          //   url: 'https://emotion-be.herokuapp.com/adminVehicle/:id',
          //   params: {
          //     id: '@id'
          //   }
          // },
          // 'changeStatus': {
          //   method: 'PUT',
          //   url: 'https://emotion-be.herokuapp.com/adminVehicle/changeStatus/:id',
          //   params: {
          //     id: '@id'
          //   }
          // }
        });
    });
})();
