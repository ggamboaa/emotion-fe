(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rSpeedRating', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/speedRating', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/speedRating/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
