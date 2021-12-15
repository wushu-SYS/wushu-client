app.controller("sportsmenController", function ($scope, $http, $window, $location, $cacheFactory, constants, clubService, pagingService, sportsmanService, commonFunctionsService, cacheService) {
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyles = constants.sportStyleEnum;
    var allUsers;
    $scope.pager = {};
    $scope.isToDesc = true;
    $scope.isNumberToDesc = null;
    $scope.headerTable = "ספורטאיים";
    $scope.isSportsmanList = true;
    let exportList = document.getElementById("export");

    setPage(1);
    getDataForDisplay();
    setUserFiltersByCache();

    function getDataForDisplay() {
        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
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
    }
    function setUserFiltersByCache(){
        $scope.searchText = cacheService.get('searchText');
        $scope.selectedSportStyle = cacheService.get('sportStyle');
        $scope.selectedClub = cacheService.get('club');
        $scope.selectedAmuta = cacheService.get('amuta');
        $scope.selectedAddress = cacheService.get('address');
        $scope.selectedSex = cacheService.get('sex');
        $scope.isToDesc = cacheService.get('isToDesc');
        $scope.startIndex = cacheService.get('startIndex');
        $scope.endIndex = cacheService.get('endIndex');
        $scope.isNumberToDesc = cacheService.get('isNumberToDesc');
    }

    $scope.setPage = function(page){
        setPage(page);
    };

    function setPage(page) {
        if (page < 1 || (page > $scope.pager.totalPages && $scope.totalPages > 0)) {
            return;
        }

        sportsmanService.getSportsmenCount(sportsmanService.buildConditionds($scope.searchText, $scope.selectedsportStyle, $scope.selectedClub,$scope.selectedAmuta,$scope.selectedAddress, $scope.selectedSex, $scope.isToDesc,null, null, null, null, $scope.isNumberToDesc))
            .then(function (result) {
                let totalCount = result.data.count;
                $scope.pager = pagingService.GetPager(totalCount, page);

                sportsmanService.getSportsmen(sportsmanService.buildConditionds($scope.searchText, $scope.selectedsportStyle, $scope.selectedClub,$scope.selectedAmuta,$scope.selectedAddress, $scope.selectedSex, $scope.isToDesc, null, null, $scope.pager.startIndex + 1, $scope.pager.endIndex + 1, $scope.isNumberToDesc))
                    .then(function (result) {
                        $scope.users = result.data.sportsmen;
                    }, function (error) {
                        console.log(error)
                    });
            }, function (error) {
                console.log(error)
            });
        window.scroll(0,0);
    }

    $scope.sortStyleChanged = function (){
        $scope.isToDesc = !$scope.isToDesc;
        setPage(1);
    }

    $scope.watchProfile = function (selectedId) {
        commonFunctionsService.saveUserFiltersToCache($scope.searchText, $scope.selectedsportStyle, $scope.selectedClub, $scope.selectedSex, $scope.isToDesc,$scope.pager.startIndex + 1, $scope.pager.endIndex + 1, $scope.isNumberToDesc);
        sportsmanService.watchProfile(selectedId);
    }

    $scope.export = function () {
        let token =$window.sessionStorage.getItem('token')
        let conditions = sportsmanService.buildConditionds($scope.searchText, $scope.selectedsportStyle, $scope.selectedClub, $scope.selectedSex, $scope.isToDesc, null, null, null, null, $scope.isNumberToDesc);
        let url = constants.serverUrl + '/downloadSportsmanList/'+token + conditions;
        exportList.setAttribute('href', url);
        exportList.click();
    }

    $scope.moveEditUsers = function (){
        $location.path("/editUsersByExcel/sportsman");

    }
 
});
