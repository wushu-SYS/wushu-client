app.controller("homeController", function ($scope, $uibModal, $window, constants) {
    $scope.changePassword = function () {
            $uibModal.open({
                templateUrl: "views/modalView/changePasswordModal.html",
                controller: "changePasswordController as changePassCtrl",
                backdrop  : 'static',
                keyboard  : false
            });
    };

    if($window.sessionStorage.getItem('isFirstLogin') == 1)
        $scope.changePassword();

    getDisplayData();
    function getDisplayData(){
        $scope.myTickerItems = [
            {
                text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                creationDate: '02/02/2020'
            },
            {
                text: 'אלינה דרור',
                creationDate: '02/02/2020'
            },
            {
                text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                creationDate: '02/02/2020'
            },
            {
                text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                creationDate: '02/02/2020'
            }
        ]
    }

});
