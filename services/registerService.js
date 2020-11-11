/**
 * this service provides all the functions for the registration process to the system
 * manual + with excel
 */
app.service('registerService', function ($window, $http, constants) {
    this.registerUsersExcel = function (data, userType) {
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

    /**
     * @param userType
     * @return string of the relevant endpoint for manual registration, depend on who we want to register
     */
    function getRegisterUserUrl(userType) {
        switch (userType) {
            case "sportsman":
                return constants.serverUrl + '/private/commonCoachManager/registerSportsmanManual';
            case "coach":
                return constants.serverUrl + '/private/manager/registerCoachManual';
            case "judge":
                return constants.serverUrl + '/private/manager/registerJudgeManual';
        }
    }

    /**
     * @param userType
     * @return string of the relevant endpoint for excel registration, depend on who we want to register
     */
    function getRegisterUserExcelUrl(userType) {
        switch (userType) {
            case "sportsman":
                return constants.serverUrl + '/private/commonCoachManager/registerSportsmenExcel';
            case "coach":
                return constants.serverUrl + '/private/manager/registerCoachExcel';
            case 'judge':
                return constants.serverUrl + '/private/manager/regExcelJudge';
            case 'coachAsJudge':
                return constants.serverUrl + '/private/manager/registerCoachAsJudge';
        }
    }

    this.checkExistUser = function (userId) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + "/private/allUsers/checkExistUser",
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                userId: userId
            }
        };
        return $http(req);
    }
});


