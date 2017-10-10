(function() {

    app.controller('MapController',
        [
            '$scope',
            '$http',
            '$compile',
            '$q',
            '$timeout',
            'leafletData',
            'PointsService',
            'ObjectService',
            'MarkerService',
            'LocationService',
            MapController
        ]);

    function MapController($scope, $http, $compile, $q,$timeout, leafletData, PointsService, ObjectService, MarkerService, LocationService) {

        var vm = this;


        vm.markers = MarkerService.markers;
        vm.showMap = false;
        vm.points = 0;

        // init map controller
        (function initController() {


        LocationService.GetMap(function(map) {

          vm.showMap = true;

          MarkerService.GetExistingMarkers();

          MarkerService.SetInitialMarker(LocationService.GetCurrentAddress(), LocationService.GetCurrentGeoPosition());

      vm.position = LocationService.GetCurrentAddress();

      map.setView(LocationService.GetCurrentGeoPosition());

        $timeout( function(){
          MarkerService.markers["initialMarker"].focus = true;
        }, 500 );

    });


    $scope.$on('leafletDirectiveMarker.click', function(event, marker) {

      MarkerService.GetMarkerInfo(event, marker);

    });

        })();

        vm.showRating = function() {
            console.log('rating');
        };
    }
})();


/*
app.controller('MapController', ['$scope', '$http', '$compile', '$q', 'leafletData', 'ngDialog', function($scope, $http, $compile, $q, leafletData, ngDialog) {

    $scope.form = {};
    $scope.FormData = {newDescription:'',objectTheme:'',newCategories:'',file:''};
    // initiale Position des Users in Geokoordinaten
    var initialPosition = {};
    // initiale Adresse des Users als String
    var initialAddress = null;

    var currentAddress = null;
    // aktuelle Position wenn der Marker verschoben wurde
    var currentPosition = {};
    // Geocoding Plugin
    var geocodeService = L.esri.Geocoding.geocodeService();
    // maximaler Abstand zwischen zwei Markern damit das Voting noch funktioniert
    var maxRadiusForVoting = 200;
    // Genauigkeit der erfassten Position
    var accurancy = null;
    // Die ID eines zu einem Marker gehörenden Objektes in der Datenbank
    var objectID = null;

    var editObjectPosition = {};

    var existingMarkerObjects = [];

    $scope.markers = [];

    angular.extend($scope, {
        tiles: {
            url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
            options: {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }
        },
        events: {}
    });
/*
    getExistingMarkers = function() {
        $http({
            method: 'GET',
            url: 'https://localhost:3000/objects/'
        }).then(function successCallback(response) {

            angular.forEach(response.data, function(val, key) {

                existingMarkerObjects.push(val);

                var location = JSON.parse(val.location);

                geocodeService.reverse().latlng(location).run(function(error, result) {

                    var markerAddress = result.address.Match_addr;

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

                    $scope.markers.push(marker);

                });
            });
        }).catch(function(err) {
            console.log(err);
        });
    }

    getExistingMarkers();

    leafletData.getMap().then(function(map) {

        map.locate({
            setView: true,
            maxZoom: 18
        }).on('locationfound', function(e) {

            var accurancy = e.accurancy;
            var radius = e.accuracy / 2;

            // aktuelle Position auf die gefundene Position setzen
            currentPosition = e.latlng;

            // initiale Position auf die gefundene Position setzen
            initialPosition = e.latlng;

            geocodeService.reverse().latlng(initialPosition).run(function(error, result) {

                // initiale Adresse durch Geocoding
                initialAddress = result.address.Match_addr;
                currentAddress = initialAddress;
                $scope.myposition = initialAddress;

                $scope.markers.push({
                    lat: initialPosition.lat,
                    lng: initialPosition.lng,
                    message: initialAddress,
                    focus: true,
                    draggable: true,
                    icon: {
                        iconUrl: '/static/css/images/marker-icon-2x.png',
                        shadowUrl: '/static/css/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    }
                });

                map.setView(currentPosition);
            });
        });
    });

    $scope.$on('leafletDirectiveMarker.click', function(event, args) {

        angular.forEach(existingMarkerObjects, function(val, key) {

            if(val._id == args.leafletEvent.target.options.id) {

                geocodeService.reverse().latlng(args.leafletEvent.target._latlng).run(function(error, result) {

                    var markerAddress = result.address.Match_addr;

                    leafletData.getMarkers().then(function(markers) {

                        angular.forEach(markers, function(currentMarker) {

                            if (currentMarker.options.id == args.leafletEvent.target.options.id) {

                                var popupContent = "<div>" + markerAddress + "<br><img id='markerImage' src='https://images-na.ssl-images-amazon.com/images/I/61vWHzU8L5L._SY355_.jpg'/><br><a href='' id='popup_link' ng-click='getMarkerObject();openMarkerInfo()' target='self'>Weitere Informationen</a></div>";

                                // Compile title DOM into a link function
                                var linkFn = $compile(angular.element(popupContent));

                                // Return a jQuery DOM tree fully controlled by AngularJS so that ng directives will work
                                var popup = linkFn($scope);

                                currentMarker.bindPopup(popup[0]).openPopup();
                            }
                        });
                    });
                });
                objectID = args.leafletEvent.target.options.id;
            };
        });
    });

    var markerAddress = null;

    $scope.getAddressForMarker = function(location) {
        var deferred = $q.defer();

    geocodeService.reverse().latlng(location).run(function(error, result) {
        markerAddress = result.address.Match_addr;
        if (markerAddress != null) {
            deferred.resolve();
        }
        });

        return deferred.promise;
    }

    $scope.getMarkerObject = function() {

        $http({
            method: 'GET',
            url: 'https://localhost:3000/objects/' + objectID,
        }).then(function(object) {

            //  checkCurrentPositionDistanceToMarker();
            var objectLocation = JSON.parse(object.data[0].location);

            editObjectPosition = objectLocation;

            $scope.getAddressForMarker(objectLocation).then(function() {
                $scope.objectPosition = markerAddress;
            })

            $scope.objectCreated = new Date(object.data[0].createdAt).toLocaleString();
            $scope.objectUpdated = new Date(object.data[0].updatedAt).toLocaleString();
            $scope.objectCategories = object.data[0].categories;
            $scope.objectDescription = object.data[0].description;

            return $http({
                method: 'GET',
                url: 'https://localhost:3000/theme/' + object.data[0].themeID,
            });

        }).then(function(theme) {
            $scope.currentObjectTheme = theme.data[0].name;
        }).catch(function(err) {
            console.log(err);
        });
    }

    $scope.openMarkerInfo = function() {

        ngDialog.open({
            template: '/static/app/components/marker/markerInfo.template.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    }

    $scope.addNewMarker = function() {
        ngDialog.open({
            template: '/static/app/components/marker/newMarker.template.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    }


    $scope.openEditPopup = function() {

        ngDialog.closeAll();
        ngDialog.open({
            template: '/static/app/components/marker/markerEdit.template.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };


    $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {

        var radius = accurancy / 2;
        var marker = args.leafletEvent.target;
        var position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng), {
            draggable: 'true'
        });

        leafletData.getMap().then(function(map) {


            map.panTo(new L.LatLng(position.lat, position.lng))

            geocodeService.reverse().latlng(position).run(function(error, result) {

                currentAddress = result.address.Match_addr;
                marker.bindPopup(currentAddress).openPopup();
                $scope.myposition = currentAddress;
            });

            currentPosition = position;
        });
    });

    $scope.addNewObject = function() {
        console.log('called');

        var newObject = {};

        newObject.location = JSON.stringify(currentPosition);
        newObject.categories = $scope.FormData.newCategories;
        newObject.themeID = $scope.objectTheme._id;
        newObject.description = $scope.FormData.newDescription;
        newObject.userID = "59b7ff671d8436d6cf9be301";

        $http({
            method: 'POST',
            url: 'https://localhost:3000/objects/',
            data: newObject,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {

            ngDialog.closeAll();

            $scope.FormData.newCategories = "";
            $scope.FormData.newDescription = "";

            $scope.form.beitragForm.$setPristine();
            $scope.form.beitragForm.$setUntouched();

            var newMarker = {
                lat: currentPosition.lat,
                lng: currentPosition.lng,
                draggable: false,
                id: response.data._id,
                icon: {
                    iconUrl: '/static/css/images/marker-icon-2x-red.png',
                    shadowUrl: '/static/css/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }
            };

            $scope.myposition = initialAddress;
            objectID = response.data._id;
            $scope.$apply;

            currentPosition = initialPosition;
            currentAddress = initialAddress;

            existingMarkerObjects.push(response.data);
            $scope.markers.push(newMarker);

            var newInitialPositionMarker = {
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
                },
                compileMessage: true,
                getMessageScope: function() {
                    return $scope;
                }
            };

            //$scope.markers.push(newInitialPositionMarker);
        }, function errorCallback(err) {
            $scope.message = err;
            console.log(err);
        });
    }
}]);*/
