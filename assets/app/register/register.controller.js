(function() {
    'use strict'

    angular.module('opendata.register')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = [
        '$http',
        '$location',
        'AuthenticationService',
        'UserService'

    ];

    function RegisterController($http, $location, AuthenticationService, UserService) {

        var vm = this;

        vm.usernameValid = true;

        vm.emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

          vm.checkUsername = function(username) {

          UserService.get(null,username).then(function(user) {

            if (user.length > 0) {

              if (user[0].username == username) {

                vm.usernameValid = false;

              } else {
                vm.usernameValid = true;
              }
            } else {
              vm.usernameValid = true;
            }

          }).catch(function(err) {
            console.log(err);
          });

        }

        vm.register = function register() {

          UserService.post(vm.user).then(function(response) {

              vm.success = true;

          }).catch(function(err) {
              console.log(err);
          });

        };

        vm.getInputGroupValidationClassMail = function() {

            if (vm.registerForm.email.$error.required && vm.registerForm.email.$error.pattern || vm.registerForm.email.$error.required || vm.registerForm.email.$error.pattern) {
                return "input-group-addon danger";
            } else {
                return "input-group-addon success";
            }
        }

        vm.getGlyphiconValidationClassMail = function() {

            if (vm.registerForm.email.$error.required && vm.registerForm.email.$error.pattern || vm.registerForm.email.$error.required || vm.registerForm.email.$error.pattern) {
                return "glyphicon glyphicon-remove";
            } else {
                return "glyphicon glyphicon-ok";
            }
        }


        vm.getInputGroupValidationClassUsername = function() {

            if (vm.registerForm.username.$error.required || !vm.usernameValid) {
                return "input-group-addon danger";
            } else {
                return "input-group-addon success";
            }
        }

        vm.getGlyphiconValidationClassUsername = function() {
            if (vm.registerForm.username.$error.required || !vm.usernameValid) {

                return "glyphicon glyphicon-remove";
            } else {

                return "glyphicon glyphicon-ok";
            }

        }


        vm.getInputGroupValidationClassPassword = function() {

            if (vm.registerForm.password.$error.required && vm.registerForm.passwordconfirm.$error.required || vm.registerForm.passwordconfirm.$error.required) {
                return "input-group-addon danger";
            } else {
                    return "input-group-addon success";
            }
        }

        vm.getGlyphiconValidationClassPassword = function() {

            if (vm.registerForm.password.$error.required && vm.registerForm.passwordconfirm.$error.required || vm.registerForm.passwordconfirm.$error.required) {
                return "glyphicon glyphicon-remove";
            } else {
                    return "glyphicon glyphicon-ok";
            }
        }
    };
})();
