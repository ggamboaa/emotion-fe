     (function () {
  'use strict';

  angular
    .module('utn')
    .factory('rUser', function ($resource) {
      return $resource('api/user', {
        id: '@id'
      },
        {
          'query': {
            method: 'GET',
            url: 'api/user/:id',
            //isArray: true,
            params: {
              id: '@id'
            }
          },
          'save': {
            method: 'POST',
            url: 'api/user',
            params: {
              id: '@id'
            }
          },
          'update': {
            method: 'PUT',
            url: 'api/user/:id',
            params: {
              id: '@id'
            }
          },
          'delete': {
            method: 'DELETE',
            url: 'api/user/:id',
            params: {
              id: '@id'
            }
          },
          'login': {
            method: 'POST',
            url: 'api/user/login',
            isArray: true
          },
          'changeStatus': {
            method: 'PUT',
            url: 'api/user/changeStatus/:id',
            params: {
              id: '@id'
            }
          },
          'changePassword': {
            method: 'PATCH',
            url: 'api/user/me',
            params: {
              id: '@id'
            }
          },
          'logout': {
            method: 'POST',
            url: 'api/user/me/logout',
            params: {
            }
          }
          /*'changeState': {
            method: 'PATCH',
            url:'api/companies/:companyId/admin/users/:id',
            params:{
              id:'@id',
              companyId:'@companyId'
            }
          },
          'getOrgUsers': {
            method: 'GET',
            isArray: true,
            url: 'api/companies/:companyId/admin/users/:id/organizationusers',
            params:{
              id: '@id',
              companyId: '@companyId'
            }
          },
          'getUserRoles': {
            method: 'GET',
            isArray: true,
            url: 'api/companies/:companyId/admin/users/:id/roleusers',
            params:{
              id: '@id',
              companyId: '@companyId'
            }
          },
          'activeUsers': {
            method: 'GET',
            url: 'api/companies/:companyId/admin/users/activeusers',
            params:{
              companyId:'@companyId'
            },
            isArray: true
          }*/
        });
    });
})();
