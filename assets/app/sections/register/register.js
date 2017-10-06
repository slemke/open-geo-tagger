
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

            if (response.data.length > 0) {

                if (response.data[0].username == username) {

                    $scope.usernameValid = false;
                }
            } else {
                $scope.usernameValid = true;
            }


        }, function errorCallback(err) {
            $scope.message = err;
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
            $location.path('/map');

        }, function errorCallback(err) {
            $scope.message = err;
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
