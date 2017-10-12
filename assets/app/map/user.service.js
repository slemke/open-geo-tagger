(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('UserService', UserService);


    UserService.$inject = ['$http'];

    function UserService($http) {

        var user = {};

        return {
            GetAll : GetAll,
            GetById : GetById,
            Create : Create,
            Update : Update,
            Delete : Delete
        };

        function GetAll() {
            return $http.get('/user/').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(user) {
            return $http.post('/user/', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/user/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

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
