/**
 * this service contains calls for endpoints for the sportaman entity
 * and common function based on sportsman entity
 */
app.service('sportsmanService', function($window, $http, constants, $location) {

    this.getSportsmanRank =function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/sportsmanRank',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    this.getSportsmanProfile = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/sportsmanProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    this.updateProfile =function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUsers/updateSportsmanProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data : data
        };
        return $http(req);
    }

    this.getSportsmen = function(conditions){
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getSportsmen' + conditions,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };
    this.getSportsmenCount = function(conditions){
        var req = {
            method: 'GET',
            url: constants.serverUrl + '/private/commonCoachManager/getSportsmen/count' + conditions,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        return $http(req);
    };

    /**
     * build query params for the sportsman route
     * @param searchText - can filter by string of first name or last name to search
     * @param sportStyle - can filter by sport style
     * @param club - can filter by club id
     * @param sex - can filter by sex
     * @param isToDesc - can define the sorting order, desc or asc
     * @param compId - can filter by comp id
     * @param compOperator - set is the comp must be equal or comp must be different
     *  == -> %3D%3D
     *  != -> !%3D
     * @param startIndex - for setting the start of the paging
     * @param endIndex - for setting the end of the paging
     * @return part of string url that starts with ?, if no filter centurions exists return empty string
     */
    this.buildConditionds = function buildConditions(searchText, sportStyle, club, sex, isToDesc, compId, compOperator, startIndex, endIndex, isNumCompToDesc){
        var conditions = [];

        if(searchText !== null && searchText !== undefined && searchText !== '') {
            conditions.push('value=' + searchText);
        }
        if(sportStyle !== null && sportStyle !== undefined){
            conditions.push('sportStyle=' + sportStyle.name);
        }
        if(club != null && club !== undefined){
            conditions.push('club=' + club.id);
        }
        if(sex !== null && sex !== undefined){
            conditions.push('sex=' + sex.name);
        }
        if(isToDesc === false){
            conditions.push('sort=desc')
        }
        if(compId !== null && compId !== undefined){
            conditions.push('competition=' + compId);
        }
        if(compOperator !== null && compOperator !== undefined){
            conditions.push('competitionOperator=' + compOperator);
        }
        if(startIndex !== null && startIndex !== undefined && endIndex !== null && endIndex !== undefined){
            conditions.push('startIndex=' + startIndex);
            conditions.push('endIndex=' + endIndex);
        }
        if(isNumCompToDesc !==null && isNumCompToDesc !== undefined){
            if(isNumCompToDesc === false)
                conditions.push('numCompSort=desc');
            else
                conditions.push('numCompSort=asc');
        }

        return conditions.length ? '?' + conditions.join('&') : '';
    }

    /**
     * making "join" between the two given lists by sportsman
     * @param sportsmanList
     * @param categoriesList
     * @return return json of sportsmen, each sportsman contains a json of categories
     */
    this.formatSportsmanCategoriesList = function (sportsmanList, categoriesList) {
        let sportsmanCategoriesList = [];
        if(sportsmanList !== undefined && categoriesList !== undefined && sportsmanList.length > 0) {
            let i = 0, currId = sportsmanList[0].id;
            while(i < sportsmanList.length) {
                let user = {
                    id: sportsmanList[i].id,
                    firstname: sportsmanList[i].firstname,
                    lastname: sportsmanList[i].lastname,
                    sex: sportsmanList[i].sex,
                    age: sportsmanList[i].age,
                    originalCategories: [],
                    selectedCategories: []
                };
                while (i < sportsmanList.length && sportsmanList[i].id === currId){
                    let category = categoriesList.find(c => c.id === sportsmanList[i].category);
                    if(category)
                        category.originalId = category.id;
                    user.selectedCategories.push(category);
                    user.originalCategories.push(category);
                    i++;
                }
                sportsmanCategoriesList.push(user);
                if(i < sportsmanList.length)
                    currId = sportsmanList[i].id;
            }
        }
        return sportsmanCategoriesList;
    }

    /**
     * go to sportsman profile page, by the given sportsman id
     * @param selectedId - the sportsman id
     */
    this.watchProfile = function (selectedId) {
        $location.path("/sportsmanProfile/" + selectedId);
    }

});
