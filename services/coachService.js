/**
 * this service contains calls for endpoints for the coach entity
 */
app.service('coachService', function ($window, $http, constants, $location) {

    this.getCoaches = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getCoaches',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getCoachesNotRegisterAsJudges = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getCoachesNotRegisterAsJudges',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getCoachProfile = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getCoachProfile',
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
            url: constants.serverUrl + '/private/allUser/updateProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data

        };
        return $http(req);

    };

    this.deleteCoach = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/deleteCoachProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {id:data}
        };
        return $http(req);

    }

    /**
     * go to coach profile page, by the given coach id
     * @param selectedId - coach id
     */
    this.watchProfile = function (selectedId) {
        $location.path("/profile/coachProfile/" + selectedId);
    }

});
