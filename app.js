let app = angular.module('myApp', ["ngRoute", 'ui.bootstrap', 'ngPatternRestrict', 'cp.ngConfirm', 'angularjsToast', 'angular-loading-bar', 'ngAnimate','btford.socket-io'])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
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
        ioSocket: io.connect('http://localhost:3000')
    });
}]);

app.controller("mainController", function ($scope, $location, $window, $rootScope) {
    if($window.sessionStorage.getItem('name') != null && $window.sessionStorage.getItem('name')!=='')
        $rootScope.name = $window.sessionStorage.getItem('name');
    if($window.sessionStorage.getItem('access') != null && $window.sessionStorage.getItem('access') != '')
        $rootScope.access = $window.sessionStorage.getItem('access');

    $scope.getClass = function (path) {
        return ("/" + $location.path().split("/")[1] === path) ? 'active' : '';
    };
    $scope.isShowMenu = function(){
        return $location.path() !== '/login';
    };

    $rootScope.userTypes = {
        MANAGER: 1,
        COACH: 2,
        SPORTSMAN: 3,
        Judge :4
    };

    $scope.logout = function () {
        //need to delete $rootScope
        $window.sessionStorage.removeItem('name');
        $window.sessionStorage.removeItem('token');
        $rootScope.name = '';
        $rootScope.access = '';
        $location.path('/login');
    }
});

// config routes
app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController as loginCtrl'
        })
        .when('/users/register',{
            templateUrl :'views/addFormsView/registerUser.html',
            controller: 'registerController as chRegCtrl'
        })
        .when('/calendar', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/profile', {
            resolve: {
                "check": function ($rootScope, $location, $window) {
                    let id = $window.sessionStorage.getItem("id");
                    if($rootScope.access == $rootScope.userTypes.COACH){
                        $location.path("/coachProfile/" + id);
                    }
                    else if($rootScope.access == $rootScope.userTypes.SPORTSMAN){
                        $location.path("/sportsmanProfile/" + id);
                    }
                    else if($rootScope.access == $rootScope.userTypes.Judge){
                        $location.path("/refereeProfile/" + id)
                    }
                }
            }
        })
        .when('/sportsmanProfile/:id?', {
            templateUrl: 'views/profileView/profilePage.html',
            controller: 'sportsmanProfileController as sportsmanProfileCtrl'
        })
        .when('/coachProfile/:id?', {
            templateUrl: 'views/profileView/profilePage.html',
            controller: 'coachProfileController as coachProfileCtrl'
        })
        .when('/refereeProfile/:id?', {
            templateUrl: 'views/profileView/profilePage.html',
            controller: 'refereeProfileController as refereeProfileCtrl'
        })
        .when('/sportClubs/addSportClub', {
            templateUrl: 'views/addFormsView/addNewClub.html',
            controller: 'addNewClubController as addClubCtrl'
        })
        .when('/sportClubs/sportClubs', {
            templateUrl: 'views/tablesView/clubTable.html',
            controller: 'clubController as clubCtrl'
        })
        .when('/sportClubs/clubProfile/:id?', {
            templateUrl: 'views/profileView/clubProfile.html',
            controller: 'clubProfileController as clubProfileCtrl'
        })
        .when('/users/couches', {
            templateUrl: 'views/tablesView/userTable.html',
            controller: 'coachController as coachCtrl'
        })
        .when('/users/admins', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/users/sportsmen', {
            templateUrl: 'views/tablesView/userTable.html',
            controller: 'sportsmenController as sportsmenCtrl'
        })
        .when('/users/referees', {
            templateUrl: 'views/tablesView/userTable.html',
            controller: 'refereesTableController as hCtrl'
        })
        .when('/competitions/addCompetition', {
            templateUrl: 'views/addFormsView/openCompetition.html',
            controller: 'openCompetitionController as hCtrl'
        })
        .when('/competitions/registerToCompetition', {
            templateUrl: 'views/tablesView/competitionTable.html',
            controller: 'registerToCompetitionController as regCompCtrl'
        })
        .when('/competitions/startCompetition', {
            templateUrl: 'views/tablesView/competitionsToJudgeTable.html',
            controller: 'competitionsToJudgeController as competitionsToJudgeController'
        })
        .when('/competitions/addResults', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/competitions/results', {
            templateUrl: 'views/tablesView/competitionTable.html',
            controller: 'competitionResultsController as compResCtrl'
        })
        .when('/competitions/getCompetitions', {
            templateUrl: 'views/tablesView/competitionTable.html',
            controller: 'competitionTableController as cTCtrl'
        })
        .when('/competitions/RegistrationState/:idCompetition/:date/:status', {
            templateUrl: 'views/competitionRegistrationView/registrationState.html',
            controller: 'registrationStateController as regStateCtrl'
        })
        .when('/events/addEvent', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/events/addMessage', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/events/events', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/events/messages', {
            templateUrl: 'views/home.html',
            controller: 'homeController as hCtrl'
        })
        .when('/sportsmanCompetitionRegistration/:idComp', {
            templateUrl: 'views/competitionRegistrationView/regSportsmanCompetition.html',
            controller: 'regSportsmanCompetitionController as sCompetitionRegCtrl'
        })
        .when('/judgeCompetitionRegistration/:idComp', {
            templateUrl: 'views/competitionRegistrationView/regJudgeCompetition.html',
            controller: 'regJudgeCompetitionController as jCompetitionRegCtrl'
        })
        .when('/judgingCompetitionMaster/:idComp', {
            templateUrl: 'views/competitionJudgingView/judgeCompetition.html',
            controller: 'judgingCompetitionMaster as jCompetitionMaster'
        })
        .when('/judgingCompetitionSimple/:idComp', {
            templateUrl: 'views/competitionJudgingView/judgeCompetition.html',
            controller: 'judgingCompetitionSimple as jCompetitionSimple'
        })
        .when('/waitingForCompetitionHost/:idComp', {
            templateUrl: 'views/loadingView/loading.html',
            controller: 'waitingForCompetitionHost as waitingForCompetitionHost'
        })
        .when('/waitingForTheNextSportsman/:idComp/:preSportsman', {
            templateUrl: 'views/loadingView/loading.html',
            controller: 'waitingForTheNextSportsman as waitingForTheNextSportsman'
        })
        .otherwise({redirectTo: '/login'});
});
