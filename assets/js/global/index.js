var app = angular.module("indexPage", ["ngRoute", "ngDialog", 'ui-leaflet', 'ngTagsInput']);
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {

      templateUrl: "/static/views/accountButtons.html"
    })
    .when("/register", {

      templateUrl: "/static/views/register.html"
    })
    .when("/login", {

      templateUrl: "/static/views/login.html"
    })
    .when("/map", {

      templateUrl: "/static/views/map.html"
    })
    .when("/logout", {

      templateUrl: "/static/views/accountButtons.html"
    })


});

app.directive("repeatPassword", function() {
  return {
    require: "ngModel",
    link: function(scope, elem, attrs, ctrl) {
      var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

      ctrl.$parsers.push(function(value) {
        if (value === otherInput.$viewValue) {
          ctrl.$setValidity("repeat", true);
          return value;
        }
        ctrl.$setValidity("repeat", false);
      });

      otherInput.$parsers.push(function(value) {
        ctrl.$setValidity("repeat", value === ctrl.$viewValue);
        return value;
      });
    }
  };
});

app.controller('LoginController', function($scope, $location, $http) {
  var self = this;
  self.submitForm = function() {

    $http({
        method: 'GET',
        url: 'https://localhost:3000/user/',
        data: self.user, // pass in data as strings
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Basic " + btoa(self.user.username + ":" + self.user.password)
        } // set the headers so angular passing info as form data (not request payload)
      })
      .then(function successCallback(response) {

        console.log(response);
        // this callback will be called asynchronously
        // when the response is available

        $location.path('/map');

      }, function errorCallback(err) {
        $scope.message = err;

        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

  self.getInputGroupValidationClassUsername = function() {

    if ($scope.loginForm.logusername.$error.required) {
      return "input-group-addon danger";
    } else {
      return "input-group-addon success";
    }

  }

  self.getGlyphiconValidationClassUsername = function() {


    if ($scope.loginForm.logusername.$error.required) {

      return "glyphicon glyphicon-remove";
    } else {
      return "glyphicon glyphicon-ok";
    }

  }

  self.getInputGroupValidationClassPassword = function() {

    if ($scope.loginForm.logpassword.$error.required) {

      return "input-group-addon danger";

    } else {

      return "input-group-addon success";
    }

  }

  self.getGlyphiconValidationClassPassword = function() {

    if ($scope.loginForm.logpassword.$error.required) {

      return "glyphicon glyphicon-remove";

    } else {

      return "glyphicon glyphicon-ok";

    }

  }


});

app.controller('RegisterController', function($scope, $http, $location) {
  var self = this;

  $scope.usernameValid = true;

  $scope.emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;



  self.checkUsername = function(username) {

    $http({
        method: 'GET',
        url: 'https://localhost:3000/user/',
        params: {
          username: username
        }
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

        if (response.data.length > 0) {

          if (response.data[0].username == username) {

            $scope.usernameValid = false;
          }
        } else {
          $scope.usernameValid = true;
        }


      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

  self.submitForm = function() {

    $http({
        method: 'POST',
        url: 'https://localhost:3000/user/',
        data: self.user, // pass in data as strings
        headers: {
          'Content-Type': 'application/json'
        } // set the headers so angular passing info as form data (not request payload)
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(response);
        $location.path('/map');

      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);

        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

  self.getInputGroupValidationClassMail = function() {

    if ($scope.registerForm.email.$error.required && $scope.registerForm.email.$error.pattern || $scope.registerForm.email.$error.required || $scope.registerForm.email.$error.pattern) {

      return "input-group-addon danger";
    } else {
      return "input-group-addon success";
    }

  }

  self.getGlyphiconValidationClassMail = function() {

    if ($scope.registerForm.email.$error.required && $scope.registerForm.email.$error.pattern || $scope.registerForm.email.$error.required || $scope.registerForm.email.$error.pattern) {

      return "glyphicon glyphicon-remove";
    } else {
      return "glyphicon glyphicon-ok";
    }

  }


  self.getInputGroupValidationClassUsername = function() {

    if ($scope.registerForm.username.$error.required || !$scope.usernameValid) {
      return "input-group-addon danger";
    } else {
      return "input-group-addon success";
    }

  }

  self.getGlyphiconValidationClassUsername = function() {


    if ($scope.registerForm.username.$error.required || !$scope.usernameValid) {

      return "glyphicon glyphicon-remove";
    } else {
      return "glyphicon glyphicon-ok";
    }

  }


  self.getInputGroupValidationClassPassword = function() {

    if ($scope.registerForm.password.$error.required && $scope.registerForm.passwordconfirm.$error.required || $scope.registerForm.passwordconfirm.$error.required) {



      return "input-group-addon danger";

    } else {
      if ($scope.registerForm.$valid) {
        return "input-group-addon success";
      } else {
        return "input-group-addon danger";
      }
    }

  }

  self.getGlyphiconValidationClassPassword = function() {

    if ($scope.registerForm.password.$error.required && $scope.registerForm.passwordconfirm.$error.required || $scope.registerForm.passwordconfirm.$error.required) {


      return "glyphicon glyphicon-remove";


    } else {
      if ($scope.registerForm.$valid) {
        return "glyphicon glyphicon-ok";
      } else {
        return "glyphicon glyphicon-remove";
      }
    }

  }

});

app.controller('ProfileController', function($scope, ngDialog) {

  $scope.open = function() {
    ngDialog.open({
      template: '/static/views/profile.html',
      className: 'ngdialog-theme-plain'
    });
  };
});

app.directive('file', function () {
    return {
        scope: {
            file: '='
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
                scope.$apply();
            });
        }
    };
});

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


  getExistingMarkers = function() {
    $http({
        method: 'GET',
        url: 'https://localhost:3000/objects/'
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

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

        })

      })

      .catch(function(err) {
        console.log(err);
      })
  }

  getExistingMarkers();

  leafletData.getMap().then(function(map) {


    map.locate({
      setView: true,
      maxZoom: 16
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
        })

      });

    });

  });

  $scope.$on('leafletDirectiveMarker.click', function(event, args) {



    angular.forEach(existingMarkerObjects, function(val, key) {

      if (val._id == args.leafletEvent.target.options.id) {

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
            })

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
      })
      .then(function(object) {

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
        })
      }).then(function(theme) {

        $scope.currentObjectTheme = theme.data[0].name;

      }).catch(function(err) {
        console.log(err);
      })

  }




  $scope.openMarkerInfo = function() {

  ngDialog.open({
      template: '/static/views/markerInfo.html',
      className: 'ngdialog-theme-plain',
      scope: $scope
    });

  }

  $scope.addNewMarker = function() {

  ngDialog.open({
      template: '/static/views/newMarker.html',
      className: 'ngdialog-theme-plain',
      scope: $scope
    });

  }

  $scope.voteUp = function() {

    var data = {

      vote: 1,
      userID: "59b7ff671d8436d6cf9be301",
      objectID: objectID

    }

    $http({
        method: 'POST',
        url: 'https://localhost:3000/votes',
        data:data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function successCallback(response) {

      $scope.voteUpDisabled = true;
      $scope.voteDownDisabled = true;

      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);

      });

  }

  $scope.voteDown = function() {

    var data = {

      vote: 0,
      userID: "59b7ff671d8436d6cf9be301",
      objectID: objectID

    }

    $http({
        method: 'POST',
        url: 'https://localhost:3000/votes',
        data:data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function successCallback(response) {

      $scope.voteUpDisabled = true;
      $scope.voteDownDisabled = true;

      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);

      });

  }

  $scope.loadTags = function(query) {


    return $http({
        method: 'GET',
        url: 'https://localhost:3000/objects?category='+query,
      })
      .then(function successCallback(response) {


      return response.data[0].categories;

      })
      }

  $scope.openEditPopup = function() {

  ngDialog.closeAll();
  ngDialog.open({

      template: '/static/views/markerEdit.html',
      className: 'ngdialog-theme-plain',
      scope: $scope
    });


  }


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

  $scope.themes = [];
  $http({
      method: 'GET',
      url: 'https://localhost:3000/theme',
    })
    .then(function successCallback(response) {

      angular.forEach(response.data, function(theme) {
        $scope.themes.push(theme);
      })

      $scope.objectTheme = $scope.themes[0];


    }, function errorCallback(err) {
      $scope.message = err;
      console.log(err);

    });

  $scope.editObject = function() {

    var editObject = {};

    editObject.location = JSON.stringify(editObjectPosition);
    editObject.categories = $scope.objectCategories;
    editObject.themeID = $scope.objectTheme;
    editObject.description = $scope.objectDescription;
    editObject.userID = "59b7ff671d8436d6cf9be301";

    $http({
        method: 'PUT',
        url: 'https://localhost:3000/objects/' + objectID,
        data: editObject, // pass in data as strings
        headers: {
          'Content-Type': 'application/json'
        } // set the headers so angular passing info as form data (not request payload)
      })
      .then(function successCallback(response) {

        console.log(response);
        // this callback will be called asynchronously
        // when the response is available


        $scope.objectCategories = editObject.categories;
        $scope.objectDescription = editObject.description;


        $scope.form.editForm.$setPristine();
        $scope.form.editForm.$setUntouched();

        ngDialog.closeAll();
        $scope.openMarkerInfo();

      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);

      });

  }

  $scope.addNewObject = function() {

var newObject = {};

    newObject.location = JSON.stringify(currentPosition);
    newObject.categories = $scope.FormData.newCategories;
    newObject.themeID = $scope.objectTheme._id;
    newObject.description = $scope.FormData.newDescription;
    newObject.userID = "59b7ff671d8436d6cf9be301";
    //newObject.file = $scope.FormData.file;


    $http({
        method: 'POST',
        url: 'https://localhost:3000/objects/',
        data: newObject,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

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
        }

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
        }
        $scope.markers.push(newInitialPositionMarker);


      }, function errorCallback(err) {
        $scope.message = err;
        console.log(err);

      });


  }

}]);
