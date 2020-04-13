app.controller("competitionResultsTableController", function ($scope, $window, $http, competitionService, pagingService, constants) {
    $scope.sportStyles = constants.sportStyleEnum;
    $scope.compStatus = constants.compStatus;
    $scope.compStatusType = constants.compStatusType;
    $scope.headerTable = "תוצאות תחרויות";
    $scope.isShowStatus = false;
    $scope.pager = {};
    setPage(1);

    $scope.watchCompDetails = competitionService.watchCompDetails;
    $scope.watchResults = competitionService.watchResults;

    $scope.setPage = function(page){
        setPage(page);
    };

    function setPage(page) {
        if (page < 1 || (page > $scope.pager.totalPages && $scope.totalPages > 0)) {
            return;
        }

        competitionService.getCompetitonsCount(competitionService.buildConditions($scope.searchText, $scope.selectedsportStyle, [$scope.compStatus[constants.compStatusType.CLOSE]]))
            .then(function (result){
                let totalCount = result.data.count;
                $scope.pager = pagingService.GetPager(totalCount, page);

                competitionService.getCompetitons(competitionService.buildConditions($scope.searchText, $scope.selectedsportStyle, [$scope.compStatus[constants.compStatusType.CLOSE]], $scope.pager.startIndex + 1, $scope.pager.endIndex + 1))
                    .then(function (result) {
                        $scope.competitions = result.data;
                    }, function (error) {
                        console.log(error)
                    })
            }, function (error) {
                console.log(error)
            });
        window.scroll(0,0);
    }
});
