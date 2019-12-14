app.controller("clubProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, clubService, constants, coachService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "מועדון";
    $scope.regex = constants.regex;

    clubService.getClubProfile($routeParams.id)
        .then(function (result) {
            $scope.club = result.data;
        }, function (error) {
            console.log(error)
        });

    $scope.submit = function (isValid) {
        if (isValid) {

        }
    };
});
