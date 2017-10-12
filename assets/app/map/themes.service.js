(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('ThemesService', ThemesService);

    ThemesService.$inject = [
        '$http'
    ];

    function ThemesService($http) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/theme')
                .then(handleSuccess, handleError('Error getting theme'));
        }

        function GetById(id) {
            return $http.get('/theme/' + id)
                .then(handleSuccess, handleError('Error getting theme by id'));
        }

        function Create(theme) {
            return $http.post('/theme', theme)
                .then(handleSuccess, handleError('Error creating theme'));
        }

        function Update(theme) {
            return $http.put('/theme/' + theme._id, theme)
                .then(handleSuccess, handleError('Error updating theme'));
        }

        function Delete(id) {
            return $http.delete('/theme/' + id)
                .then(handleSuccess, handleError('Error deleting theme'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
