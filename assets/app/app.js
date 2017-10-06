var app = angular.module("indexPage", ["ngRoute", "ngDialog", 'ui-leaflet', 'ngTagsInput']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "/static/app/options/options.template.html"
    })
    .when("/register", {
        templateUrl: "/static/app/register/register.template.html"
    })
    .when("/login", {
        templateUrl: "/static/app/login/login.template.html"
    })
    .when("/map", {
        templateUrl: "/static/app/map/map.template.html"
    })
    .when("/logout", {
        templateUrl: "/static/app/options/options.template.html"
    })
});

app.directive('file', function () {
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
});
