app.controller("refereeProfileController", function ($scope, $http, $route,$filter, $window, $location, $rootScope, $routeParams, constants, refereesService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    $scope.whoAmI = "שופט";
    $scope.eWhoAmI = "referee";
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine;
    $scope.userType = $rootScope.userTypes.Judge;
    $scope.regex = constants.regex;
    let criminalRecordIframe = document.getElementById("criminalRecordIframe");
    $scope.isDeletable =true


    refereesService.getRefereeProfile({id: parseInt($routeParams.id)})
        .then(function (result) {
            $scope.user = result.data;
            criminalRecordIframe.src = $scope.user.criminalRecord ? $scope.user.criminalRecord : "";
            // $scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
        }, function (error) {
            console.log(error)
        });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $scope.judgeFileUpload = function(type){
        let file_input;
        switch (type) {
            case 'criminalRecord':
                file_input = document.getElementById("criminalRecordUpload");
                break;
        }
        file_input.click();
    };

    $scope.judgeFileDownload = function(path,fileType){
        let downJudgeFile;
        switch (fileType) {
            case 'criminalRecord':
                downJudgeFile = document.getElementById("downCriminalRecord");
                break;
        }

        let splitedFilePath = path.split('/');
        let fileId = splitedFilePath[splitedFilePath.length - 2];
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadJudgeFile/' + token + '/' + fileId+'/'+$scope.user.id+'/'+fileType;
        downJudgeFile.setAttribute('href', url);
        downJudgeFile.click();

    };

    $scope.uploadCriminalRecord = function(files,fileType){
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadJudgeFile/'+$scope.user.id+'/'+fileType, fd, {
            method:'POST',
            URL : constants.serverUrl + '/private/uploadJudgeFile/',
            headers: {'Content-Type': undefined,
                'x-auth-token': $window.sessionStorage.getItem('token'),
            },
            transformRequest: angular.identity
        })
            .then(()=>{
                toastNotificationService.successNotification("הקובץ הועלה בהצלחה");
                sleep(1000)
                    .then(()=>{$window.location.reload()})

            }).catch(()=>{})
    };

    $scope.submit = function (isValid) {
        if (isValid) {
            let data = {
                id: $scope.user.id,
                firstName: $scope.user.firstname,
                lastName: $scope.user.lastname,
                phone: $scope.user.phone,
                email: $scope.user.email,
                facebook: $scope.user.facebook.slice($scope.user.facebook.indexOf("www")),
                instagram:  $scope.user.instagram.slice( $scope.user.instagram.indexOf("www")),
                anotherLink: $scope.user.anotherLink.slice( $scope.user.anotherLink.indexOf("www")),
                comment:$scope.user.comment,
                oldId: $routeParams.id
            };
            refereesService.updateProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("השופט עודכן בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    refereesService.watchProfile($scope.user.id);
                    $scope.reload()
                }, function (error) {
                    if (error.data.length>0){
                        toastNotificationService.errorNotification(error.data[0]);
                    }else{
                        toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע העדכון");
                    }
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
                sleep(1000)
                    .then(()=>{$window.location.reload()})
            }).catch(()=>{})

    };

    $scope.btnPressed =function() {
        let file_input = document.getElementById("profilePicUpload");
        file_input.click();
    };
    $scope.delProfile = function () {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את פרופיל השופט?", function () {
            refereesService.deleteProfile($routeParams.id)
                .then(function (reusult) {
                    toastNotificationService.successNotification("השופט נמחק בהצלחה");
                    $location.path("/users/referees");
                }, function (error) {
                    console.log(error)
                })
        });
    }



});
