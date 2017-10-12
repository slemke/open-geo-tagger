
// setup routeProvider config
function config($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "/static/app/login/login.template.html",
        controller: "LoginController",
        controllerAs: 'vm'
    })
    .when("/register", {
        templateUrl: "/static/app/register/register.template.html",
        controller: "RegisterController",
        controllerAs: 'vm'
    })
    .when("/map", {
        templateUrl: "/static/app/map/map.template.html",
        controller: "MapController",
        controllerAs: 'vm'
    })
    .when("/logout", {
        templateUrl: "/static/app/login/login.template.html",
        controller: "LoginController"
    }).otherwise({
        redirectTo: "/"
    });
}
