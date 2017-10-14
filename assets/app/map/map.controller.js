(function() {
    'use strict'

    angular.module('opendata.map')
        .controller('MapController', MapController);

    MapController.$inject = [
        'PointsService',
        'ObjectService',
        'MarkerService',
        'MapService'
    ];

    function MapController(PointsService, ObjectService, MarkerService, MapService) {

        var vm = this;

        vm.showMap = false;
        vm.points = 0;

        // init map controller
        (function initController() {

            // TODO Error view
            MapService.setInitalLocation(function(position) {
                vm.showMap = true;
            });

        })();


        vm.getTagData = function getTagData() {
            console.log('data');
        }
    }
})();
