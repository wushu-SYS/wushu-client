app.controller("waitingForTheNextSportsman", function ($scope,$window, $route, SocketService,$routeParams,competitionService) {
    $scope.loadingMessage = "המתן לספורטאי הבא"

    function waitForChange () {
        SocketService.emit('whoIsNextSportsman', {userId :$window.sessionStorage.getItem('id'),idComp: $routeParams.idComp});

        SocketService.on("nextSportsman", function (data) {
            if($routeParams.preSportsman != data.sportsman.id) {
                clearInterval(askForNextSportsman);
                competitionService.startJudgingCompetition($routeParams.idComp, 0, 'start')
            }
        })
    }
    let askForNextSportsman =setInterval(waitForChange, 1000);
});
