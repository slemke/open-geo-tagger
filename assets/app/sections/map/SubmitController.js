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
            vm.selectedTheme = vm.themes[0];

            vm.form = {

                theme : vm.themes[0]
            };

            }).catch(function(err) {
                console.log(err);
            });



        })();

        vm.addNewObject = function() {

          ObjectService.Create(vm.form);
            // do http magic
            console.log('logging object');
        };
    }
})();
