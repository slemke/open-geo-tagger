(function() {

    app.controller('SubmitController', ['ThemesService' , SubmitController]);


    function SubmitController(ThemesService) {

        var vm = this;

        (function initController() {

            vm.position = 'here goes the current position';

            ThemesService.GetAll().then(function successCallback(response) {

            vm.themes = response;
            vm.selectedTheme = vm.themes[0];
            vm.form = {

                theme : vm.themes[0]._id
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
