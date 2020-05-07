app.service('msgService', function($window, $http, constants,$uibModal, $location) {

    this.getMessages = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/getAllMessages',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };
    this.watchMsgDetails = function (msgId) {
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
        }).result.catch(function () {
        });
    };
    this.getMessageDetails = function (msgId) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/getMessageById',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data :{
                msgId :msgId
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
            data :{
                msgId :msgId
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
            data : {
                msg :msg
            }
        };
        return $http(req);
    }

    this.addNewMessageModal = function () {
        $uibModal.open({
            templateUrl: "views/modalView/addNewMessage.html",
            controller: "addMessageModalController as addMsgCtrl",
            backdrop: true,
            keyboard: false,
        }).result.catch(function () {
        });
    }
});

