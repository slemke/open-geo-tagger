(function() {
    'use strict'

    angular.module('opendata')
        .factory('LocationService', LocationService);

    LocationService.$inject = ['$rootScope','MarkerService','leafletData'];

    function LocationService($rootScope, MarkerService, leafletData) {

        var service = {};
        var geocodeService = L.esri.Geocoding.geocodeService();

        service.currentGeoPosition = null;
        service.currentAddress = null;
        service.GetCurrentGeoPositionAccurancy = GetCurrentGeoPositionAccurancy;
        service.GetCurrentGeoPositionRadius = GetCurrentGeoPositionRadius;
        service.GetCurrentGeoPosition = GetCurrentGeoPosition;
        service.GetCurrentAddress = GetCurrentAddress;
        service.SetCurrentGeoPosition = SetCurrentGeoPosition;
        service.getPosition = getPosition;
        service.SetCurrentGeoPositionAccurancy = SetCurrentGeoPositionAccurancy;
        service.SetCurrentGeoPositionRadius = SetCurrentGeoPositionRadius;
        service.SetCurrentAddress = SetCurrentAddress;
        service.GetMap = GetMap;


        (function InitService(callback) {
            angular.extend($rootScope, {
                center: {
                    lat: 50.941357,
                    lng: 6.958307,
                    zoom: 10
                },
                tiles: {
                    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
                    options: {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 18
                }
            },
                events: {}
            });

        })();

        return service;

        function getPosition(test) {

            leafletData.getMap().then(function(map) {

                // get initial location
                map.locate({
                    setView: true,
                    maxZoom: 18
                }).on('locationfound', function(e) {
                    // update location
                    geocodeService.reverse()
                        .latlng(e.latlng)
                    .run(function(error, result) {

                            test(result);
                            service.SetCurrentGeoPosition(e.latlng);
                            service.SetCurrentAddress(result.address.Match_addr);

                            service.initialMarker = MarkerService.SetInitialMarker(service.GetCurrentAddress(), service.GetCurrentGeoPosition());
                    });
                });
            });
        }

        function GetCurrentGeoPosition() {
            return service.currentGeoPosition;
        }

        function GetCurrentGeoPositionAccurancy() {
            return service.currentGeoPositionAccurancy;
        }

        function GetCurrentGeoPositionRadius() {
            return service.currentGeoPositionRadius;
        }

        function GetCurrentAddress() {
            return service.currentAddress;
        }

        function SetCurrentGeoPosition(currentGeoPosition) {
          return service.currentGeoPosition = currentGeoPosition;
        }

        function SetCurrentGeoPositionAccurancy(currentGeoPositionAccurancy) {
          return service.currentGeoPositionAccurancy = currentGeoPositionAccurancy;
        }

        function SetCurrentGeoPositionRadius(currentGeoPositionRadius) {
          return service.currentGeoPositionRadius = currentGeoPositionRadius;
        }

        function SetCurrentAddress(currentAddress) {
          return service.currentAddress = currentAddress;
        }

        function GetMap(callback) {
            return leafletData.getMap().then(callback);
        }
  }

})();
