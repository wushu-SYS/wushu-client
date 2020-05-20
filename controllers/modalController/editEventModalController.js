app.controller("editEventModalController", function($scope, $rootScope, $location, $uibModalInstance, $window, $http,$filter,getId,eventService, constants, confirmDialogService, toastNotificationService) {
    $scope.sportStyleEnum = constants.sportStyleEnum;
    $scope.regex = constants.regex;

    $rootScope.isChangingLocationFirstTime = true;
    $scope.closeModal= function () {
        if($scope.editCompetitionForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.editCompetitionForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(undefined, $location.path(), $scope.submit, $scope.editCompetitionForm.$valid, $uibModalInstance);
        }
        else
            $uibModalInstance.close()
    };
    eventService.getEventDetails(getId)
        .then(function (result) {
            $scope.type = result.data.type;
            $scope.location = result.data.location
            $scope.city = result.data.city;
            $scope.eventDate = new Date(result.data.date);
            $scope.evetTime =new Date(result.data.startHour.substring(0, result.data.startHour.length-1))
        }).catch(function (error) {console.log(error)})

    $scope.submit=function (isValid) {
        if (isValid) {
            let data = {
                location: $scope.location,
                city: $scope.city,
                type: $scope.type,
                date: $filter('date')($scope.eventDate, "MM/dd/yyyy"),
                startHour: $filter('date')($scope.evetTime,"HH:mm")
            }
            eventService.editEvent(data, getId)
                .then(function (result) {
                    $scope.isSaved = true;
                    $uibModalInstance.close();
                    parent.location.reload();
                    toastNotificationService.successNotification("פרטי האירוע עודכנו בהצלחה");

                },function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה בעת עדכון פרטי האירוע");
                    console.log(error)
                })
        }
    }
})
