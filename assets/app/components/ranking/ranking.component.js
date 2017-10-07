(function() {
    'use strict'

    angular.module('indexPage')
        .component('ranking', {
            templateUrl: '/static/app/components/ranking/ranking.template.html',
            controller: ['$http', RankingController]
        });

    function RankingController($http) {

        var vm = this;

        $http({
            method: 'GET',
            url: 'https://localhost:3000/ranking/'
        }).then(function successCallback(response) {
            vm.user = response.data;
        }).catch(function errorCallback(err) {
            console.log(err);
        });
    }
})();
