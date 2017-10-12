(function() {
    'use strict'

    angular.module('opendata.profile')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope'];

    function ProfileController($scope) {

        var vm = this;
        vm.mark = '!';
    }
})();
