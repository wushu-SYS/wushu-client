/**
 * this service contains calls for endpoints for the competition entity
 * and common function for the competition module and screen
 */
app.service('competitionService', function ($window, $http, $uibModal, $location, constants) {
    this.checkExcel = function (data) {
        if (isNaN(parseInt(data)) || data.toString().length != 9)
            return false;
        return true;
    }
    this.regSportsmanCompetition = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/competitionSportsmen',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.regExcelSportsmanCompetition = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/regExcelCompetitionSportsmen',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.addCategroyDB = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/addNewCategory',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    this.insertCompetition = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/addCompetition',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.getCompetitons = function (conditions) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getCompetitions' + conditions,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };
    this.getCompetitonsCount = function (conditions) {
        var req = {
            method: 'GET',
            url: constants.serverUrl + '/getCompetitions/count' + conditions
        };
        return $http(req);
    };

    this.getCompetitionDetails = function (id) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/getCompetitionDetail',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                id: id
            }
        };
        return $http(req);
    };
    this.updateCompetitionDetails = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/updateCompetitionDetails',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
    this.registerSportsmenToCompetition = function (compId, insertSportsmenIds, deleteSportsmenIds, updateSportsmanIds) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/competitionSportsmen',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                compId: compId,
                insertSportsman: insertSportsmenIds,
                deleteSportsman: deleteSportsmenIds,
                updateSportsman: updateSportsmanIds
            }
        };
        return $http(req);
    };
    this.registerJudgeToCompetition = function (compId, registerJusges, unregisterJudges) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/competitionJudge',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                compId: compId,
                insertJudges: registerJusges,
                deleteJudges: unregisterJudges
            }
        };
        return $http(req);
    };
    this.getRegistrationState = function (compId) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getRegistrationState',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                compId: compId
            }
        };
        return $http(req);
    };
    this.getJudgeRegistrationState = function (compId) {
        let condition = '?' + 'competitionId='+ compId;
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/getJudgeRegistrationState' + condition,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };
    this.setCategoryRegistration = function (compId, categoryForSportsman) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/setCategoryRegistration',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                compId: compId,
                categoryForSportsman: categoryForSportsman
            }
        };
        return $http(req);
    };
    this.closeRegistration = function (idComp) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/closeRegistration',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                idCompetition: idComp
            }
        };
        return $http(req);
    };

    /**
     * open modal for adding new category
     * @param finishAddingNewCategory - callback function to call when closing the category modal
     */
    this.addNewCategory = function (finishAddingNewCategory) {
        $uibModal.open({
            templateUrl: "views/modalView/addNewCategoryModal.html",
            controller: "addCategoryModalController as aCMCCtrl",
            backdrop: true,
            keyboard: false,
        }).result.then(function () {
            finishAddingNewCategory();
        }).catch(function () {
        });
    }
    /**
     * open modal for editing competition
     * @param id - competition id to edit
     */
    this.editCompetitionDetails = function (id) {
        $uibModal.open({
            templateUrl: "views/modalView/editCompetitionDetails.html",
            controller: "editCompetitionDetailsModal as cEditDetailsCtrl",
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                getId: function () {
                    return id;
                }
            }
        }).result.then(function(){
            // parent.location.reload();
        }).catch(function () {
        });
    }
    /**
     * open modal with details about the competition
     * @param idCompetiton
     */
    this.watchCompDetails = function (idCompetiton) {
        $uibModal.open({
            templateUrl: "views/modalView/competitonDetails.html",
            controller: "competitionDetailsModal as cDetailsCtrl",
            backdrop: true,
            keyboard: false,
            resolve: {
                getId: function () {
                    return idCompetiton;
                }
            }
        }).result.catch(function () {
        });
    };
    this.regSportsman = function (idCompetiton) {
        $location.path('/sportsmanCompetitionRegistration/' + idCompetiton);
    };
    this.registrationState = function (competition) {
        $location.path('/competitions/RegistrationState/' + competition.idCompetition + '/' + competition.date);
    };

    /**
     * build query params for the competition route
     * @param location - can filter by location string
     * @param sportStyle - can filter by sport style
     * @param statusArr - can filter by at least one status
     * @param startIndex - for setting the start of the paging
     * @param endIndex - for setting the end of the paging
     * @return part of string url that starts with ?, if no filter centurions exists return empty string
     */
    this.buildConditions = function buildConditions(location, sportStyle, statusArr, startIndex, endIndex) {
        var conditions = [];

        if (location !== null && location !== undefined && location !== "") {
            conditions.push('location=' + location);
        }
        if (sportStyle !== null && sportStyle !== undefined) {
            conditions.push('sportStyle=' + sportStyle.name);
        }
        if (statusArr !== null && statusArr !== undefined) {
            let statusCond = [];
            statusArr.forEach(status => {
                statusCond.push(status.name);
            });
            conditions.push('status=' + statusCond.join(','));
        }
        if(startIndex !== null && startIndex !== undefined && endIndex !== null && endIndex !== undefined){
            conditions.push('startIndex=' + startIndex);
            conditions.push('endIndex=' + endIndex);
        }

        return conditions.length ? '?' + conditions.join('&') : '';
    }


});
