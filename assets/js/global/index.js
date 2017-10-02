var app = angular.module("indexPage", ["ngRoute", "ngDialog", 'ui-leaflet']);
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
                if(value === otherInput.$viewValue) {
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
        params: {username: username}
      })
      .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

        if(response.data.length > 0) {

          if(response.data[0].username == username) {

          $scope.usernameValid = false;
          }
        }
        else {
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
      if($scope.registerForm.$valid) {
        return "input-group-addon success";
      }
      else {
        return "input-group-addon danger";
      }
    }

  }

  self.getGlyphiconValidationClassPassword = function() {

    if ($scope.registerForm.password.$error.required && $scope.registerForm.passwordconfirm.$error.required || $scope.registerForm.passwordconfirm.$error.required) {


      return "glyphicon glyphicon-remove";


    } else {
        if($scope.registerForm.$valid) {
        return "glyphicon glyphicon-ok";
      }
      else {
        return "glyphicon glyphicon-remove";
      }
    }

  }

});

app.controller('ProfileController', function($scope, ngDialog) {

  $scope.open = function() {
    ngDialog.open({
      template: '/static/views/profile.html',
      className: 'ngdialog-theme-default'
    });
  };
});
