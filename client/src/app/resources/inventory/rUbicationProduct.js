(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUbicationProduct', function ($resource) {
      return $resource('api/ubicationProduct', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/ubicationProduct/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/ubicationProduct',
            params: {
              id: '@id'
            }
          },
          'getAllByProductIds': {
            method: 'POST',
            url: 'api/ubicationProduct/getAllByProductIds'
            //isArray: true
          },
          'findByDocOrUbicId': {
            method: 'POST',
            url: 'api/ubicationProduct/findByDocOrUbicId',
            isArray: true
          },
          'doCount': {
            method: 'POST',
            url: 'api/ubicationProduct/doCount'
          },
          'update': {
            method: 'PUT',
            url: 'api/ubicationProduct/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/ubicationProduct/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/ubicationProduct/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
