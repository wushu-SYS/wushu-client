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
        switch (userType) {
            case "sportsman":
                return constants.serverUrl + '/private/commonCoachManager/registerSportsmanManual';
            case "coach":
                return constants.serverUrl + '/private/manager/registerCoachManual';
            case "judge":
                return constants.serverUrl + '/private/manager/registerJudgeManual';
        }
    }
    function getRegisterUserExcelUrl(userType) {
        switch (userType) {
            case "sportsman":
                return constants.serverUrl + '/private/commonCoachManager/registerSportsmenExcel';
            case "coach":
                return constants.serverUrl + '/private/manager/registerCoachExcel';
        }
    }
});


