app.controller("homeController", function ($scope, $uibModal, $window, constants, $interval, $timeout, clubService) {
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
        clubService.getClubs()
            .then(function (result) {
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
            });
    }


    $scope.moving = false;
    $scope.moveLeft = function() {
        $scope.moving = true;
        $timeout($scope.switchFirst, 1000);
    };
    $scope.switchFirst = function() {
        $scope.myTickerItems.push($scope.myTickerItems.shift());
        $scope.moving = false;
        $scope.$apply();
    };
    $interval($scope.moveLeft, 2000);


});
