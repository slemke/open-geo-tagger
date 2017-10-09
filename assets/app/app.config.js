
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
        templateUrl: "/static/app/sections/map/map.template.html",
        controller: "MapController",
        controllerAs: 'vm'
    })
    .when("/logout", {
        templateUrl: "/static/app/sections/login/login.template.html",
        controller: "LoginController"
    }).otherwise({
        redirectTo: "/"
    });
}
