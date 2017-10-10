(function() {
    'use strict'

    angular.module('opendata')
        .factory('MarkerService', MarkerService);

    MarkerService.$inject = ['$http','$q', '$compile', '$rootScope', 'leafletData', 'ObjectService'];

    function MarkerService($http, $q, $compile, $rootScope, leafletData, ObjectService) {

        var service = {};

        service.GetExistingMarkers = GetExistingMarkers;
        service.SetInitialMarker = SetInitialMarker;
        service.SetUserMarker = SetUserMarker;
        service.GetMarkerInfo = GetMarkerInfo;
        service.BindPopupToMarker = BindPopupToMarker;
        service.markers = [];
        service.existingMarkerObjects = [];

        return service;


        function BindPopupToMarker(id, markerAddress) {

          leafletData.getMarkers().then(function(markers) {

              angular.forEach(markers, function(currentMarker) {

                  if (currentMarker.options.id == id) {


                      var popupContent = "<div>" + markerAddress + "<br><img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/><br><a href='' id='popup_link' ng-click='getMarkerObject();openMarkerInfo()' target='self'>Weitere Informationen</a></div>";

                      // Compile title DOM into a link function
                      var linkFn = $compile(angular.element(popupContent));

                      // Return a jQuery DOM tree fully controlled by AngularJS so that ng directives will work
                      var popup = linkFn($rootScope);

                      currentMarker.bindPopup(popup[0]).openPopup();

                  }
              });
          });
        }

        function GetMarkerInfo(event, marker) {

          angular.forEach(service.existingMarkerObjects, function(val, key) {

              if(val._id == marker.leafletEvent.target.options.id) {

                var geocodeService = L.esri.Geocoding.geocodeService();

                  geocodeService.reverse().latlng(marker.leafletEvent.target._latlng).run(function(error, result) {

                      var markerAddress = result.address.Match_addr;

                    service.BindPopupToMarker(marker.leafletEvent.target.options.id, markerAddress);

                  });
                  //objectID = args.leafletEvent.target.options.id;
              };
          });

        }

    function GetExistingMarkers(callback) {

          ObjectService.GetAll().then(function successCallback(response) {

            var sequence = $q.defer();
            sequence.resolve();
            sequence = sequence.promise;

            angular.forEach(response, function(val, key) {

              service.existingMarkerObjects.push(val);

              var marker = {
                  lat: val.location[0].lat,
                  lng: val.location[0].lng,
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

          service.markers.push(marker);

        });

        sequence = sequence.then(function() {


          callback(service.markers);

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

        function SetUserMarker(newPosition, id) {

          var marker = {
              lat: newPosition.lat,
              lng: newPosition.lng,
              draggable: false,
              id: id,
              icon: {
                  iconUrl: '/static/css/images/marker-icon-2x-red.png',
                  shadowUrl: '/static/css/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
              }
        };

        service.existingMarkerObjects.push(marker);

        return marker;

        }

      }

})();
