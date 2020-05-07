app.controller("homeController",function ($scope, $uibModal, $window, constants, msgService, $filter,$rootScope) {
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

    $scope.addNewMessage = msgService.addNewMessageModal

});
