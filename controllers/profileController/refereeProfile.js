app.controller("refereeProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, constants, refereesService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "שופט";
    $scope.eWhoAmI = "referee";
    $scope.regex = constants.regex;

    $scope.getImageUrl = commonFunctionsService.getImageUrl;

    refereesService.getRefereeProfile({id: $routeParams.id})
        .then(function (result) {
            $scope.user = result.data;
        }, function (error) {
            console.log(error)
        })

    $scope.submit = function (isValid) {
        if (isValid) {
            let data = {
                id: $scope.user.id,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                phone: $scope.user.phone,
                email: $scope.user.email,
                oldId: $routeParams.id
            };
            refereesService.updateProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("השופט עודכן בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    $route.reload();
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע העדכון");
                    console.log(error)
                })
        }
    };

    $scope.delProfile = function (id) {
        // coachService.deleteCoach($routeParams.id)
        //     .then(function (result) {
        //         toastNotificationService.successNotification("המשתמש נמחק בהצלחה");
        //         $location.path("/users/coaches");
        //     }, function (error) {
        //         toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע מחיקה");
        //         console.log(error)
        //     })
    }



});
