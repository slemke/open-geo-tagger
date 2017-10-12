(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('ObjectService', ObjectService);

    ObjectService.$inject = [
        '$http'
    ];

    function ObjectService($http) {

        return {
            get : function(objectID, themeID) {
                var parameter = '';
                if(objectID !== undefined && objectID !== null)
                    parameter += '/' + objectID;

                if(themeID !== undefined && themeID !== null && parameter === '')
                    parameter += '/?themeID=' + themeID;

                return $http.get('/objects')
                    .then(handleSuccess, handleError('Error getting objects'));
            },
            post : function(object) {
                return $http.post('/objects', object)
                    .then(handleSuccess, handleError('Error creating object'));
            },
            put : function(object) {
                return $http.put('/objects/' + object._id, object)
                    .then(handleSuccess, handleError('Error updating object'));
            },
            delete : function(id) {
                return $http.delete('/objects/' + id)
                    .then(handleSuccess, handleError('Error deleting object'));
            }
        };

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return { success: false, message: error };
        }
    }

})();
