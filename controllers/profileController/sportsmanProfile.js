app.controller("sportsmanProfileController", function ($scope, $http, $filter, $window, $location, $rootScope, $route, $routeParams, constants, sportsmanService, userService, confirmDialogService, toastNotificationService,chartsDataService,chartsService) {
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
            $scope.user = result.data;
            //$scope.user.photo = $scope.user.photo + '?' + new Date().getTime();
            $scope.user.birthdate = new Date($scope.user.birthdate);
            // $scope.user.medicalScan = "https://drive.google.com/file/d/1h0JO7_izq_nYBLvmfQRtSvABKvpQCkgM/preview";
            console.log($scope.user);
            medicalScanIframe.src = $scope.user.medicalScan ? $scope.user.medicalScan : "";
            insuranceIframe.src = $scope.user.insurance ? $scope.user.insurance : "";
            oldId = $scope.user.id;
            getSportsmanRank();
            getCharts()
        }, function (error) {
            console.log(error)
        });
    function getCharts() {
        getParticipateChart()

    }
    function getParticipateChart() {
        chartsDataService.participateSportsmanCompetitions($routeParams.id)
            .then((res)=>{

                $scope.participateCompetitionsData =[
                    {
                        key: "השתתף",
                        y: res.data.sportsmanCompCount
                    },
                    {
                        key: "לא השתתף",
                        y: res.data.notParticipate
                    }]
                $scope.participateCompetitionsOptions = chartsService.pieCharts("אחוזי השתתפות בתחרויות")

            }).catch((err)=>{
                console.log(err)
        })
    }
    function getSportsmanRank() {
        if($rootScope.access!=$rootScope.userTypes.SPORTSMAN)
            sportsmanService.getSportsmanRank({id: parseInt($routeParams.id)})
                .then((function (result) {
                    $scope.sportsmanRank = result.data[0].rank ? result.data[0].rank : "-"
                }),function (err) {
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

    $scope.options = {
        chart: {
            type: 'historicalBarChart',
            height: 450,
            width:450,
            margin : {
                top: 20,
                right: 20,
                bottom: 65,
                left: 50
            },
            x: function(d){return d[0];},
            y: function(d){return d[1]/100000;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.1f')(d);
            },
            duration: 100,
            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                },
                rotateLabels: 30,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10,
                tickFormat: function(d){
                    return d3.format(',.1f')(d);
                }
            },
            tooltip: {
                keyFormatter: function(d) {
                    return d3.time.format('%x')(new Date(d));
                }
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            }
        }
    };

    $scope.data = [
        {
            "key" : "Quantity" ,
            "bar": true,
            "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
        }];




});
