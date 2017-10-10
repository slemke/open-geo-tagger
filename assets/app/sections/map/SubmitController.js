(function() {

    app.controller('SubmitController', ['$timeout','ThemesService','LocationService' , SubmitController]);


    function SubmitController($timeout, ThemesService, LocationService) {

        var vm = this;

        (function initController() {

          $timeout( function(){
          vm.position = LocationService.GetCurrentAddress();
          }, 500 );

          ThemesService.GetAll().then(function successCallback(response) {

          vm.themes = response;
          vm.selectedTheme = vm.themes[0]._id;
          $timeout( function(){
          vm.geoPosition = LocationService.GetCurrentGeoPosition();
        }, 2000 ).then(function() {

          vm.beitragForm = {
              location : vm.geoPosition,
              userID : "59b7ff671d8436d6cf9be301",
              themeID : vm.selectedTheme
          };

        })


          }).catch(function(err) {
              console.log(err);
          });

          vm.addObject = function() {

            ObjectService.Create(vm.beitragForm).then(function successCallback(response) {


              vm.beitragForm.description = "";
              vm.beitragForm.categories = "";

              vm.markers["userMarker"+MarkerService.existingMarkerObjects.length] = MarkerService.SetUserMarker(LocationService.GetCurrentGeoPosition(),response._id);

            }).catch(function(err) {
                console.log(err);
            });

          };
    })();
  }
})();
