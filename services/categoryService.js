/**
 * this service contains calls for endpoints for the category entity
 * and common function based on category entity
 */
app.service('categoryService', function($window, $http, constants) {
    this.getCategories = function(){
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getCategories',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };

    /**
     * format for printing on the screen
     * @param category
     * @returns {string} in the following format {minAge}-{maxAge}
     */
    this.getAgeRange = function(category){
        if(category.maxAge == null)
            return category.minAge != 0 ? category.minAge + "+" : "";
        else
            return category.minAge + "-" + category.maxAge;
    };
});
