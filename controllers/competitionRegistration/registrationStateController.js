app.controller("registrationStateController",function($scope, $rootScope, $window, $http, $location, $filter, commonFunctionsService, sportsmanService, competitionService, $routeParams, categoryService, confirmDialogService, toastNotificationService,constants) {
    $scope.categoryForSportsman = [];
    $scope.toUnRegisterUsers = [];
    $scope.selectedSportsmenToMerge = [];
    $scope.currentCompetition = {
      idCompetition: $routeParams.idCompetition,
      date: $routeParams.date
    };
    $scope.getAgeRange = categoryService.getAgeRange;
    let downloadExcelLink = document.getElementById("downRegistrationCompState")

    getDisplayData();

    async function getDisplayData(){
        await getCategories();

        competitionService.getRegistrationState($scope.currentCompetition.idCompetition)
            .then(function (result) {
                $scope.usersCategories = result.data;
                setSelectedCategories();
            }, function (error) {
                console.log(error)
            });
    }
    function setSelectedCategories(){
        $scope.usersCategories.forEach((usersCategory) =>{
            usersCategory.users.map((user) => {
                user.selectedCategory = $scope.categories.find(function (category) {
                    return category.id == user.category;
                });
                if(user.selectedCategory)
                    $scope.categories.find(function (category) {
                        return category.id == user.category;
                    }).count++;
                return user;
            });
        });
    }
    async function getCategories(){
        let result = await categoryService.getCategories();
        $scope.categories = result.data;
        $scope.categories.map((obj) => {
            obj.count = 0;
            return obj;
        });
    }

    $scope.changeCategory = function (user, oldCategory) {
        if(updateUserCategories(user, oldCategory))
            toastNotificationService.successNotification("הספורטאי הועבר קטגוריה");
        else
            toastNotificationService.warningNotification("הספורטאי רשום כבר בקטגוריה שנבחרה");
    };

    /**
     * handles when the user asks to move a sportsman to another category
     * firstly remove the sportsman from the current (old) category
     * secondly set the new category for the sportsman
     * thirdly add the sportsman to the list of his new category
     * @returns true when the move successfully done and false when the sportsman already registered to the selected category
     */
    function updateUserCategories(user, oldCategory) {
        let newUserCategory = $scope.usersCategories.find(usersCategory => usersCategory.category.id === user.selectedCategory.id);
        if(!newUserCategory || !newUserCategory.users.map(u=>u.id).includes(user.id)){
            removeSportsmanFromoldCategory(oldCategory, user);
            setNewCategoryToUser(user, oldCategory);
            addSportsmanToNewCategory(newUserCategory, user);
            user.selectedCategory.count++;
            return true;
        }
        else{
            let isExisted = user.category === user.selectedCategory.id;
            user.selectedCategory = $scope.categories.find(function (category) {
                return category.id == oldCategory;
            });
            return isExisted;
        }
    }

    /**
     * remove the given sportsman from the given category
     * remove the category if its list become empty
     */
    function removeSportsmanFromoldCategory(oldCategory, user) {
        if (oldCategory != '') {
            $scope.categories.find(category => {
                return category.id == oldCategory
            }).count--;
            let oldUsersCategory = $scope.usersCategories.find(usersCategory => usersCategory.category.id == oldCategory);
            oldUsersCategory.users = commonFunctionsService.arrayRemove(oldUsersCategory.users, user);
            if (oldUsersCategory.users.length === 0)
                $scope.usersCategories = commonFunctionsService.arrayRemove($scope.usersCategories, oldUsersCategory);
        }
    }

    /**
     * add the given sportsman to the given category
     * add list to category if doesn't exist
     */
    function addSportsmanToNewCategory(newUserCategory, user) {
        if (newUserCategory)
            newUserCategory.users.push(user);
        else
            $scope.usersCategories.push(
                {
                    category: user.selectedCategory,
                    users: new Array(user)
                }
            );
    }

    /**
     * set the given category for the given sportsman
     */
    function setNewCategoryToUser(user, oldCategory) {
        let categorySportsman = $scope.categoryForSportsman.find(item => {
            return item.id == user.id && item.oldCategory == oldCategory;
        });
        if (categorySportsman) {
            categorySportsman.category = user.selectedCategory.id;
            categorySportsman.isDeleted = user.isDeleted;
        } else {
            $scope.categoryForSportsman.push(
                {
                    id: user.id,
                    category: user.selectedCategory.id,
                    oldCategory: parseInt(oldCategory),
                    isDeleted: user.isDeleted
                }
            );
        }
    }

    $scope.submit = function () {
        competitionService.registerSportsmenToCompetition($scope.currentCompetition.idCompetition, undefined, $scope.toUnRegisterUsers, $scope.categoryForSportsman)
            .then(function(result){
                $scope.isSaved = true;
                toastNotificationService.successNotification("השינויים נשמרו בהצלחה");
            }, function (error) {
                console.log(error);
            })
    };

    $scope.selectSportsman = function(user, category){
        let selectedUser = $scope.selectedSportsmenToMerge.find(u => u.id == user.id);
        if(selectedUser !== undefined) {
            if(selectedUser.category !== category)
                toastNotificationService.warningNotification("הספורטאי מסומן כבר בקטגוריה אחרת");
            else
                $scope.selectedSportsmenToMerge = commonFunctionsService.arrayRemove($scope.selectedSportsmenToMerge, selectedUser);
            user.isChecked = false;
        }
        else
            $scope.selectedSportsmenToMerge.push(user);
    };
    $scope.mergeSelected = function(){
        let maxCategory = $scope.selectedSportsmenToMerge.map(u => u.selectedCategory).reduce(function(obj1, obj2) {
            if (obj1.maxAge === null && obj2.maxAge === null)
                return (obj1.minAge < obj2.minAge) ? obj2 : obj1;
            if (obj1.maxAge === null)
                return obj1;
            if (obj2.maxAge === null)
                return obj2;
            return (obj1.maxAge < obj2.maxAge) ? obj2 : obj1
        });
        let isDuplicate = false;
        $scope.selectedSportsmenToMerge.forEach(user => {
           user.selectedCategory = maxCategory;
           user.isChecked = false;
           isDuplicate = !updateUserCategories(user, user.category) || isDuplicate;
        });
        $scope.selectedSportsmenToMerge = [];
        if(isDuplicate)
            toastNotificationService.warningNotification("חלק מהספורטאיים שסומנו רשומים כבר לקטגוריה ולכן אלה לא מוזגו.\n שאר הספורטאיים מוזגו בהצלחה לקטגוריה " + maxCategory.name + " " + categoryService.getAgeRange(maxCategory));
        else
            toastNotificationService.successNotification("הספורטאיים מוזגו לקטגוריה " + maxCategory.name + " " + categoryService.getAgeRange(maxCategory));
    };
    $scope.setIsDeletedSportsmanFromCategory = function(fromCategory, user){
        setNewCategoryToUser(user, fromCategory.id);

        // confirmDialogService.askQuestion("האם אתה בטוח שאתה רוצה לבטל את הרישום של הספורטאי לקטגוריה" + fromCategory.name + "?", function () {
        //     removeSportsmanFromoldCategory(fromCategory.id, user);
        //     $scope.toUnRegisterUsers.push({id: user.id, category: fromCategory.id});
        //     $scope.$apply();
        // });
    };

    $scope.closeRegistration = function() {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך לסגור את הרישום לתחרות?", function () {
            competitionService.closeRegistration($scope.currentCompetition.idCompetition)
                .then(function (result) {
                    toastNotificationService.successNotification("הרישום נסגר בהצלחה");
                    $location.path('/competitions/registerToCompetition');
                }, function (error) {
                    console.log(error);
                })
        });
    }

    $scope.addCategoeyModal =function (event) {
        competitionService.addNewCategory(finishAddingCategory);
    };
    async function finishAddingCategory() {
        await getCategories();
        setSelectedCategories();
    }

    $scope.downloadExcelRegistrationState = function () {
        let date =($scope.currentCompetition.date)
        let token =$window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelCompetitionState/'+token+'/'+$scope.currentCompetition.idCompetition+'/'+date;
        downloadExcelLink.setAttribute('href', url);
        downloadExcelLink.click();
    };

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
        if(changesNotSaved())
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit);
    });
    function changesNotSaved(){
        return $scope.categoryForSportsman.length > 0 && !$scope.isSaved && $rootScope.isChangingLocationFirstTime;
    }
});
