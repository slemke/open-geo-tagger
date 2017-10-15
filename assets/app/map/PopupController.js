(function() {
    'use strict'

    angular.module('opendata.map')
        .controller('PopupController', PopupController);

    PopupController.$inject = [
      '$scope',
      'VotesService'
    ];

    function PopupController($scope, VotesService) {
      console.log("hallo");
        var vm = this;

        // init map controller
        (function initController() {

            // // TODO Error view
            // MapService.setInitalLocation(function(position) {
            //     UserService.get(user._id).then(function(data) {
            //         vm.points = data[0].points;
            //         vm.showMap = true;
            //     });
            // });
            //

        })();

        $scope.voteDown = function voteDown() {
          console.log("called");
            VotesService.downvote(asd,asd);
        }




    }
})();
