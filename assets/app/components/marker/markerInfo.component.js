(function() {
  'use strict'

    angular.module('opendata')
        .component('objectmarkerdetail', {
            templateUrl: '/static/app/components/marker/markerInfo.template.html',
            controller: ['ThemesService','ObjectService','MarkerService', ObjectDetailController]
        });

    function ObjectDetailController(ThemesService, ObjectService, MarkerService) {

        var vm = this;

        vm.showObjectDetail = function() {

          var geocodeService = L.esri.Geocoding.geocodeService();
          //console.log(MarkerService.GetCurrentMarkerObjectID());
          ObjectService.GetById(MarkerService.GetCurrentMarkerObjectID()).then(function successCallback(object) {
              console.log(object);

            vm.form = {
              description: object[0].description,
              categories: object[0].categories
            };

          return ThemesService.GetById(object[0].themeID)}).then(function successCallback(theme) {


            vm.form.theme = theme[0].name;



          }).catch(function(err) {
              console.log(err);
          });
            };


    }

})();
