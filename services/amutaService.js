/**
 * this service contains calls for endpoints for the club entity
 */
 app.service('amutaService', function($window, $http, constants) {

    this.checkExistAmuta = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + "/private/commonCoachManager/checkExistAmuta",
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                id: data.id,
                name: data.amutaName
            }
        };
        return $http(req);
    }
    /*
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
    */
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
    /*
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
    };*/
    this.addAmuta = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/addAmuta',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    
    this.getAmutaProfile = function (amutaId) {
        var req = {
            method: 'GET',
            url: constants.serverUrl + '/private/commonCoachManager/getAmutas/' + amutaId,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    }
    
    this.updateAmuta = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/updateAmutaDetails',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
    this.deleteProfile =function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/deleteAmutaProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
    /*
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
    }*/
});
