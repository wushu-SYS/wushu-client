/**
 * this service contains calls for endpoints for the club entity
 */
app.service('clubService', function($window, $http, constants) {

    this.getClubs = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getClubs',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getErgons = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getErgons',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getAmutas = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getAmutas',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getAddresses = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getAddresses',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.getAgudas = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getAgudas',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    this.addClub = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/addClub',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    this.getClubProfile = function (clubId) {
        var req = {
            method: 'GET',
            url: constants.serverUrl + '/private/commonCoachManager/getClubs/' + clubId,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    }

    this.updateClub = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/updateClubDetails',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }

    this.getCoaches = function (clubId) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getClubCoaches',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                clubId :clubId
            }
        };
        return $http(req);
    }

    this.deleteClub = function(id) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/deleteSportClubProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                id: id
            }
        };
        return $http(req);
    }
});
