(function () {
  'use strict';

  angular
  .module('utn')
  .directive('utnModalEditJourney', utnModalEditJourney);

  /* @ngInject */
  function utnModalEditJourney() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/transport/journey/modal-edit/modal-edit-journey.html',
      controller: ModalEditJourneyController,
      controllerAs: 'mEditJourney',
      bindToController: true,
      scope:{
        selectedJourney: '='
      }
    };

    return directive;

    /** @ngInject */
    function ModalEditJourneyController(rCheckLoad,rSaleOrder, rDocument, rTypeDocument, rProduct, rCustomer, rWarehouse, SweetAlert,
      $rootScope, toastr, authenticationService, moment, utilsService, DATE_ISO_FORMAT, rVehicle) {
      var vm = this;
      vm.status = true;

      var userInfo = authenticationService.getUserInfo();
      vm.userConected = userInfo[0].user;

      vm.typeJourneyList = [{id:1, name:'Tienda'},{id:2, name:'Mayoreo'}];

      vm.dateUI = new Date()
      vm.detailSelectedIndex = -1;

      vm.journeyEdited = {status:true};
      vm.journeyEdited.productsDetailList = [];
      vm.typeDocumentList = [];

      vm.editJourney = editJourney;
      vm.createCustomer = createCustomer;
      vm.dismissModal = dismissModal;
      vm.searchProduct = searchProduct;
      vm.searchCustomer = searchCustomer;
      vm.searchWarehouse = searchWarehouse;
      vm.searchVehicle = searchVehicle;
      vm.setMaxQuantity = setMaxQuantity;

      vm.journeyEdited.warehouseDup = 0;

      vm.editDetail = editDetail;
      vm.addDetail = addDetail;
      vm.deleteDetail = deleteDetail;
      vm.cleanFormDetail = cleanFormDetail;

      vm.loadProduct = loadProduct;

      function init () {
        loadTypeJourney();
        loadCustomer();
        loadWarehouse();

        vm.journeyEdited.user = vm.userConected;
        vm.journeyEdited.productsDetailList = [];
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
        vm.journeyEdited.maxQuantity = (item.maximum)?item.maximum:'';
      }

      function journeyToEdit(){
        if(vm.selectedJourney){
          rDocument.query({id:vm.selectedJourney.id}, function(result){
            vm.journeyEdited  = result;

            vm.numberInvoice = vm.selectedJourney.Document_Detail.numberInvoice;
            vm.numberDocument = vm.selectedJourney.code;

            vm.journeyEdited.status = (vm.journeyEdited.status == 1)?true:false;

            if(vm.selectedJourney.Document_Detail.CustomerId != null){
              rCustomer.query({id: vm.selectedJourney.Document_Detail.CustomerId}, function(result){
                vm.journeyEdited.customerDup = result;
              })
            }
            // else{
            //   vm.journeyEdited.customerDup = null;
            // }
            angular.forEach(vm.typeJourneyList, function(type){
              if(type.id == vm.selectedJourney.Document_Detail.typeJourney){
                vm.journeyEdited.typeJourneyDup = type;
              }
            });

            rWarehouse.query({id:vm.selectedJourney.WarehouseId}, function(res){
              vm.journeyEdited.warehouseDup = res;
              loadProduct(vm.journeyEdited.WarehouseId);
            });

            vm.nextNumberDocument = vm.journeyEdited.code;
            vm.journeyEdited.comment = vm.journeyEdited.comment;
            vm.dateUI = moment(vm.journeyEdited.date, DATE_ISO_FORMAT).toDate();

            vm.journeyEdited.productsDetailList = [];
            angular.forEach(vm.journeyEdited.Products, function(item){
              angular.forEach(item.Ubication_Product_Lists, function(upl){
                if(upl.DocumentId == vm.selectedJourney.id){
                  var obj = {};
                  obj.product = {id:item.id, code:item.code, name:item.name};
                  obj.quantity = upl.quantity;
                  vm.journeyEdited.warehouseId = item.Document_Product_List.WarehouseId;
                  vm.journeyEdited.productsDetailList.push(obj);

                }
              });
            });

            rTypeDocument.query({id: vm.journeyEdited})

          });
        }
      }

      function loadTypeJourney(){
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
      if(vm.journeyEdited.warehouseDup != undefined){
        if(filter.search == ''){
          loadProduct(vm.journeyEdited.warehouseDup.id);
        }else{
          vm.query = {filter: filter.search, warehouseId: vm.journeyEdited.warehouseDup.id };
          rSaleOrder.getProducts(vm.query, function (result) {
            vm.productList = result.records;
          });
        }
      }
    }

    function cleanFormDetail() {
      vm.detailSelectedIndex = -1;
      vm.itemDetail = { amount: 0 };
      vm.journeyEdited.maxQuantity = '';
    }

    function editDetail(index) {
      vm.detailSelectedIndex = index;
      vm.itemDetail = {};
      var detail = {};
      vm.detailSelectedIndex = vm.journeyEdited.productsDetailList[vm.detailSelectedIndex];

      detail.product = vm.detailSelectedIndex.product;
      detail.quantity = vm.detailSelectedIndex.quantity;

      // loadProduct();
      // angular.forEach(vm.productList, function(item){
      //   if(vm.detailSelectedIndex.product.id == item.ProductId){
      //     detail.product = item;
      //   }
      // })

      // Set maxQuantity
      // vm.journeyEdited.maxQuantity = 0;
      // angular.forEach(vm.journeyEdited.Products, function(item){
      //   if(item.Document_Product_List.ProductId == detail.product.ProductId){
      //     vm.journeyEdited.maxQuantity = item.Document_Product_List.quantity;
      //   }
      // });

      // if(vm.journeyEdited.maxQuantity == 0)
      //   vm.journeyEdited.maxQuantity = parseInt(detail.product.maximum);
        vm.journeyEdited.maxQuantity = vm.detailSelectedIndex.quantity;


      vm.detailSelectedIndex = index;
      angular.copy(detail, vm.itemDetail);
    }

      function addDetail () {
        var detailToAdd = {};
        vm.addAttempt = true;
        vm.duplicate = false;

        detailToAdd.maximum = 0;
        angular.forEach(vm.journeyEdited.Products, function(item){
          if(item.Document_Product_List.ProductId == vm.itemDetail.product.id){
            detailToAdd.maximum = item.Document_Product_List.quantity;
          }
        });

        // if(detailToAdd.maximum < vm.itemDetail.quantity){
        //   toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
        //   return;
        // }

        if (vm.itemDetail.product && vm.itemDetail.quantity){
          detailToAdd.quantity = vm.itemDetail.quantity;
          detailToAdd.product = vm.itemDetail.product;


          if (vm.detailSelectedIndex === -1) {
            var arr = ['product'];
            if (!utilsService.validateDuplicateList(detailToAdd,vm.journeyEdited.productsDetailList, arr)) {
              detailToAdd.quantity = parseInt(detailToAdd.quantity);
              vm.journeyEdited.productsDetailList.push(detailToAdd);
              vm.journeyEdited.maxQuantity = '';
              vm.addAttempt = false;
            }else{
              angular.forEach(vm.journeyEdited.productsDetailList, function(item){
                if(item.product.id == detailToAdd.product.id){
                  var newQuantity = item.quantity + parseInt(detailToAdd.quantity);
                  if(detailToAdd.maximum < newQuantity){
                    toastr.error('La cantidad máxima que puede solicitar es de '+detailToAdd.maximum);
                    return;
                  }
                  else{
                    item.quantity += parseInt(detailToAdd.quantity);
                    vm.journeyEdited.maxQuantity = '';
                  }

                }
              });
              vm.addAttempt = false;
            }
          }else{
            detailToAdd.quantity = parseInt(detailToAdd.quantity);
            vm.journeyEdited.productsDetailList[vm.detailSelectedIndex] = detailToAdd;
            vm.journeyEdited.maxQuantity = '';
            vm.addAttempt = false;
          }
        }else{
          vm.addAttempt = true;
          vm.journeyEdited.maxQuantity = '';
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
              if(vm.journeyEdited.productsDetailList.length == 1){
                toastr.error('Ruta de Entrega debe contener al menos un producto')
              }
              else{
                vm.journeyEdited.productsDetailList.splice(index, 1);
              }
            }
          }
        );
      }

      function editJourney(form,isNewRequired){
        vm.loading = true;
        vm.submitAttempt = false;

        if(!form.$valid) {
          vm.loading = false;
          vm.submitAttempt = true;
          return;
        }

        vm.journeyEdited.ids = [];
        vm.journeyEdited.quantitys = [];
        angular.forEach(vm.journeyEdited.productsDetailList, function(item){
          vm.journeyEdited.ids.push(item.product.id);
          vm.journeyEdited.quantitys.push(item.quantity);
        })

        rCheckLoad.update(vm.journeyEdited, function(){
          vm.loading = true;
          vm.submitAttempt = false;
          toastr.success('Ruta de Entrega actualizada satisfactoriamente', {
            onShown: function(){
              if(isNewRequired){
                vm.loading = false;
                vm.journeyEdited = {status:true};
                form.$setPristine();
              }else{
                angular.element('#modalEditJourney').modal('hide');
              }
              $rootScope.$broadcast('journeyEdited');
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
          toastr.error("Ajuste(s):<br/>" + errorMsg, 'Error al actualizar Ruta de Entrega');
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
              angular.element('#modalEditJourney').modal('hide');
              form.$setPristine();
            }
          }
          );
        }else{
          angular.element('#modalEditJourney').modal('hide');
          form.$setPristine();
        }
      }

      angular.element('#modalEditJourney').on('shown.bs.modal', function(){
        journeyToEdit();
      });


      angular.element('#modalEditJourney').on('show.bs.modal', function () {
        vm.loading = false;
        vm.submitAttempt = false;
        vm.addAttempt = false;
        vm.journeyEdited = {};
        vm.itemDetail = {};
        init();
      });

    }
  }
})();
