(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rReservation', function ($resource) {
      return $resource('api/reservation', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/reservation/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/reservation',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/reservation/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/reservation/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/reservation/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
