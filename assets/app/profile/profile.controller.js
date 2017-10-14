(function() {
    'use strict'

    angular.module('opendata.profile')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['UserService'];

    function ProfileController(UserService) {

        var vm = this;

        var user = UserService.getCurrentUser();

        (function initController() {
            UserService.get(user._id).then(function(data) {
                vm.username = data[0].username;
                vm.email = data[0].email;
            });
        })();
    }
})();
