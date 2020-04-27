(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditCheckLoad', utnModalEditCheckLoad);

  /* @ngInject */
  function utnModalEditCheckLoad() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/check-load/modal-edit/modal-edit-check-load.html',
      controller: ModalEditCheckLoadController,
      controllerAs: 'mEditCheckLoad',
      bindToController: true,
      scope:{
        selectedCheckLoad: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditCheckLoadController(rCheckLoad,rSaleOrder, rDocument, rTypeDocument, rProduct, rCustomer, rWarehouse, SweetAlert,
      $rootScope, toastr, authenticationService, moment, utilsService, DATE_ISO_FORMAT, rVehicle) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;

      vm.typeCheckLoadList = [{id:1, name:'Tienda'},{id:2, name:'Mayoreo'}];

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.checkLoadEdited = {status:true};
      vm.checkLoadEdited.productsDetailList = [];
      vm.typeDocumentList = [];

      vm.editCheckLoad = editCheckLoad;
      vm.createCustomer = createCustomer;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.searchCustomer = searchCustomer;
      vm.searchWarehouse = searchWarehouse;
      vm.searchVehicle = searchVehicle;
      vm.setMaxQuantity = setMaxQuantity;

      vm.checkLoadEdited.warehouseDup = 0;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;

      vm.loadProduct = loadProduct;

      function init () {
        loadTypeCheckLoad();
        loadCustomer();
        loadWarehouse();

        vm.checkLoadEdited.user = vm.userConected;
        vm.checkLoadEdited.productsDetailList = [];
      }
      init();

      function loadVehicle(){
        rVehicle.query(function(result){
          vm.vehicleList  = result.records;
        });
      }

      function searchVehicle(filter){
        if(filter.search == ''){
          loadVehicle();
        }else{
          vm.query = {filter: filter.search};
          rVehicle.query(vm.query, function (result) {
            vm.vehicleList = result.records;
          });
        }
      }

      function createCustomer () {
        angular.element('#modalCreateCustomer').modal({backdrop: 'static', keyboard: false});
      }

      function setMaxQuantity(item){
        vm.checkLoadEdited.maxQuantity = (item.maximum)?item.maximum:'';
      }

      function checkLoadToEdit(){
        if(vm.selectedCheckLoad){
          rDocument.query({id:vm.selectedCheckLoad.id}, function(result){
            vm.checkLoadEdited  = result;

            vm.numberInvoice = vm.selectedCheckLoad.Document_Detail.numberInvoice;
            vm.numberDocument = vm.selectedCheckLoad.code;

            vm.checkLoadEdited.status = (vm.checkLoadEdited.status == 1)?true:false;

            if(vm.selectedCheckLoad.Document_Detail.CustomerId != null){
              rCustomer.query({id: vm.selectedCheckLoad.Document_Detail.CustomerId}, function(result){
                vm.checkLoadEdited.customerDup = result;
              })
            }
            angular.forEach(vm.typeCheckLoadList, function(type){
              if(type.id == vm.selectedCheckLoad.Document_Detail.typeCheckLoad){
                vm.checkLoadEdited.typeCheckLoadDup = type;
              }
            });

            rWarehouse.query({id:vm.selectedCheckLoad.WarehouseId}, function(res){
              vm.checkLoadEdited.warehouseDup = res;
              loadProduct(vm.checkLoadEdited.WarehouseId);
            });

            vm.nextNumberDocument = vm.checkLoadEdited.code;
            vm.checkLoadEdited.comment = vm.checkLoadEdited.comment;
            vm.dateUI = moment(vm.checkLoadEdited.date, DATE_ISO_FORMAT).toDate();

            vm.checkLoadEdited.productsDetailList = [];
            angular.forEach(vm.checkLoadEdited.Products, function(item){
              var obj = {};

              obj.product = {id:item.id, code:item.code, name:item.name};
              obj.quantity = item.Document_Product_List.quantity;
              vm.checkLoadEdited.warehouseId = item.Document_Product_List.WarehouseId;
              vm.checkLoadEdited.productsDetailList.push(obj);

            });

            rTypeDocument.query({id: vm.checkLoadEdited})

          });
        }
      }

      function loadTypeCheckLoad(){
        rTypeDocument.query(function(result){
          vm.typeDocumentList  = result.records;
        });
      }

      function loadWarehouse(){
        rWarehouse.query(function(result){
          vm.warehouseList  = result.records;
        });
      }

      function searchWarehouse(filter){
        if(filter.search == ''){
          loadWarehouse();
        }else{
          vm.query = {filter: filter.search};
          rWarehouse.query(vm.query, function (result) {
            vm.warehouseList = result.records;
          });
        }
      }

      function loadCustomer(){
        rCustomer.query(function(result){
          vm.customerList  = result.records;
        });
      }

      function searchCustomer(filter){
        if(filter.search == ''){
          loadCustomer();
        }else{
          vm.query = {filter: filter.search};
          rCustomer.query(vm.query, function (result) {
            vm.customerList = result.records;
          });
        }
      }

      function loadProduct(pWarehouseId){
      vm.query = {warehouseId: pWarehouseId};
      rSaleOrder.getProducts(vm.query,function(result){
        vm.productList  = result.records;
      });
    }

    function searchProduct(filter){
      if(vm.checkLoadEdited.warehouseDup != undefined){
        if(filter.search == ''){
          loadProduct(vm.checkLoadEdited.warehouseDup.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.checkLoadEdited.warehouseDup.id };
          rSaleOrder.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.checkLoadEdited.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};


      vm.detailSelectedIndex = vm.checkLoadEdited.productsDetailList[vm.detailSelectedIndex];

      detail.product = vm.detailSelectedIndex.product;
      detail.quantity = vm.detailSelectedIndex.quantity;

        vm.checkLoadEdited.maxQuantity = vm.detailSelectedIndex.quantity;


      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.maximum = 0;
        angular.forEach(vm.checkLoadEdited.Products, function(item){
          if(item.Document_Product_List.ProductId == vm.itemDetail.product.id){
            detailToAdd.maximum = item.Document_Product_List.quantity;
          }
        });


        if(detailToAdd.maximum < vm.itemDetail.quantity){
          toastr.error('La cantidad máxima son: ' + detailToAdd.maximum + ' Unidades');
          return;
        }


        if (vm.itemDetail.product && vm.itemDetail.quantity){
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product;


          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.checkLoadEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.checkLoadEdited.productsDetailList.push(detailToAdd);
              vm.checkLoadEdited.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.checkLoadEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(detailToAdd.maximum < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.checkLoadEdited.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.checkLoadEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.checkLoadEdited.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.checkLoadEdited.maxQuantity = '';
        }

        vm.detailSelectedIndex = -1;
        vm.itemDetail = { amount: 0 };
        //cleanFormDetail();
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
                vm.checkLoadEdited.productsDetailList.splice(index, 1);
            }
          }
        );
      }

      function editCheckLoad(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        vm.checkLoadEdited.ids = [];
        vm.checkLoadEdited.quantitys = [];
        angular.forEach(vm.checkLoadEdited.productsDetailList, function(item){
          vm.checkLoadEdited.ids.push(item.product.id);
          vm.checkLoadEdited.quantitys.push(item.quantity);
        })

        rCheckLoad.update(vm.checkLoadEdited, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Chequeo y Carga actualizado satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.loading = false;
                vm.checkLoadEdited = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalEditCheckLoad').modal('hide');
              }
              $rootScope.$broadcast('checkLoadEdited');
            }
          });
        },
        function(error){
          var errorMsg = '';
          var errorNo = 0;
          vm.loading = false;
          vm.submitAttempt = false;
          angular.forEach(error.data.errors, function(item){
            errorNo++;
            errorMsg += errorNo + '-' + item.message + '<br/>';
          })
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar Chequeo y Carga');
        });
      }

      function dismissModal (form){
        if(!form.$pristine) {
          SweetAlert.swal({
            title:'',
            text: '¿Esta seguro de salir sin guardar?',
            showCancelButton: true,
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            closeOnConfirm: true,
            closeOnCancel: true,
            allowEscapeKey: false
          },
          function(isConfirm){
            if (isConfirm) {
              angular.element('#modalEditCheckLoad').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditCheckLoad').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditCheckLoad').on('shown.bs.modal', function(){
        checkLoadToEdit();
      });


      angular.element('#modalEditCheckLoad').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.checkLoadEdited = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
