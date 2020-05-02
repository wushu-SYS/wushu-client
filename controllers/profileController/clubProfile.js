app.controller("clubProfileController", function ($scope, $http, $route, $filter, $window, $location, $rootScope, $routeParams, $uibModal, clubService, constants, coachService, userService, confirmDialogService, toastNotificationService, chartsService, chartsDataService) {

    $scope.whoAmI = "מועדון";
    $scope.regex = constants.regex;

    getDisplayData();

    function getDisplayData() {
        clubService.getClubProfile($routeParams.id)
            .then(function (result) {
                $scope.club = result.data;
                getCharts();
            }, function (error) {
                console.log(error)
            });

        clubService.getAgudas()
            .then(function (result) {
                $scope.agudas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getErgons()
            .then(function (result) {
                $scope.ergons = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    function getCharts() {
        getTreeClubChart();
        getParticipateChart()
    }

    function getParticipateChart() {
        chartsDataService.clubsParticipateSportsmanCompetitions($routeParams.id)
            .then((res)=>{
                $scope.clubSportsmanParticipateCompData = []
                res.data.forEach((row)=>{
                    $scope.clubSportsmanParticipateCompData.push({
                        key: "ב-" +" "+ row.numComps + " "+ "תחרויות",
                        y :  row.count
                    })
                })
            })


        $scope.clubSportsmanParticipateCompOptions = chartsService.pieCharts("אחוזי השתתפות ספורטאים בתחרויות")
    }

    function getTreeClubChart() {
        chartsDataService.clubTreeData($routeParams.id)
            .then((res) => {
                console.log(res)
                let childrenLastLevel = [];
                let children = [];
                res.data.forEach(record => {
                    console.log(record.coach.photo)
                    record.sportsman.forEach(sportsman => {
                        childrenLastLevel.push({
                            text: {
                                name: sportsman.sportsmanFirstName + " " + sportsman.sportsmanLastName,
                                title: "ספורטאי",
                                contact: {
                                    val: "צפה בפרופיל",
                                    href: "#!/profile/sportsmanProfile/" + sportsman.sportsmanId,
                                    target: "_self"
                                }
                            },
                            image: sportsman.sportsmanPhoto
                        })
                    })
                    children.push({
                        text: {
                            name: record.coach.firstName + " " + record.coach.lastName,
                            title: "מאמן",
                            contact: {
                                val: "צפה בפרופיל",
                                href: "#!/profile/coachProfile/" + record.coach.id,
                                target: "_self",
                            }
                        },
                        image: record.coach.photo,
                        stackChildren: true,
                        children: childrenLastLevel
                    })
                });
                $scope.chart_config = {
                    chart: {
                        container: "#basic-example",
                        connectors: {
                            type: 'step'
                        },
                        node: {
                            HTMLclass: 'nodeExample1'
                        }
                    },
                    nodeStructure: {
                        text: {
                            name: $scope.club.name,
                            title: "מועדון"
                        },
                        image: "././resources/images/symbol.jpg",
                        children: children
                    }
                }
                new Treant($scope.chart_config)
            }).catch((err) => {
            console.log(err)
        })
    }


    $scope.submit = function (isValid) {
        if (isValid) {
            clubService.updateClub($scope.club)
                .then(function (result) {
                    toastNotificationService.successNotification("העדכון בוצע בהצלחה");
                    $scope.isSaved = true;
                    $scope.isEditModeOn = false;
                    clubService.getClubProfile($scope.club.id);
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
});
