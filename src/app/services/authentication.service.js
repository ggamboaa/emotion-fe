(function () {
  'use strict';

  angular
  .module('utn')
  .factory('authenticationService', authenticationService);

  function authenticationService($q, $http, $state, $window, rUser, rEmployee) {
    var loginInfo,
      isUserloggedIn = false,
      loggedUserInfo = null,
      loggedOutCalled = false;
      
    var credentials = {
      //grantType: 'password',
      user: '',
      password: ''
      //clientId: 'siat-trusted-client',
      //clientSecret: 'secret'
    };

    /*var extendTokenCredentials = {
      grantType: 'token',
      clientId: 'siat-trusted-client',
      clientSecret: 'secret',
      token: ''
    };*/

    function login(_credentials) {
      var deferred = $q.defer();

      if(_credentials.userName && _credentials.password){
        credentials.user = _credentials.userName;
        credentials.password = _credentials.password;
      }

      rUser.login(credentials, function(result){
        if(result.length){
          loggedUserInfo  = result;
          loggedUserInfo.permissions = [];
          loggedUserInfo.warehouseList = [];

          rEmployee.query({id:loggedUserInfo[0].employeeId}, function(result){
            if(result.Warehouses.length > 0){
              angular.forEach(result.Warehouses, function(item){
                var warehouse = {id:item.id, code:item.code, name:item.name};
                loggedUserInfo.warehouseList.push(warehouse);
              })
            }
          });
          
          if(loggedUserInfo.length > 0){
            loginInfo = {
              userId: loggedUserInfo[0].id
            };
          
            if(loggedUserInfo[0].Rols.length > 0){
              angular.forEach(loggedUserInfo[0].Rols, function (menu) {
                loggedUserInfo.permissions.push(menu.desc);
              });
            }
          }
 
          if(loggedUserInfo.length == 1){
            isUserloggedIn = true;
            deferred.resolve(loggedUserInfo); //before: (isUserloggedIn)
          }else{
            isUserloggedIn = false;
            deferred.reject(loggedUserInfo); //before: (isUserloggedIn)
          }
        }else{
          isUserloggedIn = false;
          deferred.reject(loggedUserInfo);
        }
        
        loggedOutCalled = false;
        $window.localStorage['userInfo'] = angular.toJson(loggedUserInfo);
        $window.localStorage['loginInfo'] = angular.toJson(loginInfo);
      
      }, function (error) {
          isUserloggedIn = false;
          loggedOutCalled = true;
          deferred.reject(error);
      });

      /*$http({
        url: 'api/oauth/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
          grant_type: credentials.grantType,
          username: credentials.userName,
          password: credentials.password,
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret
        })
      })
      .then(function (result) {
          loginInfo = {
            //accessToken: result.data.access_token,
            //refreshToken: result.data.refresh_token,
            userId: result.data.user_id
            //companies: result.data.companies
          };

          $window.localStorage['loginInfo'] = angular.toJson(loginInfo);

          //$http.defaults.headers.common.Authorization = 'Bearer ' + loginInfo.accessToken;
          isUserloggedIn = true;
        },
        function (error) {
          isUserloggedIn = false;
          $http.defaults.headers.common.Authorization = '';
          loggedOutCalled = true;
          deferred.reject(error);
        });*/
      
      return deferred.promise;
    }

    function logout() {
      if (!loggedOutCalled && (loginInfo)) {
        loggedOutCalled = true;
        //rUser.logout({ companyId: loginInfo.companies[0].id }, function () {});
        isUserloggedIn = false;
        loggedUserInfo = {};
        loginInfo = {};
        //$http.defaults.headers.common.Authorization = '';
        $window.localStorage['loginInfo'] = '';
        $window.localStorage['userInfo'] = '';

        $state.go('login');
      }
    }

    function refreshUserInfo(/*user, company*/) {
      /*rUser.query({ id: (user.userId || user.id), companyId: user.company.id }, function (result) {
        loggedUserInfo = result;
        loggedUserInfo.company = company;
        $window.localStorage['userInfo'] = angular.toJson(loggedUserInfo);
      });*/
      $window.localStorage['userInfo'] = angular.toJson(loggedUserInfo);
    }

    /*function extendToken(_token) {
      var deferred = $q.defer();

      extendTokenCredentials.token = _token;

      $http({
        url: 'api/oauth/token',
        method: 'POST',
        data: $.param({
          grant_type: extendTokenCredentials.grantType,
          token: extendTokenCredentials.token,
          client_id: extendTokenCredentials.clientId,
          client_secret: extendTokenCredentials.clientSecret
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(function () {
        return deferred.promise;
      });
      return deferred.promise;
    }*/

    function checkPermissions() {
      //TODO: Check Roles or permissions
      return true;
    }

    function isLoggedIn() {
      return isUserloggedIn;
    }

    function getLoginInfo() {
      return loginInfo;
    }

    function getUserInfo() {
      return loggedUserInfo || { company: 0 };
    }

    function getAllAuthInfo() {
      return { isLoggedIn: isUserloggedIn, userInfo: loggedUserInfo }
    }

    function init() {
      if ($window.localStorage['loginInfo']) {
        loginInfo = angular.fromJson($window.localStorage['loginInfo']);
        isUserloggedIn = true;
        loggedOutCalled = false;
        //$http.defaults.headers.common.Authorization = 'Bearer ' + loginInfo.accessToken;

        if ($window.localStorage['userInfo']) {
          loggedUserInfo = angular.fromJson($window.localStorage['userInfo']);

          //NewLines
          loggedUserInfo.permissions = [];
          if(loggedUserInfo.length > 0 && loggedUserInfo[0].Rols.length > 0){
            angular.forEach(loggedUserInfo[0].Rols, function (menu) {
              loggedUserInfo.permissions.push(menu.desc);
            });
          }

          loggedUserInfo.warehouseList = [];
          if(loggedUserInfo.length > 0){
            rEmployee.query({id:loggedUserInfo[0].employeeId}, function(result){
              if(result.Warehouses.length > 0){
                angular.forEach(result.Warehouses, function(item){
                  var warehouse = {id:item.id, code:item.code, name:item.name};
                  loggedUserInfo.warehouseList.push(warehouse);
                })
              }
            });
          }

        } else { 
          rUser.query({ id: loginInfo.userId }, function(result){
            loggedUserInfo = result;

            //NewLines
            loggedUserInfo.permissions = [];
            if(loggedUserInfo.length > 0 && loggedUserInfo.Rols.length > 0){
              angular.forEach(loggedUserInfo.Rols, function (menu) {
                loggedUserInfo.permissions.push(menu.desc);
              });
            }

            loggedUserInfo.warehouseList = [];
            rEmployee.query({id:loggedUserInfo[0].employeeId}, function(result){
              if(result.Warehouses.length > 0){
                angular.forEach(result.Warehouses, function(item){
                  var warehouse = {id:item.id, code:item.code, name:item.name};
                  loggedUserInfo.warehouseList.push(warehouse);
                })
              }
            });

          });
        }
        $window.localStorage['userInfo'] = angular.toJson(loggedUserInfo);

      } else {
        isUserloggedIn = false;
      }
    } 

    init();


    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      getLoginInfo: getLoginInfo,
      getUserInfo: getUserInfo,
      refreshUserInfo: refreshUserInfo,
      getAllAuthInfo: getAllAuthInfo,
      checkPermissions: checkPermissions
      //extendToken: extendToken
    };
  }
})();
