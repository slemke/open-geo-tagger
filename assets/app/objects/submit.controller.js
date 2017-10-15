(function() {
    'use strict'

    angular.module('opendata.objects')
        .controller('SubmitController', SubmitController);

    SubmitController.$inject = [
      '$scope',
        'UserService',
        'ThemesService',
        'MapService',
        'ObjectService',
        'MarkerService'
    ];

    function SubmitController($scope, UserService, ThemesService, MapService, ObjectService, MarkerService) {
        var vm = this;
        vm.form = {};
        vm.disabled = false;

        (function initController() {

            // get userID
            vm.form.userID = UserService.getCurrentUser()._id;

            // get themes for list
            ThemesService.get()
                .then(function successCallback(response) {



                vm.themes = response;
                vm.form.themeID = vm.themes[0]._id;

            }).catch(function(err) {
                console.log(err);
            });

            // get current position
            MapService.getCurrentPosition(function(position) {
                vm.position = position;
                vm.form.location = position.latlng;
                vm.form.address = position.address.Match_addr;
            });
        })();

        $scope.$on('leafletDirectiveMap.locationfound', function(event, marker) {
          MapService.getCurrentPosition(function(position) {
              vm.position = position;
              vm.form.location = position.latlng;
              vm.form.address = position.address.Match_addr;
          });

  });

        vm.addObject = function() {


            vm.disabled = true;

            ObjectService.post(vm.form)
                .then(function successCallback(object) {

                    // clear form data
                    vm.clear();

                    // add marker to map
                    MapService.addMarker(object);

                    // close modal
                    angular.element('#modal_object').modal('hide');

            }).catch(function(err) {
                console.log(err);
            });
        };

        vm.clear = function() {
            vm.form.position = undefined;
            vm.form.location = undefined;
            vm.form.address = undefined;
            vm.form.description = undefined;
            vm.form.categories = undefined;
            vm.form.themeID = vm.themes[0]._id;
        };
    }
})();
