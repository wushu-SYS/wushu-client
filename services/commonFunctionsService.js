app.service('commonFunctionsService', function(constants) {
    this.arrayRemove = function arrayRemove(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
    }

    this.getImageUrl = function (src) {
        return src ? constants.serverUrl + '/static' + src : '';
    }
});
