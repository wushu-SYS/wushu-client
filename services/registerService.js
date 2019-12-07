app.service('registerService', function ($window, $http, constants) {
    this.registerUsersExcel = function (data,userType, coachAsJudge) {
        let url = getRegisterUserExcelUrl(userType, coachAsJudge);
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
        else if(userType=='coach')
            return constants.serverUrl + '/private/manager/registerCoach';
        else if (registerUser =='judge'&& coachAsJudge == false)
            return constants.serverUrl + '/private/manager/registerNewJudge';
        else if(userType=='judge' && coachAsJudge == true)
            return constants.serverUrl + '/private/manager/registerCoachAsJudge';
    }

    function getRegisterUserExcelUrl(userType) {
        if (userType ==="sportsman")
            return constants.serverUrl + '/private/registerSportsmenExcel';
    }
});


