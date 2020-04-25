(function() {
  'use strict';

  angular
    .module('utn')
      .controller('AboutUsController', AboutUsController);

  /** @ngInject */
    function AboutUsController(authenticationService) {
      var vm = this;
      vm.loading = false;
      vm.submitAttempt = false;
      vm.showPhoto = showPhoto;

      vm.fundation = 1990;

      vm.mision = "Contribuir a la movilidad sostenible de las personas y los bienes, haciendo" + 
      "accesibles las marcas más prestigiadas de neumáticos. Agregaremos valor para nuestros clientes," +
      "accionistas y colaboradores.";

      vm.vision = "Nuestra herencia y presente, nos propone ser una organización con una visión global" +
      "y al futuro, con valores centrados en el ser humano y crecimiento sostenible impulsado por nuestros" + 
      "colaboradores, accionistas y socios de negocio.";

      vm.warehouses = "San Pedro, Guápiles, Liberia, Heredia, Agua Zarcas, Avenida 10, y Cartago";
      
      vm.ubication = "Emotion está ubicado en varias partes de Centroamérica como los son Colombia, Guatemala,"+ 
      "el Salvador y Perú.";

      function init() {
        loadUserInfo();
      }
      init();

      function loadUserInfo(){
        vm.userInfo = authenticationService.getUserInfo();
        vm.userConected = vm.userInfo[0].user;
      }

      function showPhoto(){
        angular.element('#modalShowPhoto').modal({backdrop: 'static', keyboard: false});
      } 

    }
})();
