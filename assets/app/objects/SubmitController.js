(function() {

    objectsModule.controller('SubmitController', ['$timeout','ThemesService','LocationService', 'ObjectService', 'MarkerService' , SubmitController]);


    function SubmitController($timeout, ThemesService, LocationService, ObjectService, MarkerService) {

        var vm = this;

        (function initController() {

          $timeout( function(){
          vm.position = LocationService.GetCurrentAddress();
        }, 1000 );

          ThemesService.GetAll().then(function successCallback(response) {

          vm.themes = response;
          vm.selectedTheme = vm.themes[0]._id;
          $timeout( function(){
          vm.geoPosition = LocationService.GetCurrentGeoPosition();
        }, 2000 ).then(function() {

          vm.form = {
              location : vm.geoPosition,
              userID : "59b7ff671d8436d6cf9be301",
              themeID : vm.selectedTheme
          };


        })


          }).catch(function(err) {
              console.log(err);
          });

          vm.addObject = function() {
            console.log(vm.form);
            ObjectService.Create(vm.form).then(function successCallback(response) {

            MarkerService.SetUserMarker(LocationService.GetCurrentGeoPosition(),LocationService.GetCurrentAddress(),response._id);

            // vm.form.description = "";
            // vm.form.categories = "";

            }).catch(function(err) {
                console.log(err);
            });

          };
    })();
  }
})();
