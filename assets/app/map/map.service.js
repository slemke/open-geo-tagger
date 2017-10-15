(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('MapService', MapService);

    MapService.$inject = [
        '$rootScope',
        'MarkerService',
        'leafletData',
        'ObjectService',
        'ThemesService'
    ];

    function MapService($rootScope, MarkerService, leafletData, ObjectService, ThemesService) {

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
                compileMessage: true
            }
        };
        var markerCollection = {};
        var currentPosition;

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

                for(var i = 0; i < data.length; i++) {
                    markers.tag.lat = data[i].location[0].lat;
                    markers.tag.lng = data[i].location[0].lng;

                    var address = data[i].address;
                    var createdAt = data[i].createdAt;
                    var createdAtDate = new Date(createdAt).toLocaleString();
                    var categories = data[i].categories;
                    var description = data[i].description;


                    return ThemesService.get(data[i].themeID).then(function(dataTheme) {

                    var theme = dataTheme[0].name;

                    var categoriesString = "";

                    for(var j=0;j<categories.length;j++) {

                    categoriesString += categories[j].text + " ";


                    }

                    markers.tag.message = '<div><p><strong>Adresse: </strong>'+ address +'</p><p><strong>Erstellungsdatum: </strong>'+createdAtDate+' Uhr</p><p><strong>Kategorien: </strong>'+categoriesString+'</p><p><strong>Thema: </strong>'+theme+'</p><p><strong>Beschreibung: </strong>'+description+'</p></div>';


                    markerCollection[data[i]._id] = angular.copy(markers.tag);
                    console.log(markerCollection[data[i]._id]);
                      });

                }

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



                markerCollection[object._id] = angular.copy(markers.tag);

                angular.extend($rootScope, {
                    markers: markerCollection
                });

              });
            }
        };
  }
})();
