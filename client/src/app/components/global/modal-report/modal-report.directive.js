(function () {
  'use strict';

  angular
    .module('utn')
    .directive('utnModalReport', utnModalReport);

  /* @ngInject */
  function utnModalReport() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/global/modal-report/modal-report.html',
      controller: ModalReportController,
      controllerAs: 'mReport',
      bindToController: true,
      scope:{
        params:'='
      }
    };

    return directive;

    /* @ngInject */
    function ModalReportController($timeout, $log/*authenticationService, REPORTS_PATH, $sce, $timeout, $log, rPrint, toastr, $window*/) {
      var vm = this;
        // baseUrl = REPORTS_PATH.base,
        // viewer = REPORTS_PATH.viewer,
        // reportRoot = REPORTS_PATH.reportRoot,
        // tailUrl = REPORTS_PATH.tail,
        //reportUrl = '';

        vm.printServiceList = [];
        vm.showModal = false;
        // vm.print = print;
        // vm.url = '';

      function init() {
        //getReport();
      }

      angular.element('#modalReport').on('shown.bs.modal', function () {
        $timeout(function(){
          vm.showModal = false;
          $log.info('init');
          init();
        },10);
      });

      angular.element('#modalReport').on('hidden.bs.modal', function () {
        vm.showReport = false;
        vm.show = false;
        vm.printServiceList = [];
        vm.defaultPrint = false;
        vm.showModal = false;
        angular.element('#modalReportContent').removeClass('modal-xs');
        angular.element('#modalReportContent').removeClass('modal-xl');

        /**
         * Fix scroll error when using multiple modals
         */
        if (angular.element('.modal').hasClass('in')) {
          angular.element('body').addClass('modal-open');
        }

      });


    }
  }

})();
