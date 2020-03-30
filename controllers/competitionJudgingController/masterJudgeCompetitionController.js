app.controller("judgingCompetitionMaster", function ($scope, $http,$routeParams, $window, $location, constants, SocketService) {

    SocketService.emit('judgeMasterEnterToCompetition',{idComp : $routeParams.idComp})

});
