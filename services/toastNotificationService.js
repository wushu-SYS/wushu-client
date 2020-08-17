/**
 * toastNotificationService - provides the toast notification for succes, errors etc
 * used the documentation from https://sibiraj.dev/angularjs-toast/
 */
app.service('toastNotificationService', function (toast) {
    /* className -> accepted values are alert-(success|danger|primary|info)*/
    this.successNotification = function (message) {
        toast({
            duration  : 3000,
            position  : 'center',
            maxToast  : 2,
            message   : message,
            className : "alert-success"
        });
    };
    this.errorNotification = function (message) {
        toast({
            duration  : 3000,
            position  : 'center',
            maxToast  : 2,
            message   : message,
            className : "alert-danger"
        });
    };
    this.warningNotification = function (message) {
        toast({
            duration  : 3000,
            position  : 'center',
            maxToast  : 2,
            message   : message,
            className : "alert-primary"
        });
    };
});
