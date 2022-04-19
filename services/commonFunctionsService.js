app.service('commonFunctionsService', function(constants, cacheService) {
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

    /**
     * @return the year of last september month
     */
    this.getSessionYear = function getSessionYear() {
        let year = new Date().getFullYear();
        if (new Date().getMonth() < constants.monthDateFromZERO.SEPTEMBER)
            year = year - 1;

        return year
    }

    let monthNames =  ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ];
    /**
     * return array of month names in hebrew
     * @return {string[]}
     */
    this.getMonthNames = function () {
        let monthJsons = []
        let i;
        for (i = 0; i < monthNames.length; i++) {
            monthJsons.push({id: i, name: monthNames[i]});
        }
        return monthJsons;
    }

    /**
     * returns the name of the month of the given month number
     * return empty string if the given number is illegal
     * @param monthNum - number of the desired month
     * @return {string}
     */
    this.convertNumToMonth = function (monthNum) {
        if(monthNum < 0 || monthNum > 11 || !Number.isInteger(monthNum)) {
            return ""
        }
        return monthNames[monthNum];
    }

    this.getIdInLengthNine = function (id){
        return ("000000000" + id).slice(-9);
    }

    this.saveUserFiltersToCache = function (searchText, sportStyle, club, sex, isToDesc,startIndex, endIndex, isNumberToDesc){
        cacheService.put('searchText', searchText);
        cacheService.put('sportStyle', sportStyle);
        cacheService.put('club', club);
        cacheService.put('sex', sex);
        cacheService.put('isToDesc', isToDesc);
        cacheService.put('startIndex', startIndex);
        cacheService.put('endIndex', endIndex);
        cacheService.put('isNumberToDesc', isNumberToDesc);
    }
    this.saveClubFiltersToCache = function (status){
        cacheService.put('status', status); 
    }

    this.saveAmutaFiltersToCache = function (status){
        cacheService.put('status', status); 
    }
});
