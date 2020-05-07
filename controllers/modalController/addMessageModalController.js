app.controller("addMessageModalController", function($scope, $window, $uibModalInstance,constants,msgService,toastNotificationService) {

    $scope.regex =constants.regex

    $scope.closeModal =function () {
        $uibModalInstance.close()
    }

    $scope.submit =function (isValid) {
        if(isValid){
            msgService.addNewMessage($scope.msgText)
                .then(function (result) {
                    toastNotificationService.successNotification("הודעה נוספה בהצלחה");
                    $uibModalInstance.close()
                },function (error) {console.log(error)})
        }
    }
});
