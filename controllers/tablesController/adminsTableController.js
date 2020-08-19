app.controller("adminsTableController", function($scope, $route, $window,adminService, toastNotificationService, confirmDialogService, commonFunctionsService) {
    $scope.currentAdminId = $window.sessionStorage.getItem("id")
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine

    adminService.getAdmins()
        .then(function (result) {
            $scope.admins = result.data;
        }, function (error) {
            console.log(error)
        });

    $scope.deleteAdmin = function (id) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את המנהל?", function () {
            adminService.deleteAdmin(id)
                .then(function (reusult) {
                    toastNotificationService.successNotification("המנהל נמחק בהצלחה");
                    $route.reload();
                }, function (error) {
                    console.log(error)
                })
        });
    }
});
