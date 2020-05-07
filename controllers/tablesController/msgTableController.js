app.controller("msgTableController", function ($scope, $http, $filter, $window, $location, constants,msgService ) {
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
        msgService.deleteMessage(msgId);
        getDataForDisplay()

    }

});
