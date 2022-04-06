app.controller("amutaProfileController", function ($scope, $http, $route, $filter, $window, $location, $rootScope, $routeParams, $uibModal, amutaService, constants, coachService, userService, confirmDialogService, toastNotificationService, chartsService, chartsDataService) {

    $scope.whoAmI = "עמותה";
    $scope.regex = constants.regex;
    $scope.statusEnum = constants.statusEnum;

    getDisplayData();

    function getDisplayData() {
        amutaService.getAmutaProfile($routeParams.id)
            .then(function (result) {
                $scope.amuta = result.data;
            }, function (error) {
                console.log(error)
            });

    }

    $scope.submit = function (isValid) {
        if (isValid) {
            amutaService.updateAmuta($scope.amuta)
                .then(function (result) {
                    toastNotificationService.successNotification("העדכון בוצע בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    amutaService.getAmutaProfile($scope.amuta.id);
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע העדכון");
                    console.log(error)
                })
        }
    };

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if ($scope.updateProfile.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.updateProfile.$valid) $scope.isClicked = true
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.updateProfile.$valid);
        }
    });
    $scope.delProfile = function (id) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את פרופיל העמותה?", function () {
            let data = {
                id: id
            };
            amutaService.deleteProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("עמותה נמחקה בהצלחה");
                    $location.path("/sportClubs/sportAmuta");

                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע המחיקה");
                    console.log(error)
                })
        });
    }
});
