app.controller("refereeProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, constants, refereesService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "שופט";
    $scope.eWhoAmI = "referee";
    $scope.regex = constants.regex;

    $scope.getImageUrl = commonFunctionsService.getImageUrl;

    refereesService.getRefereeProfile({id: $routeParams.id})
        .then(function (result) {
            $scope.user = result.data;
            $scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
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

    $scope.uploadFile = function(files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadUserProfileImage/'+$scope.user.id+'/judge', fd, {
            method:'POST',
            URL : constants.serverUrl + '/private/uploadUserProfileImage',
            headers: {'Content-Type': undefined,
                'x-auth-token': $window.sessionStorage.getItem('token'),
            },
            transformRequest: angular.identity
        })
            .then(()=>{
                toastNotificationService.successNotification("התמונה נשמרה בהצלחה");
                $route.reload();
            }).catch(()=>{})

    };

    $scope.btnPressed =function() {
        console.log("btn pressed")
        let file_input = document.getElementById("profilePicUpload");
        file_input.click();
    };
    $scope.delProfile = function (id) {}



});
