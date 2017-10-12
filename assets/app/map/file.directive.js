(function() {
    'use strict'

    angular.module('opendata.map')
        .directive('file', FileDirective);

    function FileDirective() {
        return {
            scope: {
                file: '='
            },
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        };
    }
})();
