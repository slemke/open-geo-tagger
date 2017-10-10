(function() {
    'use strict'

    angular.module('opendata')
        .factory('LocationService', LocationService);

    LocationService.$inject = ['$rootScope','MarkerService','leafletData'];

    function LocationService($rootScope, MarkerService, leafletData) {

        var service = {};

        service.currentGeoPosition = null;
        service.currentAddress = null;
        service.GetCurrentGeoPositionAccurancy = GetCurrentGeoPositionAccurancy;
        service.GetCurrentGeoPositionRadius = GetCurrentGeoPositionRadius;
        service.GetCurrentGeoPosition = GetCurrentGeoPosition;
        service.GetCurrentAddress = GetCurrentAddress;
        service.SetCurrentGeoPosition = SetCurrentGeoPosition;
        service.SetCurrentGeoPositionAccurancy = SetCurrentGeoPositionAccurancy;
        service.SetCurrentGeoPositionRadius = SetCurrentGeoPositionRadius;
        service.SetCurrentAddress = SetCurrentAddress;
        service.GetMap = GetMap;

        return service;

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

          var geocodeService = L.esri.Geocoding.geocodeService();

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


          leafletData.getMap().then(function(map) {

              map.locate({
                   watch: true,
                  setView: true,
                  maxZoom: 18
              }).once('locationfound', function(e) {

                  geocodeService.reverse().latlng(e.latlng).run(function(error, result) {

                    service.SetCurrentGeoPosition(e.latlng);
                    service.SetCurrentAddress(result.address.Match_addr);

                    service.initialMarker = MarkerService.SetInitialMarker(service.GetCurrentAddress(), service.GetCurrentGeoPosition());
                    callback(map);
                  });
               })
              .on('locationfound', function(e) {

                  service.SetCurrentGeoPositionAccurancy(e.accurancy);
                  service.SetCurrentGeoPositionRadius(e.accurancy / 2);

                $rootScope.geoPosition = service.SetCurrentGeoPosition(e.latlng);

                  geocodeService.reverse().latlng(service.currentGeoPosition).run(function(error, result) {

                      if(result) {
                        $rootScope.position = service.SetCurrentAddress(result.address.Match_addr);
                      }

                        });

              });

        })

    }
  }

})();
