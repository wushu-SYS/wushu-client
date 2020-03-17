/**
 * this service contains calls for endpoints for the referee entity
 */
app.service('refereesService', function ($window, $http, constants, $location) {

    this.getReferees = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getReferees',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token') //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiYWNjZXNzIjoxLCJpYXQiOjE1NjUzNjY0MTUsImV4cCI6MTU2NTQ1MjgxNX0.R3hXyBVbiXfgKy9wOi7Y1V0YjZXMQ4jGIxWbHeQkuqI'
            },
        };
        return $http(req);
    };
    this.getRefereeProfile = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getRefereeProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.updateProfile = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/updateRefereeProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }

    /**
     * go to referee profile, by the given referee id
     * @param selectedId - referee id
     */
    this.watchProfile = function (selectedId) {
        $location.path("/refereeProfile/" + selectedId);
    }
});
