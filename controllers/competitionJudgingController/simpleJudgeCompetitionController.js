app.controller("judgingCompetitionSimple", function ($scope, $http, $window,$routeParams ,$location, constants, SocketService,categoryService,competitionService) {
    $scope.regex = constants.regex;
    $scope.disableButtonNext = false;

    getDisplayDitails()
    function getDisplayDitails() {
        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {console.log(error)})
    }
    function get() {
        SocketService.emit('whoIsNextSportsman', {idComp: $routeParams.idComp});
    }


    SocketService.on("nextSportsman",function (data) {
        if($scope.currentSportsman==undefined) {
            $scope.currentSportsman = data.sportsman
            $scope.currentCategory = data.category
        }
    })

    get()
    $scope.getAgeRange = categoryService.getAgeRange;

    $scope.nextSportsman = function () {
        let preSportsman = $scope.currentSportsman.id
        get()
        if (preSportsman== $scope.currentSportsman.id)
            competitionService.waitsForNextSportsman($routeParams.idComp,preSportsman)
        $scope.grade= ''
    }

});
