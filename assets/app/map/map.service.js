(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('MapService', MapService);

    MapService.$inject = [
        '$rootScope',
        'MarkerService',
        'leafletData',
        'ObjectService',
        'ThemesService',
        'VotesService'
    ];

    function MapService($rootScope, MarkerService, leafletData, ObjectService, ThemesService, VotesService) {

        var geocodeService = L.esri.Geocoding.geocodeService();
        var markers = {
            position : {
                draggable: true,
                icon: {
                    iconUrl: '/static/css/images/marker-icon-2x-black.png',
                    shadowUrl: '/static/css/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }
            },
            tag: {
                focus: false,
                draggable: false,
                icon: {
                    iconUrl: '/static/css/images/marker-icon-2x-red.png',
                    shadowUrl: '/static/css/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                },
                getMessageScope: function () { return $rootScope; },
                compileMessage: true
            }
        };
        var markerCollection = {};
        var currentPosition;
        var currentAddress;

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
                },
                markers: {}
            },
                events: {}
            });

          ObjectService.get().then(function(data) {

              data.forEach(function(data, i){

                  ThemesService.get(data.themeID).then(function(dataTheme) {

                    markers.tag.lat = data.location[0].lat;
                    markers.tag.lng = data.location[0].lng;

                    var address = data.address;
                    var createdAt = data.createdAt;
                    var createdAtDate = new Date(createdAt).toLocaleString();
                    var categories = data.categories;
                    var description = data.description;

                    var theme = dataTheme[0].name;

                    var categoriesString = "";

                    for(var j=0;j<categories.length;j++) {

                    categoriesString += categories[j].text + " ";


                    }

                    markers.tag.message = '<div><p><strong>Adresse: </strong>'+ address +'</p><p><strong>Erstellungsdatum: </strong>'+createdAtDate+' Uhr</p><p><strong>Kategorien: </strong>'+categoriesString+'</p><p><strong>Thema: </strong>'+theme+'</p><p><strong>Beschreibung: </strong>'+description+'</p><div id="voteButtons"><p id="voteText" ng-show="false">Downvotes: 0 // Upvotes: 0</p><button id="btns_vote_down" ng-controller="PopupController as vm" ng-click="vm.voteDown()" class="btn btn-danger btn-lg text-center"><span class="glyphicon glyphicon-chevron-down"></span></button><button id="btns_vote_up" ng-click="voteUp()" ng-disabled="voteUpDisabled" class="btn btn-success btn-lg text-center"><span class="glyphicon glyphicon-chevron-up"></span></button></div>';

                    markerCollection[data._id] = angular.copy(markers.tag);


                  })



                });

                angular.extend($rootScope, {
                    markers: markerCollection
                });


                });


        })();

        return {
            setInitalLocation : function(once) {
                leafletData.getMap().then(function(map) {
                    map.locate({
                        watch: true,
                        setView: true,
                        maxZoom: 18
                    }).on('locationfound', function(event) {

                        currentPosition = event.latlng;

                        // update marker
                        markers.position.lat = event.latlng.lat;
                        markers.position.lng = event.latlng.lng;



                        markerCollection.position = markers.position;

                        angular.extend($rootScope, {
                            markers: markerCollection
                        });

                    }).once('locationfound', function(event) {
                        if(typeof once === 'function')
                            once(event);
                    });
                });
            },
            getLocation : function(callback) {
                leafletData.getMap().then(function(map) {
                    map.locate({
                        setView: true,
                        maxZoom: 18
                    }).once('locationfound', function(e) {
                        callback(e.latlng);
                    });
                });
            },
            getAddress : function(position, callback) {
                geocodeService.reverse()
                    .latlng(position)
                    .run(function(error, result) {
                        callback(result);
                });
            },
            getCurrentPosition : function(callback) {
                if(currentPosition === null || currentPosition === undefined) {
                    leafletData.getMap().then(function(map) {
                        map.locate({
                            setView: true,
                            maxZoom: 18
                        }).once('locationfound', function(e) {
                                geocodeService.reverse()
                                    .latlng(e.latlng)
                                    .run(function(error, result) {
                                        callback(result);
                                });
                            });
                        });
                } else {
                    geocodeService.reverse()
                        .latlng(currentPosition)
                        .run(function(error, result) {
                            callback(result);
                    });
                }
            },
            getMap : function() {
                return leafletData.getMap();
            },
            getMarkers : function(objectID, themeID) {
                return ObjectService.get().then(function successCallback(response) {
                    return response;
                }).catch(function(err) {
                    return err;
                });
            },
            addMarker : function(object) {

                markers.tag.lat = object.location[0].lat;
                markers.tag.lng = object.location[0].lng;

                var address = object.address;
                var createdAt = object.createdAt;
                var createdAtDate = new Date(createdAt).toLocaleString();
                var categories = object.categories;
                var description = object.description;

                ThemesService.get(object.themeID).then(function(dataTheme) {

                var theme = dataTheme[0].name;

                var categoriesString = "";

                for(var j=0;j<categories.length;j++) {

                categoriesString += categories[j].text + " ";


                }

                markers.tag.message = '<div><p><strong>Adresse: </strong>'+ address +'</p><p><strong>Erstellungsdatum: </strong>'+createdAtDate+' Uhr</p><p><strong>Kategorien: </strong>'+categoriesString+'</p><p><strong>Thema: </strong>'+theme+'</p><p><strong>Beschreibung: </strong>'+description+'</p></div>';

                markers.tag.focus = true;

                markerCollection[object._id] = angular.copy(markers.tag);

                angular.extend($rootScope, {
                    markers: markerCollection
                });

              });
            }
        };
  }
})();
