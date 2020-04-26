(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUbicationProduct', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/ubicationProduct', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct',
            params: {
              id: '@id'
            }
          },
          'getAllByProductIds': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/getAllByProductIds'
            //isArray: true
          },
          'findByDocOrUbicId': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/findByDocOrUbicId',
            isArray: true
          },
          'doCount': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/doCount'
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/:id',
            params: {
              id: '@id'
            }
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/ubicationProduct/changeStatus/:id',
            params: {
              id: '@id'
            }
          }
        });
    });
})();
