app.controller("editMessageModalController", function($scope, $window, $uibModalInstance,constants,msgService,toastNotificationService,getId) {

    $scope.regex =constants.regex
    msgService.getMessageDetails(getId)
        .then(function (result) {
            $scope.msgText = result.data[0].msg;
        })
    $scope.closeModal =function () {
        $uibModalInstance.close()
    }



    $scope.submit =function (isValid) {
        if(isValid){
            msgService.editMessage($scope.msgText,getId)
                .then(function (result) {
                    toastNotificationService.successNotification("הודעה נערכה בהצלחה");
                    $uibModalInstance.close()
                },function (error) {console.log(error)})
        }
    }
});
