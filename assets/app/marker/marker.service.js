(function() {
    'use strict'

    angular.module('opendata.marker')
        .factory('MarkerService', MarkerService);

    MarkerService.$inject = [
        '$http',
        '$q',
        '$compile',
        '$rootScope',
        'leafletData',
        'ObjectService'
    ];

    function MarkerService($http, $q, $compile, $rootScope, leafletData, ObjectService) {

        var service = {};

        service.GetExistingMarkers = GetExistingMarkers;
        service.SetInitialMarker = SetInitialMarker;
        service.SetUserMarker = SetUserMarker;
        service.GetMarkerInfo = GetMarkerInfo;
        service.GetCurrentMarkerObjectID = GetCurrentMarkerObjectID;
        service.BindPopupToMarker = BindPopupToMarker;
        service.currentMarkerObjectID = null;
        service.markers = {};
        service.existingMarkerObjects = [];

        return service;

        function BindPopupToMarker(id, markerAddress) {

          leafletData.getMarkers().then(function(markers) {

              angular.forEach(markers, function(currentMarker) {

                  if (currentMarker.options.id == id) {

                    service.currentMarkerObjectID = id;

                      var popupContent = "<div>" + markerAddress + "<br><img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/><br> <button type='button' id='popup_link' class='btn btn-default' data-toggle='modal' href='#modal_objectDetail'>Weitere Informationen</button></div>";

                      // Compile title DOM into a link function
                      var linkFn = $compile(angular.element(popupContent));

                      // Return a jQuery DOM tree fully controlled by AngularJS so that ng directives will work
                      var popup = linkFn($rootScope)[0];


                      currentMarker.bindPopup(popup).openPopup();

                  }
              });
          });
        }

        function GetMarkerInfo(event, marker) {

         angular.forEach(service.existingMarkerObjects, function(val) {

         if(val._id == marker.leafletEvent.target.options.id) {

         leafletData.getMarkers().then(function(markers) {

             angular.forEach(markers, function(currentMarker) {

                 if (currentMarker.options.id == marker.leafletEvent.target.options.id) {

               var geocodeService = L.esri.Geocoding.geocodeService();

                 geocodeService.reverse().latlng(marker.leafletEvent.target._latlng).run(function(error, result) {

                     var markerAddress = result.address.Match_addr;

                   service.BindPopupToMarker(marker.leafletEvent.target.options.id, markerAddress);


                 });
             }
           });

       });

     } else {

       console.log("BindPopupToMarker compilet in den rootScope, deshalb übernimmt der initialMarker auch das geänderte Popup. Der initialMarker muss aber weiterhin nur die Adresse anzeigen, ohne Bild oder Zusatzinformationen throwError=random variable die angular nicht findet, verhindert das compiling");
      // throwError = yes

     }

     });

     }

        function GetCurrentMarkerObjectID() {
          return service.currentMarkerObjectID;
        }

    function GetExistingMarkers(callback) {

          ObjectService.GetAll().then(function successCallback(response) {

            angular.forEach(response, function(val, key) {

              service.existingMarkerObjects.push(val);

              var location = val.location[0];

              var geocodeService = L.esri.Geocoding.geocodeService();

            geocodeService.reverse().latlng(location).run(function(error, result) {

              var markerAddress = result.address.Match_addr;

              var marker = {
                  lat: val.location[0].lat,
                  lng: val.location[0].lng,
                  message: "<div>" + markerAddress + "<br><img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/><br> <button type='button' id='popup_link' class='btn btn-default' data-toggle='modal' href='#modal_objectDetail'>Weitere Informationen</button></div>",
                  focus: false,
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

          service.markers["marker"+key] = marker;

        });

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

          service.markers["initialMarker"] = initialMarker;

        }

        function SetUserMarker(newPosition, newAddress, id) {

          var marker = {
              lat: newPosition.lat,
              lng: newPosition.lng,
              draggable: false,
              message: '<div>' + newAddress + '<br><img id="markerImage" src="https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg"/><br><a href="" id="popup_link" ng-click="getMarkerObject();openMarkerInfo()" target="self">Weitere Informationen</a></div>',
              focus: true,
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

        service.markers["userMarker"+service.existingMarkerObjects.length] = marker;

        }

      }

})();
