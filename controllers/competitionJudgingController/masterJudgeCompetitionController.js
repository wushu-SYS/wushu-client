app.controller("judgingCompetitionMaster", function ($scope, $http,$routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    $scope.regex = constants.regex;
    $scope.disableButtonNext = true;

    SocketService.emit('judgeMasterEnterToCompetition',{userId :$window.sessionStorage.getItem('id'),idComp : $routeParams.idComp})

    $scope.sportsmanQueue = [];
    $scope.currentCategoryIndex = 0;
    $scope.currentSportsmanIndex = 0;
    getDisplayData()
    function getDisplayData() {
        competitionService.getRegistrationState($routeParams.idComp)
            .then(function (result) {
               $scope.sportsmanQueue  = result.data;
               $scope.currentCategory = $scope.sportsmanQueue[$scope.currentCategoryIndex].category;
               $scope.currentSportsman = $scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex];
               SocketService.emit('setNextSportsman',{ userId :$window.sessionStorage.getItem('id'),idComp: $routeParams.idComp ,sportsman: $scope.currentSportsman,category : $scope.currentCategory })

            }, function (error) {
                console.log(error)
            });

        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {console.log(error)})

        competitionService.getRegisteredJudges($routeParams.idComp)
            .then(function (result) {
                $scope.judges = result.data;
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                console.log(error)
            });

    }
    SocketService.on('judgeGiveGrade',function (data) {
        console.log("given grade")
        let judge= $scope.judges.find((judge)=>judge.idJudge ==data.userId)
        judge.isGraded=true;
        $scope.disableButtonNext = $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;
    })
    $scope.nextSportsman=function(){
        $scope.currentSportsmanIndex++
        if(!$scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex]) {
            $scope.currentSportsmanIndex = 0
            $scope.currentCategoryIndex++
        }
        $scope.currentCategory = $scope.sportsmanQueue[$scope.currentCategoryIndex].category;
        $scope.currentSportsman = $scope.sportsmanQueue[$scope.currentCategoryIndex].users[$scope.currentSportsmanIndex];
        $scope.grade = ''
        $scope.judges.forEach((judge)=>judge.isGraded=false)
        SocketService.emit('setNextSportsman',{ userId :$window.sessionStorage.getItem('id') ,idComp: $routeParams.idComp ,sportsman: $scope.currentSportsman,category : $scope.currentCategory })

    }


    $scope.getAgeRange = categoryService.getAgeRange;

});
