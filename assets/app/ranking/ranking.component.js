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
            url: '/ranking/points'
        }).then(function successCallback(response) {
            vm.userPoints = response.data;
        }).catch(function errorCallback(err) {
            console.log(err);
        });

        $http({
            method: 'GET',
            url: '/ranking/tags'
        }).then(function successCallback(response) {
            vm.userTags = response.data;
        }).catch(function errorCallback(err) {
            console.log(err);
        });
    }
})();
