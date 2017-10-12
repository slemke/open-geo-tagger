(function() {
    'use strict'

    angular.module('opendata.map')
        .factory('UserService', UserService);

    UserService.$inject = [
        '$http'
    ];

    function UserService($http) {

        return {
            get : function(userID) {
                var parameter = '';
                if(userID !== undefined && userID !== null)
                    parameter += '/' + userID;

                return $http.get('/user/' + parameter)
                    .then(handleSuccess, handleError('Error getting all users'));
            },
            post : function(user) {
                return $http.post('/user/', user)
                    .then(handleSuccess, handleError('Error creating user'));
            },
            put : function(user) {
                return $http.put('/user/' + user._id, user)
                    .then(handleSuccess, handleError('Error updating user'));
            },
            delete : function(id) {
                return $http.delete('/user/' + id)
                    .then(handleSuccess, handleError('Error deleting user'));
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
