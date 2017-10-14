(function() {
    'use strict'

    angular.module('opendata.objects')
        .controller('SubmitController', SubmitController);

    SubmitController.$inject = [
        'UserService',
        'ThemesService',
        'MapService',
        'ObjectService',
        'MarkerService'
    ];

    function SubmitController(UserService, ThemesService, MapService, ObjectService, MarkerService) {
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
                vm.selectedTheme = vm.themes[0]._id;

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

        vm.addObject = function() {
            vm.disabled = true;

            ObjectService.post(vm.form)
                .then(function successCallback(response) {
                    console.log(response);
                //MarkerService.SetUserMarker(MapService.GetCurrentGeoPosition(),MapService.GetCurrentAddress(),response._id);

            }).catch(function(err) {
                console.log(err);
            });
        };
    }
})();
