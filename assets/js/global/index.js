var app = angular.module("indexPage", ["ngRoute","ngDialog",'ui-leaflet']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {

        templateUrl : "/static/views/accountButtons.html"
    })
    .when("/register", {

        templateUrl : "/static/views/register.html"
    })
    .when("/login", {

        templateUrl : "/static/views/login.html"
    })
    .when("/map", {

        templateUrl : "/static/views/map.html"
    })


});

app.controller('LoginController', function($scope, $location, $http) {

  $scope.processForm = function() {

    $http({
method  : 'POST',
url     : 'https://localhost:3000/user/login',
data    : $scope.loginData,  // pass in data as strings
headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
})
.then(function successCallback(response) {
  // this callback will be called asynchronously
  // when the response is available

    $location.path('/map');

}, function errorCallback(err) {
 $scope.message = err;
  console.log(err);
  // called asynchronously if an error occurs
  // or server returns response with an error status.
});

   };
 });

 app.controller('RegisterController', function($scope, $http) {

   $scope.processForm = function() {

     $http({
method  : 'POST',
url     : 'https://localhost:3000/user/register',
data    : $scope.registerData,  // pass in data as strings
headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
})
.then(function successCallback(response) {
   // this callback will be called asynchronously
   // when the response is available
    console.log(response);
     $scope.message = response;
 }, function errorCallback(err) {
  $scope.message = err;
   console.log(err);
   // called asynchronously if an error occurs
   // or server returns response with an error status.
 });

    };

 });

 app.controller('ProfileController', function ($scope, ngDialog) {

     $scope.open = function () {
         ngDialog.open({ template: '/static/views/profile.html', className: 'ngdialog-theme-default' });
     };
 });
