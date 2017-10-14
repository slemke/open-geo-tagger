(function() {
    'use strict'

    angular.module('opendata.profile')
        .controller('ProfileEditController', ProfileEditController);


    ProfileEditController.$inject = ['UserService'];

    function ProfileEditController(UserService) {

      var vm = this;
      vm.mark = '!';

      vm.emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      vm.usernameValid = true;

      // vm.form = {
      //   username: "testname",
      //   email: "testemail@test.de"
      // };

      vm.disableSubmit = function() {

        if (vm.password && vm.usernameValid && !vm.editProfileForm.email.$error.pattern) {

          return false;
        } else if (vm.email && vm.usernameValid) {

          return false;
        } else if (vm.editProfileForm.email.$error.pattern) {

          return true;
        } else if (!vm.usernameValid) {

          return true;
        } else if (vm.usernameValid && !vm.username && vm.password) {

          return false;
        } else if (vm.usernameValid && vm.username && !vm.password) {

          return false;
        } else {
          return true;
        }

      }

      vm.getInputGroupValidationClassMail = function() {

        if (!vm.email || vm.editProfileForm.email.$error.pattern) {
          return "input-group-addon danger";
        } else {
          return "input-group-addon success";
        }
      }

      vm.getGlyphiconValidationClassMail = function() {

        if (!vm.email || vm.editProfileForm.email.$error.pattern) {
          return "glyphicon glyphicon-remove";
        } else {
          return "glyphicon glyphicon-ok";
        }
      }


      vm.getInputGroupValidationClassUsername = function() {

        if (!vm.username || vm.username && !vm.usernameValid) {
          return "input-group-addon danger";
        } else {
          return "input-group-addon success";
        }
      }

      vm.getGlyphiconValidationClassUsername = function() {

        if (!vm.username || vm.username && !vm.usernameValid) {

          return "glyphicon glyphicon-remove";
        } else {

          return "glyphicon glyphicon-ok";
        }

      }

      vm.getInputGroupValidationClassPassword = function() {

        if (!vm.password) {
          return "input-group-addon danger";
        } else {
          return "input-group-addon success";
        }
      }

      vm.getGlyphiconValidationClassPassword = function() {

        if (!vm.password) {
          return "glyphicon glyphicon-remove";
        } else {
          return "glyphicon glyphicon-ok";
        }
      }

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


      vm.editProfile = function() {

        vm.updatedUser = {
          _id: "59b7ff671d8436d6cf9be301",
          username: vm.username,
          email: vm.email,
          password: vm.password,
          passwordconfirm: vm.password,
          points: 5

        }

        // *TODO* Update User erfolgt zwar aber Password wird nicht gehasht und man muss Punkte (points) angeben


          UserService.put(vm.updatedUser).then(function successCallback(response) {

            console.log(response);
          // vm.form.description = "";
          // vm.form.categories = "";

          }).catch(function(err) {
              console.log(err);
          });


      }

    };

})();
