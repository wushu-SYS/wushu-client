app.service('msgService', function ($window, $http, constants, $uibModal, $location) {

        this.getMessages = function () {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/allUsers/getAllMessages',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
            };
            return $http(req);
        };
        /**
         * open modal for showing full message details
         * @param msgId
         * @param callbackFunc
         */
        this.watchMsgDetails = function (msgId, callbackFunc) {
            $uibModal.open({
                templateUrl: "views/modalView/messageDetails.html",
                controller: "messageDetailsModal as msgDetailsCtrl",
                backdrop: true,
                keyboard: false,
                resolve: {
                    getId: function () {
                        return msgId;
                    }
                }
            }).result.then(function () {
                callbackFunc();
            }).catch(function () {
                callbackFunc();
            });
        };
        this.getMessageDetails = function (msgId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/allUsers/getMessageById',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    msgId: msgId
                }
            };
            return $http(req);
        }
        this.deleteMessage = function (msgId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/deleteMessage',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    msgId: msgId
                }
            };
            return $http(req);
        }

        this.addNewMessage = function (msg) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/addMessage',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    msg: msg
                }
            };
            return $http(req);
        }
        this.editMessage = function (msg, msgId) {
            var req = {
                method: 'POST',
                url: constants.serverUrl + '/private/manager/editMessage',
                headers: {
                    'x-auth-token': $window.sessionStorage.getItem('token')
                },
                data: {
                    msg: msg,
                    msgId: msgId
                }
            };
            return $http(req);
        }

        /**
         * open modal for adding new message
         * @param addNewMessageToBoard
         */
        this.addNewMessageModal = function (addNewMessageToBoard) {
            $uibModal.open({
                templateUrl: "views/modalView/addNewMessage.html",
                controller: "addMessageModalController as addMsgCtrl",
                backdrop: 'static',
                keyboard: false
            }).result.then(function () {
                addNewMessageToBoard();
            }).catch(function () {
            });
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
                backdrop: 'static',
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

