app.controller("competitionsToJudgeController", function ($scope, $window, $http, competitionService, pagingService, constants, SocketService) {
    $scope.sportStyles = constants.sportStyleEnum;
    $scope.compStatus = constants.compStatus;
    $scope.compStatusType = constants.compStatusType;

    getDisplayData();


    function getDisplayData() {
         competitionService.getCompetitionsToJudge()
            .then(function (result) {
                $scope.competitions = result.data;
                $scope.competitions.forEach(comp => comp.startHour = comp.startHour.substring(0, comp.startHour.length - 1));
                askForStartedCompetitions()
            }, function (error) {
                console.log(error)
            });
    }


    function askForStartedCompetitions() {
        SocketService.emit('isCompetitionStart', {userId :$window.sessionStorage.getItem('id'),userId :$window.sessionStorage.getItem('id')})
    }

    SocketService.on('masterStartCompetition', function (data) {
        console.log(`master start comp ${data.idComp}`)
        console.log($scope.competitions)
        let comp = $scope.competitions.find((comp) => comp.idCompetition == data.idComp)
        comp.compOpen = true;
        clearInterval(updateCompState)
    })
    $scope.watchCompDetails = competitionService.watchCompDetails;
    $scope.startJudgingCompetition = function (compId, isMaster, status) {
        this.compId = compId;
        this.isMaster = isMaster;
        this.status = status;
        if (isMaster)
            competitionService.openCheckInJudgesModal(compId, function () {
                competitionService.startJudgingCompetition(compId, isMaster, status);
            });
        else {
            competitionService.startJudgingCompetition(compId, isMaster, status);
        }
    }

    let updateCompState =setInterval(askForStartedCompetitions,1000);

});
