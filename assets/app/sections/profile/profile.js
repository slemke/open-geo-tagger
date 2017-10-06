app.controller('ProfileController', function($scope, ngDialog) {

    $scope.open = function() {
        ngDialog.open({
            template: '/static/app/sections/profile/profile.template.html',
            className: 'ngdialog-theme-plain'
        });
    };
});
