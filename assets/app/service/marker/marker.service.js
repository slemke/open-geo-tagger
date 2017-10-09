(function() {
    'use strict'

    angular.module('opendata')
        .factory('MarkerService', MarkerService);

    MarkerService.$inject = ['$http','$q','ObjectService'];

    function MarkerService($http, $q, ObjectService) {

        var service = {};

        service.GetExistingMarkers = GetExistingMarkers;
        service.SetInitialMarker = SetInitialMarker;
        service.SetNewMarker = SetNewMarker;
        service.existingMarkerObjects = [];

        return service;

    function GetExistingMarkers(callback) {

          ObjectService.GetAll().then(function successCallback(response) {

            var sequence = $q.defer();
            sequence.resolve();
            sequence = sequence.promise;

            var markers = [];

            angular.forEach(response, function(val, key) {

              service.existingMarkerObjects.push(val);

              var location = JSON.parse(val.location);

              var marker = {
                  lat: location.lat,
                  lng: location.lng,
                  id: val._id,
                  icon: {
                      iconUrl: '/static/css/images/marker-icon-2x-green.png',
                      shadowUrl: '/static/css/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                  }
              }

          markers.push(marker);

        });

        sequence = sequence.then(function() {

          callback(markers);

        });

          }).catch(function(err) {
              console.log(err);
          });


        }

        function SetInitialMarker(initialAddress, initialPosition) {

            var initialMarker = {
                lat: initialPosition.lat,
                lng: initialPosition.lng,
                message: initialAddress,
                draggable: true,
                icon: {
                    iconUrl: '/static/css/images/marker-icon-2x.png',
                    shadowUrl: '/static/css/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }
          };

          return initialMarker;

        }

        function SetNewMarker(marker) {

        }
    }

})();
