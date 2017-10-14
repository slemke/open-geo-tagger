(function() {
    'use strict'

    angular.module('opendata.login')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = [
        '$http',
        '$cookies',
        '$rootScope',
        'UserService'
    ];

    function AuthenticationService($http, $cookies, $rootScope, UserService) {
        var service = {};
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {
            $http.post('/authenticate', {username : username, password : password})
                .then(function(response) {
                    callback(response);
                }).catch(function(err) {
                    callback(err);
                });
        }

        function SetCredentials(username, password, user) {
            var authdata = btoa(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    _id: user._id,
                    username: username,
                    authdata: authdata,
                    email: user.email
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

})();
