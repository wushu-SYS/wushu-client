app.controller("msgTableController", function ($scope, $http, $filter, $window, $location, constants,msgService, confirmDialogService,toastNotificationService) {
    getDataForDisplay();
    function getDataForDisplay() {
        msgService.getMessages()
            .then(function (result) {
                $scope.msgs = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.watchMsgDetails = msgService.watchMsgDetails;

    $scope.deleteMessage = function (msgId) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את ההודעה?", function () {
            msgService.deleteMessage(msgId)
                .then(function (result) {
                    toastNotificationService.successNotification("ההודעה נמחקה בהצלחה");
                    getDataForDisplay()
                }, function (error) {
                    console.log(error);
                })
        });
    }

});
