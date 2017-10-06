app.controller('LoginController', function($scope, $location, $http) {
    var self = this;

    self.submitForm = function() {

        $http({
            method: 'GET',
            url: 'https://localhost:3000/user/',
            data: self.user,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + btoa(self.user.username + ":" + self.user.password)
            }
        })
        .then(function successCallback(response) {

            $location.path('/map');

        }, function errorCallback(err) {
            $scope.message = err;

        });
    };

    self.getInputGroupValidationClassUsername = function() {

        if($scope.loginForm.logusername.$error.required)
            return "input-group-addon danger";
        else
            return "input-group-addon success";
    }

    self.getGlyphiconValidationClassUsername = function() {

        if($scope.loginForm.logusername.$error.required)
            return "glyphicon glyphicon-remove";
        else
            return "glyphicon glyphicon-ok";
    }

    self.getInputGroupValidationClassPassword = function() {

        if($scope.loginForm.logpassword.$error.required)
            return "input-group-addon danger";
        else
            return "input-group-addon success";
    }

    self.getGlyphiconValidationClassPassword = function() {

        if($scope.loginForm.logpassword.$error.required)
            return "glyphicon glyphicon-remove";
        else
            return "glyphicon glyphicon-ok";
    }
});
