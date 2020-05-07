app.controller("messageDetailsModal", function($scope, $uibModalInstance, $window, $http,getId,msgService) {
    $scope.close=function () {
        $uibModalInstance.close()
    }

    msgService.getMessageDetails(getId)
        .then(function (result) {
            console.log(result)
            $scope.msgId = result.data[0].id;
            $scope.msgText = result.data[0].msg;
            $scope.msgDate =$filter('date')(new Date( result.data[0].createDate),"dd/MM/yyyy");

        })


});
