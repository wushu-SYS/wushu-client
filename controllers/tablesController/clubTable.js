app.controller("clubController", function ($scope, $http, $filter, $window, $location, constants, clubService, coachService, commonFunctionsService) {
    getDataForDisplay();
    function getDataForDisplay() {
        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getAgudas()
            .then(function (result) {
                $scope.agudas = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            });
        clubService.getAddresses()
            .then(function (result) {
                $scope.addresses = result.data;
            }, function (error) {
                console.log(error)
            });
        clubService.getErgons()
            .then(function (result) {
                $scope.ergons = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.watchProfile = function (selectedId) {
        $location.path("/sportClubs/clubProfile/" + selectedId);
    }
<<<<<<< HEAD
    $scope.getAmutasName = function(amutaId){
        var elem = $scope.amutas.find( ({ id }) => id === amutaId );
=======

    $scope.getAmutasName = function (amutaId) {
        var elem = $scope.amutas.find(({ id }) => id === amutaId);
>>>>>>> 77ce4b3ba04575fa9bb0c08b5dd0aa38937909eb
        return elem.name;
    }
});
