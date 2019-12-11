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
        if(isValid) {
            let data = {
                clubName: $scope.clubName,
                address: $scope.address,
                phone: $scope.phone,
                contactname: $scope.contact,
                ergonId: $scope.ergon.id,
                agudaId: $scope.aguda.id,
                amutaId: $scope.amuta.id
            };
            clubService.addClub(data)
                .then(function (result) {
                    toastNotificationService.successNotification("המועדון נוצר בהצלחה");
                    $scope.isSaved = true;
                    if ($rootScope.isChangingLocationFirstTime) $location.path('/home');
                }, function (error) {
                    console.log(error);
                    toastNotificationService.errorNotification("ארעה שגיאה בעת יצירת המועדון");
                })
        }
    };
    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        if($scope.addClubForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.addClubForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.addClubForm.$valid);
        }
    });
});
