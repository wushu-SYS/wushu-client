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


});
