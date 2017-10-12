loginModule.controller('LoginController', LoginController);

LoginController.$inject = ['$scope','$location', 'AuthenticationService'];

function LoginController($scope, $location, AuthenticationService) {

    var vm = this;

    vm.error = null;

    (function initController() {
        AuthenticationService.ClearCredentials();
    })();

    vm.login = function login() {
        vm.dataLoading = true;
        AuthenticationService.Login(vm.username, vm.password, function (response) {
           if (response.data.success) {
               AuthenticationService.SetCredentials(vm.username, vm.password);
               $location.path('/map');
           } else {
               vm.dataLoading = false;
               vm.error = "Error: Bad Username or Password.";
           }
        });
    }
}
