(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('CategoryService', CategoryService);

    CategoryService.$inject = ['$http'];

    function CategoryService($http) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function getAll() {
            return $http.get('/categories')
                .then(handleSuccess, handleError('Error getting objects'));
        }

        function GetById(id) {
            return $http.get('/categories/' + id)
                .then(handleSuccess, handleError('Error getting object by id'));
        }

        function Create(category) {
            return $http.post('/categories', category)
                .then(handleSuccess, handleError('Error creating object'));
        }

        function Update(category) {
            return $http.put('/categories/' + category._id, category)
                .then(handleSuccess, handleError('Error updating object'));
        }

        function Delete(id) {
            return $http.delete('/categories/' + id)
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
})();
