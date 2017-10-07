var app = angular.module("opendata",
            [
                'ngRoute',
                'ngDialog',
                'ngCookies',
                'ui-leaflet',
                'ngTagsInput'
            ])
            .config(config)
            .run(run);

// setup routeProvider config 
function config($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "/static/app/sections/login/login.template.html",
        controller: "LoginController",
        controllerAs: 'vm'
    })
    .when("/register", {
        templateUrl: "/static/app/sections/register/register.template.html",
        controller: "RegisterController"
    })
    .when("/map", {
        templateUrl: "/static/app/sections/map/map.template.html"
        //controller: "MapController"
    })
    .when("/logout", {
        templateUrl: "/static/app/sections/login/login.template.html",
        controller: "LoginController"
    });
}

// setup run callback
run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

function run($rootScope, $location, $cookies, $http) {

    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/']) === -1;
        var loggedIn = $rootScope.globals.currentUser;

        if (restrictedPage && !loggedIn) {
            $location.path('/');
        }
    });
}
