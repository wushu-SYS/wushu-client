app.controller("amutaController", function ($scope, $http, $filter, $window, $location, constants, amutaService, coachService, commonFunctionsService,cacheService) {
    
    setUserFiltersByCache();

    function setUserFiltersByCache(){
        $scope.selectedStatus = cacheService.get('status');;
    }
    getDataForDisplay();
    function getDataForDisplay() {
        
        amutaService.getAmutas()
            .then(function (result) {
                $scope.amutas = result.data;
            }, function (error) {
                console.log(error)
            })
    }

    $scope.watchProfile = function (selectedId) {
        commonFunctionsService.saveAmutaFiltersToCache($scope.status);
        //sportsmanService.watchProfile(selectedId);
        $location.path("/sportClubs/amutaProfile/" + selectedId);
    }
    /*$scope.getAmutasName = function(amutaId){
        var elem = $scope.amutas.find( ({ id }) => id === amutaId );
        return elem.name;
    }*/
});
