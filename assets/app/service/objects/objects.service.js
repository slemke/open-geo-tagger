(function() {
    'use strict'

    angular.module('opendata')
        .factory('ObjectService', ObjectService);

    ObjectService.$inject = ['$http'];

    function ObjectService($http) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function getAll() {
            return $http.get('/objects')
                .then(handleSuccess, handleError('Error getting objects'));
        }

        function GetById(id) {
            return $http.get('/objects/' + id)
                .then(handleSuccess, handleError('Error getting object by id'));
        }

        function Create(object) {
            return $http.post('/objects', object)
                .then(handleSuccess, handleError('Error creating object'));
        }

        function Update(object) {
            return $http.put('/objects/' + object._id, object)
                .then(handleSuccess, handleError('Error updating object'));
        }

        function Delete(id) {
            return $http.delete('/objects/' + id)
                .then(handleSuccess, handleError('Error deleting object'));
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

});
