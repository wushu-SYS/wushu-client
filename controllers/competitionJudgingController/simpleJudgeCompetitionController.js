app.controller("judgingCompetitionSimple", function ($scope, $http, $window,$routeParams ,$location, constants, SocketService,categoryService,competitionService, confirmDialogService, commonFunctionsService) {
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine;
    $scope.regex = constants.regex;
    $scope.disableButtonNext = false;
    $scope.isMaster = false;
    $scope.lastSportsman = false

    $scope.sportsmanGrade = new Map();
    $scope.currentCategoryIndex = 0;
    $scope.currentSportsmanIndex = 0;

    let sportsmanFinalGrades=[];

    getDisplayDetails()
        .then(()=>{})


    async function getDisplayDetails() {
        competitionService.getRegistrationState($routeParams.idComp)
            .then(function (result) {
                $scope.sportsmanQueue = result.data;
                $scope.sportsmanQueue.forEach(categorySportsman => {
                    let sportsmans = new Map();
                    categorySportsman.users.forEach(sportsman =>
                        sportsmans.set(sportsman.id, {
                            id: sportsman.id,
                            firstname: sportsman.firstname,
                            lastname: sportsman.lastname
                        }));
                    $scope.sportsmanGrade.set(categorySportsman.category.id, sportsmans)

                });
            }, function (error) {
                console.log(error)
            });

        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {console.log(error)})
    }



    function getNextSportsman() {
        SocketService.emit('whoIsNextSportsman', {userId :$window.sessionStorage.getItem('id'),idComp: $routeParams.idComp});
    }


    SocketService.on("nextSportsman",function (data) {
         competitionService.getRegistrationState($routeParams.idComp)
            .then( function (result) {
                $scope.sportsmanQueue =  result.data;
                if($scope.currentSportsman==undefined) {
                    $scope.currentSportsman = data.sportsman;
                    $scope.currentCategory = data.category;

                    $scope.currentCategoryIndex = $scope.sportsmanQueue.findIndex(categorySportsman => categorySportsman.category.id === $scope.currentCategory.id);
                    $scope.currentSportsmanIndex = $scope.sportsmanQueue[$scope.currentCategoryIndex].users.findIndex(sportsman => sportsman.id === $scope.currentSportsman.id);
                }
            }, function (error) {
                console.log(error)
            });

    })

    getNextSportsman()
    $scope.getAgeRange = categoryService.getAgeRange;

    $scope.sendGrade = function(finish){
        SocketService.emit("judgeGiveGrade",{ userId:$window.sessionStorage.getItem('id'),idComp:$routeParams.idComp ,grade :$scope.grade})
        if(finish)
            confirmDialogService.showMessage("תודה רבה!", function () { $location.path("/home") }, "התחרות הסתיימה");
    }
    $scope.nextSportsman = function () {
        $scope.sendGrade(false);
        let preSportsman = $scope.currentSportsman.id
        getNextSportsman()
        if (preSportsman== $scope.currentSportsman.id)
            competitionService.waitsForNextSportsman($routeParams.idComp,preSportsman)
        $scope.grade= ''
    }

    function getSportsmanFinalsGrades() {
        SocketService.emit("competitionFinalsGrades",{idComp:$routeParams.idComp,userId:$window.sessionStorage.getItem('id')})
    }

    let getFinalsGrades = setInterval(getSportsmanFinalsGrades,1000)
    SocketService.on("competitionFinalsGradesResults",function (data) {
        if(sportsmanFinalGrades.length!=data.length) {
            sportsmanFinalGrades = data;
            updateSportsmanFinalGrades();
        }
    })
    function updateSportsmanFinalGrades(){
        sportsmanFinalGrades.forEach(grade =>{
            $scope.sportsmanGrade.get(grade.idCategory).get(grade.idSportsman).finalGrade = grade.avgGrade;
        })
    }

    $scope.categoryHasUnSavedSportsman = function(category){
        return true;
    }

    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        clearInterval(getFinalsGrades);
        });
});

