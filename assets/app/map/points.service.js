(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('PointsService', PointsService);

    PointsService.$inject = [
        '$http',
        'UserService'
    ];

    function PointsService($http, UserService) {

        return {
            increase : function(userID, points) {
                // TODO increase points
            },
            decrease : function(userID, points) {
                // TODO decrease points
            },
            getCurrentPoints : function(userID) {
                return UserService.get(userID);
            }
        };
    }
})();
