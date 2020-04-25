     (function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUser', function ($resource) {
      return $resource('https://emotion-be.herokuapp.com/user', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/user/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/user',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/user/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'https://emotion-be.herokuapp.com/user/:id',
            params: {
              id: '@id'
            }
          },
          'login': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/user/login',
            isArray: true
          },
          'changeStatus': {
            method: 'PUT',
            url: 'https://emotion-be.herokuapp.com/user/changeStatus/:id',
            params: {
              id: '@id'
            }
          },
          'changePassword': {
            method: 'PATCH',
            url: 'https://emotion-be.herokuapp.com/user/me',
            params: {
              id: '@id'
            }
          },
          'logout': {
            method: 'POST',
            url: 'https://emotion-be.herokuapp.com/user/me/logout',
            params: {
            }
          }
          /*'changeState': {
            method: 'PATCH',
            url:'https://emotion-be.herokuapp.com/companies/:companyId/admin/users/:id',
            params:{
              id:'@id',
              companyId:'@companyId'
            }
          },
          'getOrgUsers': {
            method: 'GET',
            isArray: true,
            url: 'https://emotion-be.herokuapp.com/companies/:companyId/admin/users/:id/organizationusers',
            params:{
              id: '@id',
              companyId: '@companyId'
            }
          },
          'getUserRoles': {
            method: 'GET',
            isArray: true,
            url: 'https://emotion-be.herokuapp.com/companies/:companyId/admin/users/:id/roleusers',
            params:{
              id: '@id',
              companyId: '@companyId'
            }
          },
          'activeUsers': {
            method: 'GET',
            url: 'https://emotion-be.herokuapp.com/companies/:companyId/admin/users/activeusers',
            params:{
              companyId:'@companyId'
            },
            isArray: true
          }*/
        });
    });
})();
