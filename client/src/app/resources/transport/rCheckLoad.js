(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rCheckLoad', function ($resource) {
      return $resource('api/checkLoad', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/checkLoad/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          // ,
          // 'save': {
          //   method: 'POST',
          //   url: 'api/adminVehicle',
          //   params: {
          //     id: '@id'
          //   }
          // },
          'update': {
            method: 'PUT',
            url: 'api/checkLoad/:id',
            params: {
              id: '@id'
            }
          }
          // ,
          // 'delete': {
          //   method: 'DELETE',
          //   url: 'api/adminVehicle/:id',
          //   params: {
          //     id: '@id'
          //   }
          // },
          // 'changeStatus': {
          //   method: 'PUT',
          //   url: 'api/adminVehicle/changeStatus/:id',
          //   params: {
          //     id: '@id'
          //   }
          // }
        });
    });
})();
