(function() {
    'use strict'

    angular.module('opendata.ranking')
        .component('ranking', {
            templateUrl: '/static/app/ranking/ranking.template.html',
            controller: RankingController
        });

    RankingController.$inject = [
        '$http'
    ];

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
