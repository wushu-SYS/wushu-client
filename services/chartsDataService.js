/**
 * This service contains calls for endpoints that gets data for the graphs
 */
app.service('chartsDataService', function ($window, $http, constants) {
    this.participateSportsmanCompetitions = function (sportsmanId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/participateSportsmanCompetitions',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                sportsmanId: sportsmanId
            }
        };
        return $http(req);
    };

    this.sportsmanCompetitionsGrades =function (sportsmanId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/sportsmanRecords',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                sportsmanId: sportsmanId
            }
        };
        return $http(req);
    };
    this.clubTreeData =function (clubId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/clubTree',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                clubId:clubId
            }
        };
        return $http(req);
    };

    this.wushuTreeData = function () {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/wushuTree',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    }

    this.clubsParticipateSportsmanCompetitions = function (clubId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/clubsParticipateSportsmanCompetitions',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                clubId:clubId
            }
        };
        return $http(req);
    };

    this.sportsmanJudgeGrades = function (sportsmanId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/sportsmanJudgeGrades',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                sportsmanId: sportsmanId
            }
        };
        return $http(req);
    }

});
