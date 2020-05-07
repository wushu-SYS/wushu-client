app.controller("homeController", function ($scope, $uibModal, $window, constants, $interval, $timeout, $filter, msgService) {
    $scope.changePassword = function () {
        $uibModal.open({
            templateUrl: "views/modalView/changePasswordModal.html",
            controller: "changePasswordController as changePassCtrl",
            backdrop: 'static',
            keyboard: false
        });
    };

    if ($window.sessionStorage.getItem('isFirstLogin') == 1)
        $scope.changePassword();

    getDisplayData();
    function getDisplayData(){
        msgService.getMessages()
            .then(function (result) {
                $scope.myTickerItems = [];
                result.data.forEach(msg  => {
                    $scope.myTickerItems.push({
                        text: msg.msg,
                        creationDate: $filter('date')(new Date(msg.createDate), "dd/MM/yyyy")
                    })
                })
            });
    }


    $scope.moving = false;
    $scope.moveLeft = function() {
        $scope.moving = true;
        $timeout($scope.switchFirst, 1000);
    };
    $scope.switchFirst = function() {
        if($scope.myTickerItems && $scope.myTickerItems.length > 0)
            $scope.myTickerItems.push($scope.myTickerItems.shift());
        $scope.moving = false;
        $scope.$apply();
    };
    $interval($scope.moveLeft, 2000);

    $scope.addNewMessage = msgService.addNewMessageModal

});
