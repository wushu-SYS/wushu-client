/**
 * this service contains calls for endpoints for the competition entity
 * and common function for the competition module and screen
 */
app.service('competitionService', function ($window, $http, $uibModal, $location, constants) {
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
    this.registerJudgeToCompetition = function (compId, registerJusges, unregisterJudges, master) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/competitionJudge',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                compId: compId,
                insertJudges: registerJusges,
                deleteJudges: unregisterJudges,
                masterJudge: master.id
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
        let condition = '?' + 'competitionId=' + compId;
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/getJudgeRegistrationState' + condition,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };
    this.getRegisteredJudges = function (compId) {
        let data = {
            compId: compId
        };
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/judge/getRegisteredJudgeCompetition',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.checkInCompetitionJudges = function (compId, unselectedJudgeIds) {
        let data = {
            compId: compId,
            judgeIds: unselectedJudgeIds
        };
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/judge/deleteJudgesFromCompetition',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
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
    this.getResultCompetition = function (idComp) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/competitionResults',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                idComp: idComp
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
            backdrop: 'static',
            keyboard: false
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
        }).result.then(function () {
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
    /**
     * move to result page according to the competition sport style
     * @param competition - object of the desired competition
     */
    this.watchResults = function (competition) {
        if(competition.sportStyle == constants.sportStyleEnum[constants.sportStyleType.TAULLO].name)
            $location.path('/competitionResults/taullo/' + competition.idCompetition);
        else if(competition.sportStyle == constants.sportStyleEnum[constants.sportStyleType.SANDA].name)
            $location.path('/competitionResults/sanda/' + competition.idCompetition);
        //else
            //TODO
    };
    /**
     * open modal for checking in judges to competition
     * @param idCompetiton
     * @param onCloseModal - callback function to call when close modal event triggered
     */
    this.openCheckInJudgesModal = function (idCompetition, onCloseModal) {
        $uibModal.open({
            templateUrl: "views/modalView/checkInJudgesModal.html",
            controller: "checkInJudgesModalController as checkInJudgesModalController",
            backdrop: 'static',
            keyboard: false,
            resolve: {
                getId: function () {
                    return idCompetition;
                }
            }
        }).closed.then(function(){
            onCloseModal();
        });
        //     .result.catch(function () {
        // });
    };
    /**
     * move to sportsman competition registration page according to the given competition id
     * @param idCompetiton
     */
    this.regSportsman = function (idCompetiton) {
        $location.path('/sportsmanCompetitionRegistration/' + idCompetiton);
    };
    /**
     * move to registration state page according to the given competition
     * @param competition
     */
    this.registrationState = function (competition) {
        $location.path('/competitions/RegistrationState/' + competition.idCompetition + '/' + competition.date + '/' + competition.status);
    };

    /**
     * move to page where the judges start to judge the competition
     * @param idComp
     * @param isMaster
     * @param status
     */
    this.startJudgingCompetition = function (idComp, isMaster, status) {
        if (isMaster)
            $location.path('/judgingCompetitionMaster/' + idComp);
        else {
            switch (status) {
                case 'start':
                    $location.path('/judgingCompetitionSimple/' + idComp);
                    break
            }
        }
    };
    /**
     * move to loading page, where the judge waits for the next sportsman to start performing
     * @param idComp
     * @param preSportsman - previos sportsman
     */
    this.waitsForNextSportsman = function (idComp, preSportsman) {
        $location.path('/waitingForTheNextSportsman/' + idComp + '/' + preSportsman);

    };

    this.getCompetitionsToJudge = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/getCompetitionToJudge',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
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
        if (startIndex !== null && startIndex !== undefined && endIndex !== null && endIndex !== undefined) {
            conditions.push('startIndex=' + startIndex);
            conditions.push('endIndex=' + endIndex);
        }

        return conditions.length ? '?' + conditions.join('&') : '';
    }

    /**
     * calculate the final grade for the sportsman by average
     * @param judgeGrades - list of grades that were given by simple judges
     * @param masterGrade - the grade that was given by the master judge
     * @return the average grade
     */
    this.calcAverageGrade = function (judgeGrades, masterGrade) {
        let sum = 0, count = 0;
        for (var key in judgeGrades) {
            sum += parseFloat(judgeGrades[key]);
            count++;
        }
        if (masterGrade)
            return (sum + parseFloat(masterGrade)) / (count + 1);
        return 0;
    }

    this.saveSportsmanGrade = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/judge/updateSportsmanCompetitionGrade',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
    this.manualCloseCompetition =function (compId) {
        let data = {
            idComp:compId
        }
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/judge/manualCloseCompetition',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);

    }

    this.uploadGradeCompetition = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/judge/excelUpdateTaulloCompetitionGrade',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
    this.updateCompetitionResults = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/updateCompetitionGrades',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
});
