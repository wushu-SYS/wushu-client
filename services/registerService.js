app.service('registerService', function ($window, $http, constants) {
    this.registerUsersExcel = function (data,userType) {
        let url = getRegisterUserExcelUrl(userType);
        let req = {
            method: 'POST',
            url: url,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }

    this.registerUsers = function (data, userType) {
        let url = getRegisterUserUrl(userType);
        let req = {
            method: 'POST',
            url: url,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    function getRegisterUserUrl  (userType) {
        if (userType=="sportsman")
            return constants.serverUrl + '/private/commonCoachManager/registerSportsman';
        else
            return constants.serverUrl + '/private/manager/registerCoach';
    }

    function getRegisterUserExcelUrl(userType) {
        if (userType ==="sportsman")
            return constants.serverUrl + '/private/registerSportsmenExcel';
    }
});


