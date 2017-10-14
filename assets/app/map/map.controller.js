(function() {
    'use strict'

    angular.module('opendata.map')
        .controller('MapController', MapController);

    MapController.$inject = [
        'PointsService',
        'ObjectService',
        'MarkerService',
        'MapService',
        'UserService'
    ];

    function MapController(PointsService, ObjectService, MarkerService, MapService, UserService) {

        var vm = this;

        vm.showMap = false;
        vm.points = 0;

        var user = UserService.getCurrentUser();

        // init map controller
        (function initController() {

            // TODO Error view
            MapService.setInitalLocation(function(position) {
                UserService.get(user._id).then(function(data) {
                    vm.points = data[0].points;
                    vm.showMap = true;
                });
            });
        })();


        vm.getTagData = function getTagData() {
            console.log('data');
        }
    }
})();
