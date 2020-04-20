app.controller("addCategoryModalController", function($scope, $window, $uibModalInstance, $http,competitionService, toastNotificationService, constants) {
    $scope.sexEnum = constants.sexEnum;
    $scope.regex = constants.regex;
    $scope.currYear = new Date().getFullYear();

    $scope.onSetAge = function(){
        if($scope.minAge && !$scope.maxAge)
            $scope.maxAge = $scope.minAge
        else if(!$scope.minAge && $scope.maxAge)
            $scope.minAge = $scope.maxAge

        $scope.minYear = $scope.currYear - $scope.maxAge;
        $scope.maxYear = $scope.currYear - $scope.minAge;
    }
    $scope.onSetYear = function(){
        if($scope.minYear && !$scope.maxYear)
            $scope.maxYear = $scope.minYear
        else if(!$scope.minYear && $scope.maxYear)
            $scope.maxYear = $scope.minYear

        $scope.minAge = $scope.currYear - $scope.maxYear;
        $scope.maxAge = $scope.currYear - $scope.minYear;
    }

    $scope.submit =function (isValid) {
        if(isValid){
            let data ={
                categoryName: $scope.categoryName,
                minAge: $scope.minAge,
                maxAge: $scope.maxAge,
                sex: $scope.selectedSex
            }
        competitionService.addCategroyDB(data)
            .then(function (result) {
                toastNotificationService.successNotification("קטגוריה נוספה בהצלחה");
                // parent.location.reload();
                $uibModalInstance.close()
            },function (error) {console.log(error)})
        }
    }

    $scope.closeModal =function () {
        $uibModalInstance.close()
    }
});
