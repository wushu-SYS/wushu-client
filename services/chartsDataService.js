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

});
