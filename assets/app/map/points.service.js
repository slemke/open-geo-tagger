(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('PointsService', PointsService);

    PointsService.$inject = [
        '$http'
    ];

    function PointsService($http) {

        var service = {};
        service.points = 0;
        service.increase = increase;
        service.decrease = decrease;

        return service;


        function increase(points) {
            /*$http.get('/user/').then(function(response) {

            }).catch(function(err) {

            });*/
            return service.points += points;
        }

        function decrease(points) {
            return service.points -= points;
        }
    }

})();
