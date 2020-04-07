app.controller("clubProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, clubService, constants, coachService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "מועדון";
    $scope.regex = constants.regex;

    getDisplayData();

    function getDisplayData() {
        clubService.getClubProfile($routeParams.id)
            .then(function (result) {
                $scope.club = result.data;
                console.log($scope.club)
            }, function (error) {
                console.log(error)
            });

        clubService.getAgudas()
            .then(function (result) {
                $scope.agudas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getErgons()
            .then(function (result) {
                $scope.ergons = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.submit = function (isValid) {
        if (isValid) {
            clubService.updateClub($scope.club)
                .then(function (result) {
                    toastNotificationService.successNotification("העדכון בוצע בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    clubService.getClubProfile($scope.club.id);
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע העדכון");
                    console.log(error)
                })
        }
    };

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        if($scope.updateProfile.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.updateProfile.$valid) $scope.isClicked = true
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.updateProfile.$valid);
        }
    });
});
