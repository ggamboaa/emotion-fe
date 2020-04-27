(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rJourney', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/journey', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/journey/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/journey',
            params: {
              id: '@id'
            }
          }
          // 'update': {
          //   method: 'PUT',
          //   url: 'https://emotion-be.herokuapp.com/journey/:id',
          //   params: {
          //     id: '@id'
          //   }
          // }
          // // ,
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
