(function() {

    app.controller('SubmitController', ['$http', SubmitController]);


    function SubmitController() {

        var vm = this;

        (function initController() {

            vm.position = 'here goes the current position';
            vm.themes = [
                {
                    _id: 1,
                    name : 'Street Art'
                },
                {
                    _id: 2,
                    name : 'Random Stuff'
                }
            ];
            vm.selectedTheme = vm.themes[0];
            vm.form = {
                theme : vm.themes[0]
            };
        })();



        vm.addNewObject = function() {
            // do http magic
            console.log('logging object');
        };
    }
})();
