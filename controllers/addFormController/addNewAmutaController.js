app.controller("addNewAmutaController", function ($scope, $rootScope,$filter,$location, amutaService, constants, confirmDialogService, toastNotificationService) {
    $scope.regex = constants.regex;
    getDisplayData();
    /**
     * the function bring from the server all the needed data to this screen
     */
    function getDisplayData(){
        amutaService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.submit =async function (isValid) {
        if ($scope.Id != undefined) {
            let data = {
                amutaName: $scope.amutaName,
                Id: $scope.Id,
            };
            await amutaService.checkExistAmuta(data)
                .then((results) => {
                    isValid = false;
                })
                .catch((err) => {
                    isValid = isValid && true;
                })
        }
        if(isValid) {
            let data = {
                amutaName: $scope.amutaName,
                Id: $scope.Id,
            };
            amutaService.addAmuta(data)
                .then(function () {
                    toastNotificationService.successNotification("העמותה נוצרה בהצלחה");
                    $scope.emptyFields()
                    $scope.isSaved = true;
                    $location.path('/home');
                }, function (error) {
                    console.log(error);
                    toastNotificationService.errorNotification("ארעה שגיאה בעת יצירת העמותה");
                })
        }else{
            toastNotificationService.errorNotification("מספר עמותה כבר קיים במערכת!");
        }
    };

    $scope.emptyFields = function () {
        $scope.Id = '';
        $scope.amutaName = '';
    }
    //function fillDataUser(data) {
    //    console.log(data)
    //    $scope.Id = data.Id
    //    $scope.amutaName = data.amutaName
    //}
    //$rootScope.isChangingLocationFirstTime = true;
    //$scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
    //    if($scope.addAmutaForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
    //        if (!$scope.addAmutaForm.$valid) $scope.isClicked = true;
    //        confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.addAmutaForm.$valid);
    //    }
    //});
});
