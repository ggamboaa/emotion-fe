(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditStore', utnModalEditStore);

  /* @ngInject */
  function utnModalEditStore() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/inventory/store/modal-edit/modal-edit-store.html',
      controller: ModalEditStoreController,
      controllerAs: 'mEditStore',
      bindToController: true,
      scope:{
        selectedItem: '='
      }

    };

    return directive;

    /** @ngInject */
    function ModalEditStoreController(rDocument, rStore, rProduct, rUbication, rUbicationProduct, SweetAlert, $rootScope, toastr, authenticationService, moment, DATE_ISO_FORMAT) {
      var vm = this;
      vm.status = true;
      vm.changeButton = true;
      vm.storeEdited = {status:true};

      var userInfo = authenticationService.getUserInfo();
      if(userInfo.length > 0){
        vm.userConected = userInfo[0];
      }

      vm.dateUI = new Date();
      vm.storeEdited = {};
      vm.storeEdited.productsDetailList = [];

      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.loadUbication = loadUbication;
      vm.searchUbication = searchUbication;

      vm.editDetail = editDetail;
      vm.deleteDetail = deleteDetail;
      vm.detailSelectedIndex = -1;

      vm.changeDetail = changeDetail;
      vm.verifyQuantity = verifyQuantity;

      function init () {
        vm.storeEdited.status = true;
        vm.warehouse = userInfo[0].warehouseSelected;
        loadProduct();
        loadUbication();
      }
      init();

      function storeToEdit(){
        if(vm.selectedItem){

          if(vm.selectedItem.showMe){
            vm.showMe = true;
            
            rDocument.query({id:vm.selectedItem.id}, function(result){
              vm.storeEdited  = result;

              vm.storeEdited.productsDetailList = [];

              vm.dateUI = moment(vm.storeEdited.date, DATE_ISO_FORMAT).toDate();
              vm.storeEdited.number = vm.storeEdited.id;

              vm.query = {id:vm.selectedItem.id, docOrUb:true};
              rUbicationProduct.findByDocOrUbicId(vm.query, function(resUbicProduct){
                vm.storeList  = resUbicProduct;

                angular.forEach(vm.storeList, function(item){
                  var obj = {DocumentId:item.DocumentId, quantity:item.quantity, status:item.status, user:item.user}

                  rProduct.query({id:item.ProductId}, function(resProduct){
                    obj.product = {id:resProduct.id, code:resProduct.code, name:resProduct.name}
                  }, function () {
                    toastr.error('Error al obtener los datos de Producto.');
                  });

                  rUbication.query({id:item.UbicationId}, function(resUbication){
                    obj.ubication = {id:resUbication.id, ubicationName:resUbication.ubicationName};
                  }, function () {
                    toastr.error('Error al obtener los datos de Ubicaciones.');
                  });

                  vm.storeEdited.productsDetailList.push(obj);
                  
                  });
              }, function () {
                toastr.error('Error al obtener datos.');
              });
            });
          }else{
            vm.showMe = false;

            vm.storeEdited.productsDetailList = [];

            vm.query = {id:vm.selectedItem.UbicationId, docOrUb:false};
            rUbicationProduct.findByDocOrUbicId(vm.query, function(resUbicProduct){
              vm.storeList  = resUbicProduct;

              angular.forEach(vm.storeList, function(item){

                var obj = {DocumentId:item.DocumentId, quantity:item.quantity, status:item.status, user:item.user}

                rProduct.query({id:item.ProductId}, function(resProduct){
                  obj.product = {id:resProduct.id, code:resProduct.code, name:resProduct.name}
                }, function () {
                  toastr.error('Error al obtener los datos de Producto.');
                });

                rUbication.query({id:item.UbicationId}, function(resUbication){
                  obj.ubication = {id:resUbication.id, ubicationName:resUbication.ubicationName};
                }, function () {
                  toastr.error('Error al obtener los datos de Ubicaciones.');
                });

                vm.storeEdited.productsDetailList.push(obj);
                
                });
            }, function () {
              toastr.error('Error al obtener datos.');
            });
          }
        }
      }

      function loadProduct(){
        rProduct.query(function(result){
          vm.productList  = result.records;
        });
      }

      function searchProduct(filter){
        if(filter.search == ''){
          loadProduct();
        }else{
          vm.query = {filter: filter.search};
          rProduct.query(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }

      function loadUbication(){
        var pStatus = 1;
        var pFilter = null;
        if(vm.damage == true){
          pFilter = 'RVPVLV';
          pStatus = 0;
        }
        if(vm.warehouse){
          rUbication.findByWarehouseId({id: vm.warehouse.id, status: pStatus, filter: pFilter}, function(result){
            vm.ubicationList  = result.records;
          });
        }
      }

      function searchUbication(filter){
        if(filter.search == '' && vm.warehouse){
          loadUbication();
        }else{
          var pStatus = 1;
          if(vm.damage == true){
            filter.search = 'RVPVLV';
            pStatus = 0;
          }
          vm.query = {id: vm.warehouse.id, status: pStatus, filter: filter.search};
          rUbication.findByWarehouseId(vm.query, function (result) {
            vm.ubicationList = result.records;
          });
        }
      }

      function editDetail(index) {
        vm.changeButton = false; 
        vm.detailSelectedIndex = index;
        vm.itemDetail = {};
        angular.copy(vm.storeEdited.productsDetailList[vm.detailSelectedIndex], vm.itemDetail);
        vm.itemDetail.newQuantity = vm.storeEdited.productsDetailList[vm.detailSelectedIndex].quantity;
      }

      function deleteDetail (index) {
        SweetAlert.swal({
            title:'',
            text: '¿Desea eliminar el registro de la lista?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              vm.storeEdited.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function changeDetail(){
        vm.loading = true;
        vm.addAttempt = true;

        if(!vm.itemDetail.product || !vm.itemDetail.newUbication || !vm.itemDetail.quantity
          || (vm.itemDetail.quantity < vm.itemDetail.newQuantity)) {
          vm.loading = false;
          vm.addAttempt = true;
          return;
        }

        if(vm.selectedItem.showMe){
          vm.itemDetail.showMe = vm.selectedItem.showMe;
        }else{
          if(vm.itemDetail.ubication.id == vm.itemDetail.newUbication.id){
            toastr.error("Ubicación elegida (Nueva Ubicación) es igual a la Actual. Verifíque!", 'Error al realizar Reubicación');
            return;
          }
        }

        if(vm.storeEdited.user){
          vm.itemDetail.user = vm.storeEdited.user;
        }
        
        if(vm.itemDetail.product){
          vm.itemDetail.ProductId = vm.itemDetail.product.id;
        }

        if(vm.itemDetail.newUbication){
          vm.itemDetail.UbicationId = vm.itemDetail.newUbication.id;
        }

        if(vm.warehouse){
          vm.itemDetail.WarehouseId = vm.warehouse.id;
        }

        if(vm.itemDetail.quantity >= vm.itemDetail.newQuantity){
          vm.itemDetail.oldQuantity = vm.itemDetail.quantity - vm.itemDetail.newQuantity;
          vm.itemDetail.quantity = vm.itemDetail.newQuantity;
        }
        
        vm.itemDetail.status = 1;
        
        rUbicationProduct.save(vm.itemDetail, function(){
          vm.loading = true;
          if(vm.showMe){
            toastr.success('Almacenaje registrado satisfactoriamente', {
              onShown: function(){
                vm.loading = false;
                vm.addAttempt = false;
                vm.changeButton = true; 
                vm.itemDetail = {}
                storeToEdit();
              }
            });
          }else{
            toastr.success('Reubicación registrada satisfactoriamente', {
              onShown: function(){
                vm.loading = false;
                vm.addAttempt = false;
                vm.changeButton = true; 
                vm.itemDetail = {}
                storeToEdit();
              }
            });
          }
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          vm.addAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          if(vm.showMe){
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al realizar Almacenaje');
          }else{
            toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al realizar Reubicación');
          }
        });
      }

      function verifyQuantity(){
        if(vm.itemDetail.newQuantity > vm.itemDetail.quantity){
          toastr.error("La cantidad ingresada (nueva) debe ser inferior a la disponible (actual).", 'Error al almacenar cantidad');
          vm.itemDetail.newQuantity = vm.itemDetail.quantity;
        }
      }

      function dismissModal (form){
        angular.element('#modalEditStore').modal('hide');
        form.$setPristine();
        if(vm.showMe){
          $rootScope.$broadcast('storeEdited');
        }else{
          $rootScope.$broadcast('reubicationEdited');
        }
      }

      angular.element('#modalEditStore').on('shown.bs.modal', function(){
        storeToEdit();
      });

      angular.element('#modalEditStore').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.storeEdited = {};
        vm.itemDetail = {};
        vm.storeEdited.productsDetailList = [];

        init();
      });
    }
  }
})();
