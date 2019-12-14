app.controller("refereeProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, constants, refereesService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "שופט";

    $scope.getImageUrl = commonFunctionsService.getImageUrl;

    function hideData() {
        document.getElementById("profileSportClub").style.display ="NONE"
        document.getElementById("profileAddress").style.display ="NONE"
        document.getElementById("profileSex").style.display ="NONE"
        document.getElementById("profileBirthDate").style.display ="NONE"
    }

    hideData()

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
                birthdate: $filter('date')($scope.user.birthdate, "dd/MM/yyyy"),
                address: $scope.user.address,
                oldId: $routeParams.id
            }
            coachService.updateProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("המשתמש עודכן בהצלחה");
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
        coachService.deleteCoach($routeParams.id)
            .then(function (result) {
                toastNotificationService.successNotification("המשתמש נמחק בהצלחה");
                $location.path("/users/coaches");
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע מחיקה");
                console.log(error)
            })
    }



});