app.controller("addNewClubController", function ($scope, $rootScope,$filter,$location, clubService, constants, confirmDialogService, toastNotificationService) {
    $scope.regex = constants.regex;
    getDisplayData()
    function getDisplayData(){
        clubService.getErgons()
            .then(function (result) {
                $scope.ergons = result.data;
            }, function (error) {
                console.log(error)
            });
        clubService.getAgudas()
            .then(function (result) {
                $scope.agudas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.submit = function (isValid) {

    }
    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        if($scope.addClubForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.addClubForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.addClubForm.$valid);
        }
    });
});
