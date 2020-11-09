app.controller("registerController", function ($scope, $rootScope, $http, $window, $location, $filter, clubService, excelService, coachService, registerService, constants, confirmDialogService, toastNotificationService) {
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyleEnum = constants.sportStyleEnum;
    $scope.regex = constants.regex;
    $scope.currentDate = new Date();
    $scope.userType = 'sportsman';
    let access = $window.sessionStorage.getItem('access');

    getDisplayData();

    /**
     * the function bring from the server all the needed data to this screen
     */

    async function getDisplayData() {
        await getCoaches()
        await getClubs();
        switch (parseInt(access)) {
            case $rootScope.userTypes.COACH:
                $scope.sportclub = $filter('filter')($scope.clubs, function (obj) {
                    return obj.id == $window.sessionStorage.getItem('sportclub');
                    ;
                })[0];
                document.getElementById("sportclub").disabled = true;
                break;
        }
    }

    async function getClubs() {
        await clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    async function getCoaches() {
        coachService.getCoaches()
            .then(function (result) {
                $scope.allcoaches = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.filterClub = function () {
        $scope.sportclub = $filter('filter')($scope.clubs, function (obj) {
            return obj.id === $scope.coach.sportclub;
        })[0];
    };

    /*** manual registration ***/
    $scope.submit = async function (isValid) {
        let data = [];
        if (isValid) {
            switch ($scope.userType) {
                case "sportsman":
                    data.push({
                        id: $scope.id,
                        firstName: $scope.firstname,
                        lastName: $scope.lastname,
                        phone: $scope.phone,
                        address: $scope.address,
                        birthDate: $filter('date')($scope.birthdate, "MM/dd/yyyy").toString(),
                        email: $scope.email,
                        sportClub: $scope.sportclub.id,
                        sex: $scope.selectedSex,
                        sportStyle: $scope.sportStyle,
                        idCoach: $scope.coach.id
                    });
                    break;
                case "coach":
                    data.push({
                        id: $scope.id,
                        firstName: $scope.firstname,
                        lastName: $scope.lastname,
                        phone: $scope.phone,
                        address: $scope.address,
                        email: $scope.email,
                        birthDate: $filter('date')($scope.birthdate, "MM/dd/yyyy").toString(),
                        sportClub: $scope.sportclub.id,
                    });
                    break;
                case "judge":
                    data.push({
                        id: $scope.id,
                        firstName: $scope.firstname,
                        lastName: $scope.lastname,
                        phone: $scope.phone,
                        email: $scope.email,

                    });
                    break;
            }
            registerUsers(data, $scope.userType)
        }
    };

    function registerUsers(data, userType) {
        registerService.registerUsers(data, userType)
            .then((results) => {
                $scope.isSaved = true;
                toastNotificationService.successNotification("הרישום בוצע בהצלחה");
                $location.path("/home");
            })
            .catch((err) => {
                console.log(err);
                if (err.data) {
                    if (err.data.number === 2627)
                        toastNotificationService.errorNotification("ת.ז " + getIdFromErrorMessage(err.data.message) + " קיימת כבר במערכת.");
                    else {
                        toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע הרישום. אנא פנה לתמיכה טכנית");
                    }
                } else
                    toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע הרישום");
            })
    }

    $scope.checkExistId = function () {
        if ($scope.id != undefined) {
            registerService.checkExistUser($scope.id)
                .then((results) => {
                    let userData = results.data
                    fillDataUser(userData)
                    $scope.idChecked = true;
                    $scope.idFound = true
                })
                .catch((err) => {
                    $scope.emptyFields()
                    $scope.idChecked = true;
                    $scope.idFound = false
                })
        }

    }


//excel side------------------------------------------------------------------------------------------------------------
    let dropZoneRegisterUsers = document.getElementById("dropZoneRegisterUsers");
    let downloadExcelLink = document.getElementById("downExcelSportsman");
    let downloadExcelLinkCoaches = document.getElementById("downExcelCoach");
    let downloadExcelLinkJudge = document.getElementById("downExcelNewJudge");
    let downloadExcelLinkCoachAsJudge = document.getElementById("downExcelCoachJudge");

    $scope.downloadExcelRegisterSportsMan = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatSportsman/' + token;
        downloadExcelLink.setAttribute('href', url);
        downloadExcelLink.click();
    };
    $scope.downloadExcelRegisterCoaches = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatCoach/' + token;
        downloadExcelLinkCoaches.setAttribute('href', url);
        downloadExcelLinkCoaches.click()
    };
    $scope.downloadExcelRegisterJudge = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatJudge/' + token;
        downloadExcelLinkJudge.setAttribute('href', url);
        downloadExcelLinkJudge.click()
    };
    $scope.downloadExcelRegisterCoachAsJudge = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatCoachAsJudge/' + token;
        downloadExcelLinkCoachAsJudge.setAttribute('href', url);
        downloadExcelLinkCoachAsJudge.click()
    };


    function registerExcelUsers(data, userType) {
        registerService.registerUsersExcel(data, userType)
            .then((results) => {
                $scope.isSaved = true;
                toastNotificationService.successNotification("הרישום בוצע בהצלחה");
                $location.path("/home");
            })
            .catch((err) => {
                console.log(err);
                toastNotificationService.errorNotification("ארעה שגיאה בעת ביצוע הרישום")
                if (!err.data.message)
                    $scope.excelErrors = err.data;
                else {
                    let serverErrors = [];
                    if (err.data.number === 547)
                        serverErrors.push("ת.ז מאמן לא קיימת במערכת");
                    if (err.data.number === 2627)
                        serverErrors.push("ת.ז " + getIdFromErrorMessage(err.data.message) + " קיימת כבר במערכת.");
                    if (serverErrors.length > 0)
                        $scope.excelErrors = [{errors: serverErrors}]
                }
            })
    }

    /**
     * set the drop zone
     */
    dropZoneRegisterUsers.ondragover = function () {
        this.className = 'dropzone dragover';
        return false;
    };
    dropZoneRegisterUsers.ondragleave = function () {
        this.className = 'dropzone';
        return false;
    };
    dropZoneRegisterUsers.ondrop = function (e) {
        let user = $scope.userType
        excelService.dropZoneDropFile(e, function (res) {
            changeDropZone(res.fileName);
            res.result.shift();
            if (res.fileName.includes(constants.fileName.coachAsJudge))
                user = 'coachAsJudge'
            registerExcelUsers(res.result, user)
        })
    };

    function changeDropZone(name) {
        let nameArray = name.toString().split("\\");
        $scope.filename = nameArray[nameArray.length - 1];
        $scope.isDropped = true;
        dropZoneRegisterUsers.className = "dropzoneExcel"
    }

    $scope.BrowseFileClick = function () {
        let user = $scope.userType
        let fileinput = document.getElementById("fileSportsman");
        fileinput.click();
        fileinput.onchange = function (event) {
            excelService.uploadExcel(event, function (res) {
                changeDropZone(event.target.value.toString());
                res.shift();
                if (event.target.value.toString().includes(constants.fileName.coachAsJudge))
                    user = 'coachAsJudge'
                registerExcelUsers(res, user)
            })

        }
    };
    $scope.uploadNewFile = function () {
        $scope.excelErrors = [];
        $scope.isDropped = false;
        dropZoneRegisterUsers.className = "dropzone"
        document.getElementById("fileSportsman").value = "";
    };
//----------------------------------------------------------------------------------------------------------------------

    // fillDataTmpFunction();
    function fillDataUser(data) {
        console.log(data)
        $scope.firstname = data.firstname
        $scope.lastname = data.lastname
        $scope.phone = data.phone;
        $scope.email = data.email;

        $scope.address = data.address
        $scope.addressFilled = !!data.address

        $scope.selectedSex = data.sex
        $scope.selectedSexFilled = !!data.sex

        $scope.birthdate = new Date(data.birthdate);
        $scope.birthdateFilled = !!data.birthdate

        $scope.sportStyle = data.sportStyle
        $scope.sportStyleFilled = !!data.sportStyle

        $scope.sportclub = $scope.clubs.find(club => club.id == data.clubId)
        $scope.sportclubFilled = !!data.clubId

        $scope.coach = $scope.allcoaches.find(coach => coach.id == data.coachId)
        $scope.coachFilled = !!data.coachId
    }

    /*
    $scope.fillData = function (coach) {
         if (coach!==null) {
            $scope.judgeFill = true;
            $scope.id = coach.id;
            $scope.firstname = coach.firstname;
            $scope.lastname = coach.lastname;
            $scope.phone = coach.phone;
            $scope.email = coach.email;
        } else {
            $scope.judgeFill = false;
             $scope.emptyFields()
            // $scope.id = '';
            // $scope.firstname = '';
            // $scope.lastname = '';
            // $scope.phone = '';
            // $scope.email = '';
            // $scope.address = '';
            // $scope.birthdate = '';
            // $scope.sportclub = $scope.clubs.find(club => club.name === 'בחר מועדון ספורט');
        }
    }
     */


    function getIdFromErrorMessage(error) {
        let parts = error.split('(');
        return parts[parts.length - 1].substring(0, parts[parts.length - 1].length - 2)
    }

    $scope.emptyFields = function () {
        //$scope.id = '';
        $scope.firstname = '';
        $scope.lastname = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.address = '';
        $scope.birthdate = '';
        $scope.sportclub = $scope.clubs.find(club => club.name === 'בחר מועדון ספורט');
    }
    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if ($scope.registerForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.registerForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.registerForm.$valid);
        }
    });
});


