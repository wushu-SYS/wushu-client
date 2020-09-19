app.controller("editUsersByExcelController", function ($scope, $rootScope,$routeParams,$filter,$location, competitionService, constants,$window,confirmDialogService, toastNotificationService) {
    $scope.userType = $routeParams.userType
    let downloadExcelLinkEditSportsman = document.getElementById("downExcelEditSportsman");

    $scope.downloadExcelEditSportsMan = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelEditSportsmanDetails/' + token;
        downloadExcelLinkEditSportsman.setAttribute('href', url);
        downloadExcelLinkEditSportsman.click();
    };
});
