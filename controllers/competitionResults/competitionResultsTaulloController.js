app.controller("competitionResultsTaulloController", function ($scope, $http, $routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    getDisplayData()
    function getDisplayData() {
        competitionService.getResultCompetition($routeParams.idComp)
            .then(function (result) {
                $scope.compResults = result.data;
            }, function (error) {
                console.log(error);
            })
    }


    let downloadExcelLinkCoachAsJudge = document.getElementById("downExcelResultCompetition");

    $scope.downloadExcelResultCompetition = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatUpdateCompetitionResults/' + token+"/"+$routeParams.idComp;
        downloadExcelLinkCoachAsJudge.setAttribute('href', url);
        downloadExcelLinkCoachAsJudge.click();
    };
});
