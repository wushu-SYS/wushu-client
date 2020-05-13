app.service('eventService', function ($window, $http, constants, $uibModal, $location) {

        this.getEvents = function () {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/allUsers/getAllEvents',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
            };
            return $http(req);
        };

        /**
         * open modal for showing full event details
         * @param eventId
         */
        this.watchEventDetails = function (eventId) {
            $uibModal.open({
                templateUrl: "views/modalView/competitonDetails.html",
                controller: "eventDetailsModal as cDetailsCtrl",
                backdrop: true,
                keyboard: false,
                resolve: {
                    getId: function () {
                        return eventId;
                    }
                }
            }).result.catch(function () {
            });
        };
        this.getEventDetails = function (eventId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/allUsers/getEventById',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    eventId: eventId
                }
            };
            return $http(req);
        }
        this.deleteEvent = function (eventId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/deleteEvent',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    eventId: eventId
                }
            };
            return $http(req);
        }

        this.addNewEvent = function (event) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/addEvent',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    event: event
                }
            };
            return $http(req);
        }
        this.editEvent = function (event, eventId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/editEvent',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    event: event,
                    eventId: eventId
                }
            };
            return $http(req);
        }

        /**
         * open modal for adding new message
         * @param addNewMessageToBoard
         */
        this.addNewEventModal = function (callbackFunc) {
            // $uibModal.open({
            //     templateUrl: "views/modalView/addNewMessage.html",
            //     controller: "addMessageModalController as addMsgCtrl",
            //     backdrop: true,
            //     keyboard: false,
            // }).result.then(function () {
            //     callbackFunc();
            // }).catch(function () {
            // });
        }

        /**
         * open modal for editing existing message
         * @param msgId
         * @param editMessageBoard
         */
        this.editMessageModal = function (msgId, editMessageBoard) {
            $uibModal.open({
                templateUrl: "views/modalView/editMessage.html",
                controller: "editMessageModalController as editMsgCtrl",
                backdrop: true,
                keyboard: false,
                resolve: {
                    getId: function () {
                        return msgId;
                    }
                }
            }).result.then(function () {
                editMessageBoard();
            }).catch(function () {
            });
        }
    }
);

