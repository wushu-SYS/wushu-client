app.controller("eventTableController", function ($scope, $http, $filter, $window, $location, constants,eventService, competitionService, confirmDialogService,toastNotificationService) {
    getDisplayData()
    function getDisplayData() {
        eventService.getEvents()
            .then(function (result) {
                $scope.events = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.watchEventDetails = eventService.watchEventDetails;
    $scope.deleteEvent = function (eventId) {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך למחוק את האירוע?", function () {
            eventService.deleteEvent(eventId)
                .then(function (result) {
                    toastNotificationService.successNotification("האירוע נמחקה בהצלחה");
                    getDisplayData();
                }, function (error) {
                    console.log(error);
                })
        });
    }

    $scope.editEventDetails = function (event) {
        if(event.idCompetition)
            competitionService.editCompetitionDetails(event.idCompetition)
        else
            eventService.editEventModal(event.idEvent, getDisplayData)
    }
});
