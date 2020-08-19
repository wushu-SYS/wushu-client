app.controller("sportsmanProfileController", function ($scope, $http, $filter, $window, $location, $rootScope, $route, $routeParams, constants, sportsmanService, userService, confirmDialogService, toastNotificationService, chartsDataService, chartsService, commonFunctionsService) {
    var oldId;
    $scope.whoAmI = "ספורטאי";
    $scope.userType = $rootScope.userTypes.SPORTSMAN;
    $scope.isEditModeOn = false;
    $scope.currentDate = new Date();
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyleEnum = constants.sportStyleEnum;
    $scope.regex = constants.regex;
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine;

    let medicalScanIframe = document.getElementById("medicalScanIframe");
    let insuranceIframe = document.getElementById("insuranceIframe");


    $scope.uploadFile = function (files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadUserProfileImage/' + $scope.user.id + '/sportsman', fd, {
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
                sleep(1000)
                    .then(() => {
                        $window.location.reload()
                    })
            }).catch(() => {
        })

    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $scope.sportsmanFileUpload = function (type) {
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


    $scope.uploadMedicalScanHealthInsurance = function (files, fileType) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http.post(constants.serverUrl + '/private/uploadSportsmanFile/' + $scope.user.id + '/' + fileType, fd, {
            method: 'POST',
            URL: constants.serverUrl + '/private/uploadSportsmanFile/',
            headers: {
                'Content-Type': undefined,
                'x-auth-token': $window.sessionStorage.getItem('token'),
            },
            transformRequest: angular.identity
        })
            .then(() => {
                toastNotificationService.successNotification("הקובץ הועלה בהצלחה");
                sleep(1000)
                    .then(() => {
                        $window.location.reload()
                    })

            }).catch(() => {
        })
    };

    $scope.sportsmanFileDownload = function (path, fileType) {
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
        let url = constants.serverUrl + '/downloadSportsmanFile/' + token + '/' + fileId + '/' + $scope.user.id + '/' + fileType;
        downSportsmaFile.setAttribute('href', url);
        downSportsmaFile.click();

    };


    $scope.btnPressed = function () {
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
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if ($scope.updateProfile.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.updateProfile.$valid) $scope.isClicked = true
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.updateProfile.$valid);
        }
    });

    sportsmanService.getSportsmanProfile({id: parseInt($routeParams.id)})
        .then(function (result) {
            $scope.user = result.data;
            //$scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
            $scope.user.birthdate = new Date($scope.user.birthdate);
            // $scope.user.medicalScan = "https://drive.google.com/file/d/1h0JO7_izq_nYBLvmfQRtSvABKvpQCkgM/preview";
            medicalScanIframe.src = $scope.user.medicalScan ? $scope.user.medicalScan : "";
            insuranceIframe.src = $scope.user.insurance ? $scope.user.insurance : "";
            oldId = $scope.user.id;
            getSportsmanRank();
            getCharts()
        }, function (error) {
            console.log(error)
        });

    function getCharts() {
        //Array month start from 0 - september : 8
        let startDate = new Date(commonFunctionsService.getSessionYear(), 8, 1)
        let endDate = new Date(commonFunctionsService.getSessionYear() + 1, 8, 1)
        getParticipateChart()
        getSportsmanGradeChart(startDate, endDate)
        getJudgeGradeStaticChart(startDate, endDate)
    }

    function getParticipateChart() {
        chartsDataService.participateSportsmanCompetitions($routeParams.id)
            .then((res) => {

                $scope.participateCompetitionsData = [
                    {
                        key: "השתתף",
                        y: res.data.sportsmanCompCount
                    },
                    {
                        key: "לא השתתף",
                        y: res.data.notParticipate
                    }]
                $scope.participateCompetitionsOptions = chartsService.pieCharts("אחוזי השתתפות בתחרויות")

            }).catch((err) => {
            console.log(err)
        })
    }

    function getSportsmanGradeChart(startDate, endDate) {
        chartsDataService.sportsmanCompetitionsGrades($routeParams.id)
            .then((res) => {
                let shape = 'circle';
                $scope.sportsmanCompetitionsGradesData = []
                for (let i = 0; i < res.data.categories.length; i++) {
                    let grades = res.data.resultes.filter(grade => grade.name == res.data.categories[i])
                    let gradesValues = []
                    grades.forEach((grade) => {
                        let date = new Date(grade.date)
                        gradesValues.push({
                            x: date.getTime(),
                            y: grade.grade,
                            size: Math.random(),
                            shape: shape
                        })
                    })
                    $scope.sportsmanCompetitionsGradesData.push({
                        key: res.data.categories[i],
                        values: gradesValues
                    })

                }
                $scope.sportsmanCompetitionsGradesOptions = chartsService.scatterChart("גרף ציונים סופיים לעונה", "לפי קטגוריה", "תאריך תחרות", "ציון", startDate.getTime(), endDate.getTime())

            }).catch((err) => {
            console.log(err)
        })
    }

    $scope.setSportsmanJudgeGradesChartData = function (selectedCategory) {
        $scope.updateProfile.$dirty = false;
        $scope.sportsmanJudgesGradesData = []
        let containedJudgeIds = [...new Set($scope.allSportsmanJudgeGrades.map(record => record.judgeId))];
        let filteredBySelectedCategory = $scope.allSportsmanJudgeGrades.filter(record => record.categoryId == selectedCategory.id);
        containedJudgeIds.forEach(judgeId => {
            let values = [];
            let key = undefined;
            filteredBySelectedCategory.filter(record => record.judgeId == judgeId)
                .forEach(record => {
                    key = record.judgeFirstName + " " + record.judgeLastName;
                    values.push({x: record.date, y: record.grade})
                })
            $scope.sportsmanJudgesGradesData.push({
                key: key,
                values: values
            })
        })
    }

    function getJudgeGradeStaticChart(startDate, endDate) {
        chartsDataService.sportsmanJudgeGrades($routeParams.id)
            .then((res) => {
                $scope.categoriesForJudgeGradesChart = res.data.categories;
                if ($scope.categoriesForJudgeGradesChart.length > 0) {
                    $scope.selectedCategoryForJudgeGradesChart = $scope.categoriesForJudgeGradesChart[0]
                    $scope.allSportsmanJudgeGrades = res.data.resultes;
                    $scope.setSportsmanJudgeGradesChartData($scope.selectedCategoryForJudgeGradesChart );
                }
                $scope.sportsmanJudgesGradesOptions = chartsService.barChart("גרף ציוני שופטים בעונה", "", "תאריך", "ציון", startDate, endDate);
            }).catch((err) => {
            console.log(err)
        })
    }

    function getSportsmanRank() {
        if ($rootScope.access != $rootScope.userTypes.SPORTSMAN)
            sportsmanService.getSportsmanRank({id: parseInt($routeParams.id)})
                .then((function (result) {
                    $scope.sportsmanRank = result.data[0].rank ? result.data[0].rank : "-"
                }), function (err) {
                    console.log(err)
                })
    }

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
