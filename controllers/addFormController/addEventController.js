app.controller("addEventController", function ($scope, $rootScope,$filter,$location, eventService, constants, confirmDialogService, toastNotificationService) {
    $scope.regex = constants.regex;
    $scope.isEvent = true;
    $scope.title = "פתיחת אירוע חדש"

    $scope.submit = function (isValid) {
        if(isValid){
            let data = {
                location : $scope.location,
                type: $scope.type,
                date : $filter('date')($scope.date,"MM/dd/yyyy"),
                startHour : $filter('date')($scope.time,"HH:mm"),
                city: $scope.city
            };

            eventService.addNewEvent(data)
                .then(function (result) {
                    toastNotificationService.successNotification("האירוע נוצר בהצלחה");
                    $scope.isSaved = true;
                    if($rootScope.isChangingLocationFirstTime) $location.path('/home');
                }, function (error) {
                    console.log(error);
                    toastNotificationService.errorNotification("ארעה שגיאה בעת יצירת האירוע");
                })

        }
    };

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        if($scope.openCompetitionForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.openCompetitionForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.openCompetitionForm.$valid);
        }
    });
});
