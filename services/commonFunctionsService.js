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
        if(monthNum < 1 || monthNum > 12 || !Number.isInteger(monthNum)) {
            return ""
        }
        return monthNames[monthNum];
    }


});
