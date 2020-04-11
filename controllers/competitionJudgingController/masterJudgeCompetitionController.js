app.controller("judgingCompetitionMaster", function ($scope, $http,$routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    $scope.regex = constants.regex;
    $scope.disableButtonNext = $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;;

    SocketService.emit('judgeMasterEnterToCompetition',{userId :$window.sessionStorage.getItem('id'),idComp : $routeParams.idComp})

    $scope.sportsmanGrade = new Map();
    $scope.sportsmanQueue = [];
    $scope.currentCategoryIndex = 0;
    $scope.currentSportsmanIndex = 0;
    getDisplayData()
    function getDisplayData() {
        competitionService.getRegistrationState($routeParams.idComp)
            .then(function (result) {
               $scope.sportsmanQueue  = result.data;
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

                // $scope.sportsmanGrade.get(20).get(217418712).judgeGrades[305077911] = 10;


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
                $scope.judges = result.data
                // $scope.judges.forEach((judge)=>judge.isGraded=true)
                // $scope.disableButtonNext = $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                console.log(error)
            });

    }
    SocketService.on('judgeGiveGrade',function (data) {
        console.log("given grade")
        let judge= $scope.judges.find((judge)=>judge.idJudge ==data.userId)
        judge.isGraded=true;
        $scope.sportsmanGrade.get($scope.currentCategory.id).get($scope.currentSportsman.id).judgeGrades[judge.idJudge] = data.grade;
        console.log($scope.sportsmanGrade);
        $scope.disableButtonNext = $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;
    })
    $scope.nextSportsman=function(){
        $scope.sportsmanGrade.get($scope.currentCategory.id).get($scope.currentSportsman.id).masterGrade = $scope.grade;
        console.log($scope.sportsmanGrade)

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

    $scope.saveGrades = function () {

    }
});
