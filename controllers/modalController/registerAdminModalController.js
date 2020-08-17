app.controller("registerAdminModalController", function($scope, $window, $uibModalInstance, $http,adminService, toastNotificationService, constants) {
    $scope.regex = constants.regex;

    $scope.submit =function (isValid) {
        if(isValid){
            let data ={
                id: $scope.id,
                firstName: $scope.firstname,
                lastName: $scope.lastname,
                email: $scope.email
            }
            adminService.insertAdmin(data)
                .then(function (result) {
                    toastNotificationService.successNotification("המנהל נוסף בהצלחה");
                    $uibModalInstance.close()
                },function (error) {console.log(error)})
        }
    }

    $scope.closeModal =function () {
        $uibModalInstance.close()
    }
});
