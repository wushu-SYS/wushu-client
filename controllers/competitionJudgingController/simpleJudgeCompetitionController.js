app.controller("judgingCompetitionSimple", function ($scope, $http, $window,$routeParams ,$location, constants, SocketService,categoryService,competitionService) {
    $scope.regex = constants.regex;
    $scope.disableButtonNext = false;

    $scope.currentCategoryIndex = 0;
    $scope.currentSportsmanIndex = 0;
    getDisplayDitails()
    async function getDisplayDitails() {


        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {console.log(error)})
    }
    function get() {
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

    get()
    $scope.getAgeRange = categoryService.getAgeRange;

    $scope.nextSportsman = function () {
        SocketService.emit("judgeGiveGrade",{ userId:$window.sessionStorage.getItem('id'),idComp:$routeParams.idComp ,grade :$scope.grade})
        let preSportsman = $scope.currentSportsman.id
        get()
        if (preSportsman== $scope.currentSportsman.id)
            competitionService.waitsForNextSportsman($routeParams.idComp,preSportsman)
        $scope.grade= ''
    }

});
