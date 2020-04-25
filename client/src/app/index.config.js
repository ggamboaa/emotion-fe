(function() {
  'use strict';

  angular
    .module('utn')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $httpProvider, KeepaliveProvider, IdleProvider, TitleProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // HTTP Interceptor
    $httpProvider.interceptors.push('authHttpResponseInterceptor');

    // Set Toastr options
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.progressBar = true;

    //Idle Config
    TitleProvider.enabled(false);

    IdleProvider.idle(14400);
    IdleProvider.timeout(120);
    KeepaliveProvider.interval(180);
  }

})();
