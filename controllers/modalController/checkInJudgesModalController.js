app.controller("checkInJudgesModalController", function($scope, $uibModalInstance, $window, $http, getId, constants, toastNotificationService, competitionService) {
    getDisplayData();
    function getDisplayData() {
        competitionService.getRegisteredJudges(getId)
            .then(function (result) {
                $scope.registeredJudges = result.data;
                $scope.registeredJudges.forEach(judge => judge.isSelected = true);
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                console.log(error)
            });
    }

    $scope.checkInCompetitionJudges = function () {
        let unselected = $scope.registeredJudges.filter(judge => judge.isSelected === false)
        if(unselected.length > 0){
            competitionService.checkInCompetitionJudges(getId, unselected.map(x => x.idJudge))
                .then(function (result) {
                    $uibModalInstance.close();
                }, function (error) {
                    toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                    console.log(error)
                });
        }
    }
});
