app.service('commonFunctionsService', function(constants) {
    /**
     * remove the given value from the given array
     * @param arr
     * @param value
     * @returns the new array
     */
    this.arrayRemove = function arrayRemove(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
    }

});
