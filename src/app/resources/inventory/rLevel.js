(function () {
  'use strict';

  angular
    .module('utn')
    .factory('rLevel', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/level', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/level/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          }
        });
    });
})();
