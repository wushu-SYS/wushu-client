app.controller("judgingCompetitionMaster", function ($scope, $http, $routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    $scope.regex = constants.regex;
    $scope.isMaster = true;
    $scope.lastSportsman = false

    SocketService.emit('judgeMasterEnterToCompetition', {
        userId: $window.sessionStorage.getItem('id'),
        idComp: $routeParams.idComp
    })

    $scope.sportsmanGrade = new Map();
    $scope.sportsmanQueue = [];
    $scope.currentCategoryIndex = 0;
    $scope.currentSportsmanIndex = 0;
    getDisplayData()

    function getDisplayData() {
        competitionService.getRegistrationState($routeParams.idComp)
            .then(function (result) {
                $scope.sportsmanQueue = result.data;
                $scope.sportsmanQueue.forEach(categorySportsman => {
                    let sportsmans = new Map();
                    categorySportsman.users.forEach(sportsman =>
                        sportsmans.set(sportsman.id, {
                            id: sportsman.id,
                            firstname: sportsman.firstname,
                            lastname: sportsman.lastname,
                            judgeGrades: {}
                        }));
                    $scope.sportsmanGrade.set(categorySportsman.category.id, sportsmans)
                });

              //  $scope.sportsmanGrade.get(38).get(333456416).judgeGrades[305077911] = 10;


                $scope.currentCategory = $scope.sportsmanQueue[$scope.currentCategoryIndex].category;
                $scope.currentSportsman = $scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex];
                SocketService.emit('setNextSportsman', {
                    userId: $window.sessionStorage.getItem('id'),
                    idComp: $routeParams.idComp,
                    sportsman: $scope.currentSportsman,
                    category: $scope.currentCategory
                })

            }, function (error) {
                console.log(error)
            });

        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {
            console.log(error)
        })

        competitionService.getRegisteredJudges($routeParams.idComp)
            .then(function (result) {
                $scope.judges = result.data.filter((judge) => judge.isMaster == 0);
             //    $scope.judges.forEach((judge) => judge.isGraded = true)
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                console.log(error)
            });

    }

    SocketService.on('judgeGiveGrade', function (data) {
        console.log("given grade")
        let judge = $scope.judges.find((judge) => judge.idJudge == data.userId)
        judge.isGraded = true;
        $scope.sportsmanGrade.get($scope.currentCategory.id).get($scope.currentSportsman.id).judgeGrades[judge.idJudge] = data.grade;
    })
    $scope.sendGrade = function (finish) {
        $scope.sportsmanGrade.get($scope.currentCategory.id).get($scope.currentSportsman.id).masterGrade = $scope.grade;
        $scope.reCalcFinalGrade($scope.currentCategory, $scope.currentSportsman);

        $scope.grade = ''
        $scope.judges.forEach((judge) => judge.isGraded = false)
    }
    $scope.nextSportsman = function () {
        $scope.sendGrade();

        $scope.currentSportsmanIndex++
        if (!$scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex]) {
            $scope.currentSportsmanIndex = 0
            $scope.currentCategoryIndex++
        }
        $scope.currentCategory = $scope.sportsmanQueue[$scope.currentCategoryIndex].category;
        $scope.currentSportsman = $scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex];

        SocketService.emit('setNextSportsman', {
            userId: $window.sessionStorage.getItem('id'),
            idComp: $routeParams.idComp,
            sportsman: $scope.currentSportsman,
            category: $scope.currentCategory
        })
    }

    $scope.getAgeRange = categoryService.getAgeRange;
    $scope.calcAverage = competitionService.calcAverageGrade;
    $scope.reCalcFinalGrade = function (category, sportsman) {
        $scope.sportsmanGrade.get(category.id).get(sportsman.id).finalGrade = competitionService.calcAverageGrade($scope.sportsmanGrade.get(category.id).get(sportsman.id).judgeGrades, $scope.sportsmanGrade.get(category.id).get(sportsman.id).masterGrade);
    };
    $scope.isDisableSaveButton = function (category, sportsman) {
        let masterGrade = $scope.sportsmanGrade.get(category.id).get(sportsman.id).masterGrade;
        let isMasterValid = masterGrade && masterGrade != '' && $scope.regex.regexForCompetitionGrade.test(masterGrade);

        let judgeGrades = $scope.sportsmanGrade.get(category.id).get(sportsman.id).judgeGrades;
        let isJudgesGradeValid = Object.keys(judgeGrades).length != 0;
        for (var key in judgeGrades) {
            isJudgesGradeValid = isJudgesGradeValid && judgeGrades[key] && judgeGrades[key] != '' && $scope.regex.regexForCompetitionGrade.test(judgeGrades[key])
        }

        return !(isMasterValid && isJudgesGradeValid);
    };
    $scope.isAllGradesApproved = function () {
        let allSaved = true;
        $scope.sportsmanGrade.forEach(category => {
            category.forEach(s => allSaved = allSaved && s.isSaved);
        })
        return allSaved;
    };
    $scope.categoryHasUnSavedSportsman = function (category) {
        let isAllSaved = true;
        category.forEach(sportsman => {
            if (!sportsman.isSaved)
                isAllSaved = false;
        });
        return !isAllSaved;
    };
    $scope.isDisableNextSportsmanButton = function () {
        return $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;
    };

    $scope.saveGrades = function (sportsman, category) {
        let judeges = []
        for (let i in sportsman.judgeGrades) {
            judeges.push({idJudge: i, grade: parseFloat(sportsman.judgeGrades[i])})
        }
        judeges.push({idJudge: [$window.sessionStorage.getItem('id')], grade: parseFloat(sportsman.masterGrade)})
        let data = {
            idComp: $routeParams.idComp,
            idSportsman: sportsman.id,
            idCategory: category.id,
            judges: judeges,
            avgGrade: sportsman.finalGrade

        };
        competitionService.saveSportsmanGrade(data)
            .then((res) => {
                SocketService.emit("masterJudgeSaveGrade", {
                    userId: $window.sessionStorage.getItem('id'), sportsman: {
                        idComp: $routeParams.idComp,
                        idSportsman: sportsman.id,
                        idCategory: category.id,
                        avgGrade: sportsman.finalGrade
                    },idComp :$routeParams.idComp
                })

                sportsman.isSaved = true;
            })
    }
    $scope.closeCompetition = function () {
        competitionService.manualCloseCompetition($routeParams.idComp)
            .then((res) => {
                SocketService.emit("judgeMasterCloseCompetition",{userId:$window.sessionStorage.getItem('id'),idComp:$routeParams.idComp})
                $location.path("/home")
            })
            .catch((err) => {
                console.log(err)
            })
    }

});
