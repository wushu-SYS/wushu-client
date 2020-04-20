app.service('adminService', function($window, $http, constants) {
    this.insertAdmin =function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/registerAdmin',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }

    this.getAdmins = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/getAdmins',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    }

    this.deleteAdmin = function (id) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/deleteAdmin',
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
