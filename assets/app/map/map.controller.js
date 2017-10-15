(function() {
    'use strict'

    angular.module('opendata.map')
        .controller('MapController', MapController);

    MapController.$inject = [
      '$rootScope',
      '$compile',
        'PointsService',
        'ObjectService',
        'MarkerService',
        'MapService',
        'UserService'
    ];

    function MapController($rootScope, $compile, PointsService, ObjectService, MarkerService, MapService, UserService) {

        var vm = this;

        vm.showMap = false;
        vm.points = 0;

        var user = UserService.getCurrentUser();

        // init map controller
        (function initController() {

            // TODO Error view
            MapService.setInitalLocation(function(position) {
                UserService.get(user._id).then(function(data) {
                    vm.points = data[0].points;
                    vm.showMap = true;
                });
            });


        })();

        $rootScope.$on('leafletDirectiveMarker.click', function(event, args){

    $compile(args.leafletEvent.target.options.message)($rootScope);

    //  var childscope = angular.element(args.leafletEvent.target.options.message).scope();
    //  console.log(childscope);
    //  childscope.marker = $rootScope.markers[args.markerName];
 });

        vm.getTagData = function getTagData() {
            console.log('data');
        }
    }
})();
