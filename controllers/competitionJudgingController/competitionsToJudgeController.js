app.controller("competitionsToJudgeController", function ($scope, $window, $http, competitionService, pagingService, constants) {
    $scope.sportStyles = constants.sportStyleEnum;

    getDisplayData();
    function getDisplayData() {
        competitionService.getCompetitionsToJudge()
            .then(function (result) {
                $scope.competitions = result.data;
                $scope.competitions.forEach(comp => comp.startHour = comp.startHour.substring(0, comp.startHour.length-1));
            }, function (error) {
                console.log(error)
            });
    }

    $scope.watchCompDetails = competitionService.watchCompDetails;
    $scope.startJudgingCompetition = competitionService.startJudgingCompetition;

});
