app.controller("competitionsToJudgeController", function ($scope, $window, $http, competitionService, pagingService, constants,SocketService) {
    $scope.sportStyles = constants.sportStyleEnum;
    $scope.compStatus = constants.compStatus;
    $scope.compStatusType = constants.compStatusType;

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
    $scope.startJudgingCompetition = function (compId,isMaster,status){
        competitionService.openCheckInJudgesModal(compId);
        // competitionService.startJudgingCompetition(compId,isMaster,status);
    }

});
