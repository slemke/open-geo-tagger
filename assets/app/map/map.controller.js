(function() {
    'use strict'

    angular.module('opendata.map')
        .controller('MapController', MapController);

    MapController.$inject = [
        '$scope',
        '$http',
        '$compile',
        '$q',
        '$timeout',
        'leafletData',
        'PointsService',
        'ObjectService',
        'MarkerService',
        'LocationService'
    ];

    function MapController($scope, $http, $compile, $q,$timeout, leafletData, PointsService, ObjectService, MarkerService, LocationService) {

        var vm = this;

        vm.showMap = false;
        vm.points = 0;

        // init map controller
        (function initController() {

            LocationService.getPosition(function(position) {
                vm.showMap = true;

/*                $timeout( function(){
                  MarkerService.markers["initialMarker"].focus = true;
              }, 1500 );*/
            });

/*
            LocationService.GetMap(function(map) {

                MarkerService.GetExistingMarkers();

                vm.position = LocationService.GetCurrentAddress();
            });*/


            $scope.$on('leafletDirectiveMarker.click', function(event, marker) {

                MarkerService.GetMarkerInfo(event, marker);

            });

        })();
    }
})();
