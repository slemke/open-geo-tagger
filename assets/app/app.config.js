app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "/static/app/sections/login/login.template.html",
        controller: "LoginController"
    })
    .when("/register", {
        templateUrl: "/static/app/sections/register/register.template.html",
        controller: "RegisterController"
    })
    .when("/map", {
        templateUrl: "/static/app/sections/map/map.template.html",
        controller: "MapController"
    })
    .when("/logout", {
        templateUrl: "/static/app/sections/login/login.template.html",
        controller: "LoginController"
    })
});
