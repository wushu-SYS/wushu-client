app.controller("refereesTableController", function ($scope, $http, $filter, $window, $location, constants, clubService, refereesService, commonFunctionsService) {
    $scope.headerTable = "שופטים";
    $scope.isToDesc = true;
    let exportList = document.getElementById("export");
    getDataForDisplay();


    function getDataForDisplay() {
        refereesService.getReferees()
            .then(function (result) {
                $scope.referee = result.data;
                $scope.setPage();
            }, function (error) {
                console.log(error)
            });
    }

    $scope.setPage = function () {
        let filtered = $scope.referee;
        if ($scope.searchText)
            filtered = $filter('filter')(filtered, function (obj) {
                return obj.firstname.includes($scope.searchText) || obj.lastname.includes($scope.searchText);
            });
        if ($scope.isToDesc)
            filtered = $filter('orderBy')(filtered, 'firstname');
        else
            filtered = $filter('orderBy')(filtered, '-firstname');
        $scope.users = filtered;
    };

    $scope.watchProfile = function (selectedId) {
        refereesService.watchProfile(selectedId);
    }

    $scope.export = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadJudgeList/' + token;
        exportList.setAttribute('href', url);
        exportList.click();
    }
});
