(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('ThemesService', ThemesService);

    ThemesService.$inject = [
        '$http'
    ];

    function ThemesService($http) {

        return {
            get : function(themeID) {
                var parameter = '';

                if(themeID !== undefined && themeID !== null)
                    parameter = '/' + themeID;

                return $http.get('/theme' + parameter)
                    .then(handleSuccess, handleError('Error getting theme'));
            },
            post : function(theme) {
                return $http.post('/theme', theme)
                    .then(handleSuccess, handleError('Error creating theme'));
            },
            put : function(theme) {
                return $http.put('/theme/' + theme._id, theme)
                    .then(handleSuccess, handleError('Error updating theme'));
            },
            delete : function(id) {
                return $http.delete('/theme/' + id)
                    .then(handleSuccess, handleError('Error deleting theme'));
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
