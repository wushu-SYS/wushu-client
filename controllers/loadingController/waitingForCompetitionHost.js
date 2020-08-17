app.controller("waitingForCompetitionHost", function ($scope, $route,$routeParams, SocketService,competitionService) {
    $scope.loadingMessage = "המתן שהתחרות תתחיל"

    SocketService.emit('judgeEnterToCompetition',{userId :$window.sessionStorage.getItem('id'),idComp : $routeParams.idComp})

    SocketService.emit('isCompetitionStart',{userId :$window.sessionStorage.getItem('id'),idComp:$routeParams.idComp})

    SocketService.on('masterStartCompetition',function (data) {
        if(data.idComp==$routeParams.idComp)
            competitionService.startJudgingCompetition(data.idComp,0,'start')

    })




});

