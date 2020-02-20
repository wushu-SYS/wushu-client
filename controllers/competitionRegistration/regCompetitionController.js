app.controller("regCompetitionController", function ($scope, $routeParams, $location) {
    $scope.go = function (destination) {
        let compId = $routeParams.idComp;
        if(destination === 'sportsman')
            $location.path("/sportsmanCompetitionRegistration/" + compId);
        else if(destination === 'judge')
            $location.path("/judgeCompetitionRegistration/" + compId);
    }
});
