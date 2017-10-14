(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('VotesService', VotesService);

    VotesService.$inject = [
        '$http'
    ];

    function VotesService($http) {
        return {
            upvote : function(objectID, userID) {

            },
            downvote : function(objectID, userID) {

            }
        };
    }
})();
