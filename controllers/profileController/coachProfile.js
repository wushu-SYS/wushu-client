app.controller("coachProfileController", function ($scope, $http, $route, $filter, $window, $location, $rootScope, $routeParams, constants, coachService, userService, confirmDialogService, toastNotificationService, commonFunctionsService, sportsmanService) {
    var oldId;
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine;
    $scope.whoAmI = "מאמן";
    $scope.userType = $rootScope.userTypes.COACH;
    $scope.eWhoAmI = "coach";
    $scope.isEditModeOn = false;
    $scope.currentDate = new Date();
    $scope.regex = constants.regex;
    let coachesSportsmen;
    let delLink = document.getElementById("delLink");

    coachService.getCoachProfile({id: parseInt($routeParams.id)})
        .then(function (result) {
            $scope.user = result.data;
            // $scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
            $scope.user.birthdate = new Date($scope.user.birthdate);
            oldId = $scope.user.id;
        }, function (error) {
            console.log(error)
        })

    $scope.submit = function (isValid) {
        if (isValid) {
            let data = {
                id: $scope.user.id,
                firstName: $scope.user.firstname,
                lastName: $scope.user.lastname,
                phone: $scope.user.phone,
                email: $scope.user.email,
                birthDate: $filter('date')($scope.user.birthdate, "MM/dd/yyyy"),
                //birthDate: $filter('date')($scope.user.birthdate, "yyyy/MM/dd"),
                address: $scope.user.address,
                comment:$scope.user.comment,
                oldId: oldId
            }
            coachService.updateProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("המשתמש עודכן בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    coachService.watchProfile($scope.user.id);
                    $scope.reload()
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע העדכון");
                    console.log(error)
                })
        }
    };

    $scope.uploadFile = function (files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadUserProfileImage/' + $scope.user.id + '/coach', fd, {
            method: 'POST',
            URL: constants.serverUrl + '/private/uploadUserProfileImage',
            headers: {
                'Content-Type': undefined,
                'x-auth-token': $window.sessionStorage.getItem('token'),
            },
            transformRequest: angular.identity
        })
            .then(() => {
                toastNotificationService.successNotification("התמונה נשמרה בהצלחה");
                $route.reload();
            }).catch(() => {
        })

    };

    $scope.btnPressed = function () {
        let file_input = document.getElementById("profilePicUpload");
        file_input.click();
    };

//TODO: OPEN MODAL FOR CHANGE SPORTSMAN COACH ==> THEN DELETE COACH
    $scope.delProfile = async function (id) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את פרופיל המשתמש?", function () {
            coachService.deleteCoach(id)
                .then(function (result) {
                    toastNotificationService.successNotification("המשתמש נמחק בהצלחה");
                    $location.path("/users/couches");
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע מחיקה");
                    console.log(error)
                })
        })
    }

    checkForSportsman()

    function checkForSportsman() {
        sportsmanService.getCoachSportsmen(parseInt($routeParams.id))
            .then(function (result) {
                coachesSportsmen = result.data
                $scope.isDeletable = coachesSportsmen.length == 0
            }, function (error) {
                console.log(error)
            });
    }

});
