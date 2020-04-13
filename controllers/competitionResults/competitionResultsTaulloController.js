app.controller("competitionResultsTaulloController", function ($scope, $http, $routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    getDisplayData()
    function getDisplayData() {
        // competitionService.getResultCompetition($routeParams.idComp)
        //     .then(function (result) {
        //         $scope.compResults = result.data;
        //     }, function (error) {
        //         console.log(error);
        //     })
    }
});
