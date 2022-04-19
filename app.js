let app = angular.module('myApp', ["ngRoute", 'ui.bootstrap', 'ngPatternRestrict', 'cp.ngConfirm', 'angularjsToast', 'angular-loading-bar', 'ngAnimate', 'btford.socket-io', 'nvd3', 'vAccordion'])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div>' +
            '<i class="fa fa-spinner fa-pulse"></i>\n' +
            '<span>אנא המתן...</span>' +
            '</div>';

    }]);

app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        //ioSocket: io.connect("https://wushu-server.herokuapp.com")
        ioSocket: io.connect("http://localhost:3000")
    });
}]);

app.controller("mainController", function ($scope, $location, $window, $rootScope, $uibModal, constants) {
    if ($window.sessionStorage.getItem('name') != null && $window.sessionStorage.getItem('name') !== '')
        $rootScope.name = $window.sessionStorage.getItem('name');
    if ($window.sessionStorage.getItem('access') != null && $window.sessionStorage.getItem('access') != '')
        $rootScope.access = $window.sessionStorage.getItem('access');

    $scope.getClass = function (path) {
        // $scope.clickedMyProfile = false
        return ("/" + $location.path().split("/")[1] === path) ? 'active' : '';
    };
    $scope.isShowMenuOrFooter = function () {
        return $location.path() !== '/login';
    };
    $scope.isShowLoadingBar = function () {
        return $location.path() !== '/home';
    };

    $scope.userAccess = constants.userAccess;
    $rootScope.userTypes = {
        MANAGER: 1,
        COACH: 2,
        SPORTSMAN: 3,
        Judge: 4
    };

    $scope.logout = function () {
        //need to delete $rootScope
        $window.sessionStorage.removeItem('name');
        $window.sessionStorage.removeItem('token');
        $rootScope.name = '';
        $rootScope.access = '';
        $location.path('/login');
    }

    $scope.openModalRegisterAdmin = function () {
        $uibModal.open({
            templateUrl: "views/modalView/registerAdminModal.html",
            controller: "registerAdminModalController as rAdminModalCtrl",
            backdrop: 'static',
            keyboard: false
        }).result.catch(function () {
        });
    }

    $scope.$on('$routeChangeStart', function (angularEvent, newUrl) {
        // check if the custom property exist
        if (newUrl.requireAuth && !checkAuth($window)) {
            $location.path("/login");
        }
    });
});

// config routes
app.config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'homeController as hCtrl',
                requireAuth: true
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController as loginCtrl',
                requireAuth:false
            })
            .when('/users/register', {
                templateUrl: 'views/addFormsView/registerUser.html',
                controller: 'registerController as chRegCtrl',
                requireAuth: true

            })
            // .when('/calendar', {
            //     templateUrl: 'views/home.html',
            //     controller: 'homeController as hCtrl'
            // })
            .when('/profile', {
                resolve: {
                    "check": function ($rootScope, $location, $window) {
                        let id = $window.sessionStorage.getItem("id");
                        if ($rootScope.access == $rootScope.userTypes.COACH) {
                            $location.path("/profile/coachProfile/" + id);
                        } else if ($rootScope.access == $rootScope.userTypes.SPORTSMAN) {
                            $location.path("/profile/sportsmanProfile/" + id);
                        } else if ($rootScope.access == $rootScope.userTypes.Judge) {
                            $location.path("/profile/refereeProfile/" + id)
                        }
                    }
                },
                requireAuth: true
            })
            .when('/profile/sportsmanProfile/:id?', {
                templateUrl: 'views/profileView/profilePage.html',
                controller: 'sportsmanProfileController as sportsmanProfileCtrl',
                requireAuth: true
            })
            .when('/editUsersByExcel/:userType?', {
                templateUrl: 'views/addFormsView/editUsersByExcel.html',
                controller: 'editUsersByExcelController as editUsersByExcelCtrl',
                requireAuth: true
            })
            .when('/profile/coachProfile/:id?', {
                templateUrl: 'views/profileView/profilePage.html',
                controller: 'coachProfileController as coachProfileCtrl',
                requireAuth: true
            })
            .when('/profile/refereeProfile/:id?', {
                templateUrl: 'views/profileView/profilePage.html',
                controller: 'refereeProfileController as refereeProfileCtrl',
                requireAuth: true
            })
            .when('/sportClubs/addSportClub', {
                templateUrl: 'views/addFormsView/addNewClub.html',
                controller: 'addNewClubController as addClubCtrl',
                requireAuth: true
            })
            .when('/sportClubs/sportClubs', {
                templateUrl: 'views/tablesView/clubTable.html',
                controller: 'clubController as clubCtrl',
                requireAuth: true
            })
            .when('/sportClubs/clubProfile', {
                resolve: {
                    "check": function ($rootScope, $location, $window) {
                        let sportClub = $window.sessionStorage.getItem("sportclub");
                        $location.path("/sportClubs/clubProfile/" + sportClub);
                    }
                },
                requireAuth: true
            })
            .when('/sportClubs/amutaProfile', {
                resolve: {
                    "check": function ($rootScope, $location, $window) {
                        let sportAmuta = $window.sessionStorage.getItem("sportamuta");
                        $location.path("/sportAmutas/amutaProfile/" + sportAmuta);
                    }
                },
                requireAuth: true
            })
            .when('/sportClubs/addSportAmuta',{
                templateUrl: 'views/addFormsView/addNewAmuta.html',
                controller: 'addNewAmutaController as addAmutaCtrl',
                requireAuth: true
            })
            .when('/sportClubs/sportAmuta',{
                templateUrl: 'views/tablesView/amutaTable.html',
                controller: 'amutaController as amutaCtrl',
                requireAuth: true
            })
            .when('/sportClubs/clubProfile/:id?', {
                templateUrl: 'views/profileView/clubProfile.html',
                controller: 'clubProfileController as clubProfileCtrl',
                requireAuth: true
            })
            .when('/sportClubs/amutaProfile/:id?', {
                templateUrl: 'views/profileView/amutaProfile.html',
                controller: 'amutaProfileController as amutaProfileCtrl',
                requireAuth: true
            })
            .when('/users/couches', {
                templateUrl: 'views/tablesView/coachTable.html',
                controller: 'coachController as coachCtrl',
                requireAuth: true
            })
            .when('/users/admins', {
                templateUrl: 'views/tablesView/adminTable.html',
                controller: 'adminsTableController as adminsCtrl',
                requireAuth: true
            })
            .when('/users/sportsmen', {
                templateUrl: 'views/tablesView/userTable.html',
                controller: 'sportsmenController as sportsmenCtrl',
                requireAuth: true
            })
            .when('/users/referees', {
                templateUrl: 'views/tablesView/refereesTable.html',
                controller: 'refereesTableController as hCtrl',
                requireAuth: true
            })
            .when('/competitions/addCompetition', {
                templateUrl: 'views/addFormsView/openCompetition.html',
                controller: 'openCompetitionController as hCtrl',
                requireAuth: true
            })
            .when('/competitions/registerToCompetition', {
                templateUrl: 'views/tablesView/competitionTable.html',
                controller: 'registerToCompetitionController as regCompCtrl',
                requireAuth: true
            })
            .when('/startJudging', {
                templateUrl: 'views/tablesView/competitionsToJudgeTable.html',
                controller: 'competitionsToJudgeController as competitionsToJudgeController',
                requireAuth: true
            })
            .when('/competitions/results', {
                templateUrl: 'views/tablesView/competitionTable.html',
                controller: 'competitionResultsTableController as compResTableCtrl',
                requireAuth: true
            })
            .when('/competitionResults/taullo/:idComp', {
                templateUrl: 'views/competitionResults/competitionResultsTaullo.html',
                controller: 'competitionResultsTaulloController as compResultsTaulloCtrl',
                requireAuth: true
            })
            .when('/competitionResults/sanda/:idComp', {
                templateUrl: 'views/competitionResults/competitionResultsSanda.html',
                controller: 'competitionResultsSandaController as compResultsSandaCtrl',
                requireAuth: true
            })
            .when('/competitions/getCompetitions', {
                templateUrl: 'views/tablesView/competitionTable.html',
                controller: 'competitionTableController as cTCtrl',
                requireAuth: true
            })
            .when('/competitions/RegistrationState/:idCompetition/:date/:status', {
                templateUrl: 'views/competitionRegistrationView/registrationState.html',
                controller: 'registrationStateController as regStateCtrl',
                requireAuth: true
            })
            .when('/events/addEvent', {
                templateUrl: 'views/addFormsView/openCompetition.html',
                controller: 'addEventController as addECtrl',
                requireAuth: true
            })
            .when('/events/events', {
                templateUrl: 'views/tablesView/eventTable.html',
                controller: 'eventTableController as eventtCtrl',
                requireAuth: true
            })
            .when('/events/messages', {
                templateUrl: 'views/tablesView/msgTable.html',
                controller: 'msgTableController as msgtCtrl',
                requireAuth: true
            })
            .when('/sportsmanCompetitionRegistration/:idComp', {
                templateUrl: 'views/competitionRegistrationView/regSportsmanCompetition.html',
                controller: 'regSportsmanCompetitionController as sCompetitionRegCtrl',
                requireAuth: true
            })
            .when('/judgeCompetitionRegistration/:idComp', {
                templateUrl: 'views/competitionRegistrationView/regJudgeCompetition.html',
                controller: 'regJudgeCompetitionController as jCompetitionRegCtrl',
                requireAuth: true
            })
            .when('/judgingCompetitionMaster/:idComp', {
                templateUrl: 'views/competitionJudgingView/judgeCompetition.html',
                controller: 'judgingCompetitionMaster as jCompetitionMaster',
                requireAuth: true
            })
            .when('/judgingCompetitionSimple/:idComp', {
                templateUrl: 'views/competitionJudgingView/judgeCompetition.html',
                controller: 'judgingCompetitionSimple as jCompetitionSimple',
                requireAuth: true
            })
            .when('/waitingForCompetitionHost/:idComp', {
                templateUrl: 'views/loadingView/loading.html',
                controller: 'waitingForCompetitionHost as waitingForCompetitionHost',
                requireAuth: true
            })
            .when('/waitingForTheNextSportsman/:idComp/:preSportsman', {
                templateUrl: 'views/loadingView/loading.html',
                controller: 'waitingForTheNextSportsman as waitingForTheNextSportsman',
                requireAuth: true
            })
            .when('/wushuTree', {
                templateUrl: 'views/wushuTree.html',
                controller: 'wushuTree as wushuTreeController',
                requireAuth: true
            })
            .otherwise({redirectTo: '/login'});
});


let checkAuth = function ($window) {
    let isAuth = true
    if ($window.sessionStorage.getItem('name') == null || $window.sessionStorage.getItem('name') == '')
        isAuth = false
    if ($window.sessionStorage.getItem('access') == null || $window.sessionStorage.getItem('access') == '')
        isAuth = false
    return isAuth
};
