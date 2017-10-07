app.controller('LoginController', LoginController);

LoginController.$inject = ['$location', 'AuthenticationService'];

function LoginController($location, AuthenticationService) {
    var self = this;

    var vm = this;
    self.login = login;

    (function initController() {
        AuthenticationService.ClearCredentials();
    })();

    function login() {
        vm.dataLoading = true;
        AuthenticationService.Login(vm.username, vm.password, function (response) {
           if (response.success) {
               AuthenticationService.SetCredentials(vm.username, vm.password);
               $location.path('/map');
           } else {
               //FlashService.Error(response.message);
               vm.dataLoading = false;
           }
        });
    }

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
}
