app.controller("sportsmanProfileController", function ($scope, $http, $filter, $window, $location, $rootScope, $route, $routeParams, constants, sportsmanService, userService, confirmDialogService, toastNotificationService, commonFunctionsService) {
    var oldId;
    $scope.whoAmI = "ספורטאי";
    $scope.userType = $rootScope.userTypes.SPORTSMAN;
    $scope.isEditModeOn = false;
    $scope.currentDate = new Date();
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyleEnum = constants.sportStyleEnum;
    $scope.regex = constants.regex;

    let medicalScanIframe = document.getElementById("medicalScanIframe");
    let insuranceIframe = document.getElementById("insuranceIframe");



    $scope.uploadFile = function(files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadUserProfileImage/'+$scope.user.id+'/sportsman', fd, {
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
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $scope.sportsmanFileUpload = function(type){
        let file_input;
        switch (type) {
            case 'medicalScan':
                file_input = document.getElementById("medicalScanUpload");
                break;
            case 'healthInsurance':
                file_input = document.getElementById("medicalInsuranceUpload");
                break;
        }
        file_input.click();
    };


    $scope.uploadMedicalScanHealthInsurance = function(files,fileType){
        console.log(fileType)
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadSportsmanFile/'+$scope.user.id+'/'+fileType, fd, {
            method:'POST',
            URL : constants.serverUrl + '/private/uploadSportsmanFile/',
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

    $scope.sportsmanFileDownload = function(path,fileType){
        let downSportsmaFile;
        switch (fileType) {
            case 'medicalScan':
                downSportsmaFile = document.getElementById("downSportsmanMedicalScan");
                break;
            case 'healthInsurance':
                downSportsmaFile = document.getElementById("downSportsmanHealthInsurance");
                break;
        }

        let splitedFilePath = path.split('/');
        let fileId = splitedFilePath[splitedFilePath.length - 2];
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadSportsmanFile/' + token + '/' + fileId+'/'+$scope.user.id+'/'+fileType;
        downSportsmaFile.setAttribute('href', url);
        downSportsmaFile.click();

    };


    $scope.btnPressed =function() {
        console.log("btn pressed");
        let file_input = document.getElementById("profilePicUpload");
        file_input.click();
    };


    $scope.submit = function (isValid) {
        if (isValid) {
            let data = {
                id: $scope.user.id,
                firstName: $scope.user.firstname,
                lastName: $scope.user.lastname,
                phone: $scope.user.phone,
                email: $scope.user.email,
                birthDate: $filter('date')($scope.user.birthdate, "MM/dd/yyyy"),
                address: $scope.user.address,
                sex: $scope.user.sex,
                oldId: oldId,
                sportStyle: $scope.user.sportStyle
            }
            sportsmanService.updateProfile(data)
                .then(function (result) {
                    toastNotificationService.successNotification("המשתמש עודכן בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    sportsmanService.watchProfile($scope.user.id);
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

    sportsmanService.getSportsmanProfile({id: parseInt($routeParams.id)})
        .then(function (result) {
            console.log("reload page")
            $scope.user = result.data;
            //$scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
            $scope.user.birthdate = new Date($scope.user.birthdate);
            // $scope.user.medicalScan = "https://drive.google.com/file/d/1h0JO7_izq_nYBLvmfQRtSvABKvpQCkgM/preview";
            console.log($scope.user);
            medicalScanIframe.src = $scope.user.medicalScan ? $scope.user.medicalScan : "";
            insuranceIframe.src = $scope.user.insurance ? $scope.user.insurance : "";
            oldId = $scope.user.id;
        }, function (error) {
            console.log(error)
        });

    $scope.delProfile = function (id) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את פרופיל המשתמש?", function () {
            let data = {
                userID: id
            };
            userService.deleteProfile(data)
                .then(function (reusult) {
                    toastNotificationService.successNotification("משתמש נמחק בהצלחה");
                    $location.path("/users/sportsmen");

                }, function (error) {
                    console.log(error)
                })
        });
    }
});
