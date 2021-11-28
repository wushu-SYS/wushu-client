app.controller("regSportsmanCompetitionController", function ($scope, $rootScope, $window, $http, $routeParams, $filter, $location, sportsmanService, clubService, pagingService, competitionService, excelService, commonFunctionsService, constants, categoryService, confirmDialogService, toastNotificationService) {
    $scope.getIdInLengthNine = commonFunctionsService.getIdInLengthNine;
    $scope.selectedNotRegisteredUsers = [];
    $scope.selectedRegisteredUsers = [];
    $scope.toRegisterUsers = [];
    $scope.toUnRegisterUsers = [];
    $scope.toUpdateRegisterUsers = [];
    $scope.pager = {};
    $scope.getAgeRange = categoryService.getAgeRange;
    let dropZoneRegCompetition = document.getElementById("dropZoneRegCompetition");
    let downExcelRegCompetition = document.getElementById("downExcelRegCompetition");


    setPage(1);
    getDisplayData();

    async function getDisplayData() {
        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });
        //clubService.getAmutas()
        //    .then(function (result) {
        //        $scope.amutas = result.data;
        //    }, function (error) {
        //        console.log(error)
        //    });
        //clubService.getAddresses()
        //    .then(function (result) {
        //        $scope.addresses = result.data;
        //    }, function (error) {
        //        console.log(error)
        //    });
        let result = await categoryService.getCategories();
        $scope.categories = result.data;
        setPage(1);
    }

    /**
     * brings from the server the relevant page of data
     * @param page number
     */
    $scope.setPage = function (page) {
        setPage(page);
    };
    function setPage(page) {
        if (page < 1 || (page > $scope.pager.totalPages && $scope.totalPages > 0)) {
            return;
        }

        sportsmanService.getSportsmenCount(sportsmanService.buildConditionds($scope.searchText, null, $scope.selectedClub, null, null, $routeParams.idComp, null))
            .then(function (result) {
                let totalCount = result.data.count;
                $scope.pager = pagingService.GetPager(totalCount, page);

                sportsmanService.getSportsmen(sportsmanService.buildConditionds($scope.searchText, null, $scope.selectedClub, null, null, $routeParams.idComp, null, $scope.pager.startIndex + 1, $scope.pager.endIndex + 1))
                    .then(function (result) {
                        $scope.users = sportsmanService.formatSportsmanCategoriesList(result.data.sportsmen, $scope.categories);
                    }, function (error) {
                        console.log(error)
                    });
            }, function (error) {
                console.log(error)
            });
        window.scroll(0, 0);
    }

    $scope.downloadExcelRegCompetition = function () {
        let token = $window.sessionStorage.getItem('token')
        let compId = $routeParams.idComp;
        let url = constants.serverUrl + '/downloadExcelFormatRegisterToCompetition/' + token + '/' + compId;
        downExcelRegCompetition.setAttribute('href', url);
        downExcelRegCompetition.click();
    };

    /**
     * searches for the given user in the given list
     * if found than update the category for the user
     * else add the given user to the given list
     */
    function addOrUpdateList(list, user, newCategory, oldCategory) {
        let registration = list.find(item => {
            return item.id === user.id && item.category === oldCategory.id;
        });
        if (registration) {
            registration.category = newCategory.id;
        } else {
            list.push({id: user.id, category: newCategory.id, oldCategory: oldCategory.id});
        }
    }

    /**
     * handle when user added new category for the sportsman
     * notice that this category could be already removed or switched by update
     * need to treat each situation separately
     */
    $scope.addToToRegisterUsers = function (user, newCategory, oldCategory, index) {
        oldCategory = oldCategory ? JSON.parse(oldCategory) : undefined;
        let registration = $scope.toUnRegisterUsers.find(item => item.id === user.id && item.category === newCategory.id);
        if (registration)
            $scope.toUnRegisterUsers = commonFunctionsService.arrayRemove($scope.toUnRegisterUsers, registration);
        if (!oldCategory) {
            $scope.toRegisterUsers.push({id: user.id, category: newCategory.id, oldCategory: undefined});
        } else {
            if (!oldCategory.originalId)
                addOrUpdateList($scope.toRegisterUsers, user, newCategory, oldCategory);
            else {
                if (registration)
                    $scope.toUnRegisterUsers.push({id: user.id, category: oldCategory.id});
                else {
                    addOrUpdateList($scope.toUpdateRegisterUsers, user, newCategory, oldCategory);
                    newCategory.originalId = oldCategory.originalId;
                }
            }
        }

    };

    /**
     * handle when user remove category for the sportsman
     * notice that this category could be just added or switched to by update
     * need to treat each situation separately
     */
    $scope.addToToUnRegisterUsers = function (user, oldCategory, index) {
        if (oldCategory) {
            let registration = $scope.toRegisterUsers.find(item => item.id === user.id && item.category === oldCategory.id);
            if (registration)
                $scope.toRegisterUsers = commonFunctionsService.arrayRemove($scope.toRegisterUsers, registration);
            else {
                let registration = $scope.toUpdateRegisterUsers.find(item => item.id === user.id && item.category === oldCategory.id);
                if(registration) {
                    $scope.toUpdateRegisterUsers = commonFunctionsService.arrayRemove($scope.toUpdateRegisterUsers, registration);
                    $scope.toUnRegisterUsers.push({id: user.id, category: oldCategory.originalId});
                }
                else
                    $scope.toUnRegisterUsers.push({id: user.id, category: oldCategory.id});
            }
            user.selectedCategories = commonFunctionsService.arrayRemove(user.selectedCategories, oldCategory);
            if (user.selectedCategories.length === 0)
                user.selectedCategories.push(undefined);
        } else
            user.selectedCategories.pop();
    };

    /**
     * final save and submit of the changes
     */
    $scope.register = function () {
        competitionService.registerSportsmenToCompetition($routeParams.idComp, $scope.toRegisterUsers, $scope.toUnRegisterUsers, $scope.toUpdateRegisterUsers)
            .then(function (result) {
                toastNotificationService.successNotification("הרישום בוצע בהצלחה");
                $scope.isSaved = true;
                //if ($rootScope.isChangingLocationFirstTime) $location.path("/competitions/registerToCompetition");
            }, function (error) {
                console.log(error)
            });
    };

    function competitionRegisterExcelSportsman(data) {
        competitionService.regExcelSportsmanCompetition(data)
            .then((res) => {
                toastNotificationService.successNotification("הספורטאיים נשמרו בהצלחה");
                setPage(1)
            }).catch((err) => {
            console.log(err)
            $scope.excelErrors = err.data;
        })
    }

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if (($scope.toRegisterUsers.length > 0 || $scope.toUnRegisterUsers.length > 0) && !$scope.isSaved && $rootScope.isChangingLocationFirstTime)
            confirmDialogService.notSavedItems(event, $location.path(), $scope.register);
    });



    /*Drop zone */
    dropZoneRegCompetition.ondrop = function (e) {
        excelService.dropZoneDropFile(e, function (res) {
            changeDropZone(res.fileName)
            let data = {
                compId: $routeParams.idComp,
                sportsman: res.result
            };
            competitionRegisterExcelSportsman(data);
        })
    };
    function changeDropZone(name) {
        let nameArray = name.toString().split("\\");
        $scope.filename = nameArray[nameArray.length - 1];
        $scope.isDropped = true;
        dropZoneRegCompetition.className = "dropzoneExcel"
    }
    dropZoneRegCompetition.ondragover = function () {
        this.className = 'dropzone dragover';
        return false;
    };
    dropZoneRegCompetition.ondragleave = function () {
        this.className = 'dropzone';
        return false;
    };
    $scope.uploadNewFile = function () {
        $scope.excelErrors = [];
        $scope.isDropped = false;
        dropZoneRegCompetition.className = "dropzone"
        document.getElementById("fileSportsman").value = "";
    }
    $scope.ExcelExport = function (event) {
        excelService.uploadExcel(event, function (res) {
            changeDropZone(event.target.value.toString())
            let data = {
                compId: $routeParams.idComp,
                sportsman: res
            };

            competitionRegisterExcelSportsman(data)
        })
    };
});
