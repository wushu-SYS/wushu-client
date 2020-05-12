app.controller("eventTableController", function ($scope, $http, $filter, $window, $location, constants,eventService, confirmDialogService,toastNotificationService) {
    setPage(1);
    $scope.setPage = function (page) {
        setPage(page);
    };
    function setPage(page) {
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
                    setPage(1)
                }, function (error) {
                    console.log(error);
                })
        });
    }

    function editEventToBoard() {
        setPage(1)
    }
    $scope.editEventDetails = function (eventId) {
        eventService.editedGrades(eventId, editEventToBoard)
    }
});
