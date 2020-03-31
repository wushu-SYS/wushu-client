app.controller("registrationStateController",function($scope, $rootScope, $window, $http, $location, $filter, commonFunctionsService, sportsmanService, competitionService, $routeParams, categoryService, confirmDialogService, toastNotificationService,constants) {
    $scope.categoryForSportsman = [];
    $scope.toUnRegisterUsers = [];
    $scope.selectedSportsmenToMerge = [];
    $scope.currentCompetition = {
        idCompetition: $routeParams.idCompetition,
        date: $routeParams.date,
        status: $routeParams.status
    };
    $scope.compStatus = constants.compStatus;
    $scope.compStatusType = constants.compStatusType;
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
                    isDeleted: user.isDeleted,
                    indx: user.indx
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

    $scope.changeOrder = function(scope){
        let indx = 0;
        $scope.usersCategories.forEach(userCategory => userCategory.users.forEach(user => {
            if(user.indx !== indx) {
                user.indx = indx;
                scope.categoryForSportsman.push(
                    {
                        id: user.id,
                        category: user.selectedCategory.id,
                        oldCategory: user.selectedCategory.id,
                        isDeleted: user.isDeleted,
                        indx: user.indx
                    }
                );
            }
            indx += 1;
        }));
    };
    $scope.closeRegistration = function() {
        confirmDialogService.askQuestion("האם אתה בטוח שברצונך לסגור את הרישום לתחרות?", function () {
            competitionService.closeRegistration($scope.currentCompetition.idCompetition)
                .then(function (result) {
                    toastNotificationService.successNotification("הרישום נסגר בהצלחה");
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

//from: http://embed.plnkr.co/1qZcq3/
app.directive("dragDrop", ["$parse",
    function($parse) {
        var sourceParent = "";
        var sourceIndex = -1;
        return {
            link: function($scope, elm, attr, ctrl) {

                // #region Initialization

                // Get TBODY of a element
                var tbody = elm.parent();
                // Set draggable true
                elm.attr("draggable", true);
                // If id of TBODY of current element already set then it won't set again
                tbody.attr('drag-id') ? void 0 : tbody.attr("drag-id", $scope.$id);
                // This add drag pointer
                elm.css("cursor", "move");

                // Events of element :- dragstart | dragover | drop | dragend
                elm.on("dragstart", onDragStart);
                elm.on("dragover", onDragOver);
                elm.on("drop", onDrop);
                elm.on("dragend", onDragEnd);

                // #endregion

                // This will trigger when user pick e row
                function onDragStart(e) {

                    //Mozilla Hack
                    e.originalEvent.dataTransfer.setData("Text", "");

                    if (!sourceParent) {

                        // Set selected element's parent id
                        sourceParent = tbody.attr('drag-id') ? tbody.attr('drag-id') : void 0;

                        // Set selected element's index
                        sourceIndex = $scope.$index;

                        // This don't support in IE but other browser support it
                        // This will set drag Image with it's position
                        // IE automically set image by himself
                        typeof e.originalEvent.dataTransfer.setDragImage !== "undefined" ?
                            e.originalEvent.dataTransfer.setDragImage(e.target, -10, -10) : void 0;

                        // This element will only drop to the element whose have drop effect 'move'
                        e.originalEvent.dataTransfer.effectAllowed = 'move';
                    }
                    return true;
                }

                // This will trigger when user drag source element on another element
                function onDragOver(e) {

                    // Prevent Default actions
                    e.preventDefault ? e.preventDefault() : void 0;
                    e.stopPropagation ? e.stopPropagation() : void 0;

                    // This get current elements parent id
                    var targetParent = tbody.attr('drag-id') ? tbody.attr('drag-id') : void 0;


                    // If user drag elemnt from its boundary then cursor will show block icon else it will show move icon [ i.e : this effect work perfectly in google chrome]
                    e.originalEvent.dataTransfer.dropEffect = sourceParent !== targetParent || typeof attr.ngRepeat === "undefined" ? 'none' : 'move';

                    return false;
                }

                //This will Trigger when user drop source element on target element
                function onDrop(e) {

                    // Prevent Default actions
                    e.preventDefault ? e.preventDefault() : void 0;
                    e.stopPropagation ? e.stopPropagation() : void 0;

                    if (typeof attr.ngRepeat === "undefined")
                        return false;
                    // Get this item List
                    var itemList = $parse(attr.ngRepeat.split("in")[1].trim())($scope);


                    // Get target element's index
                    var targetIndex = $scope.$index;

                    // Get target element's parent id
                    var targetParent = tbody.attr('drag-id') ? tbody.attr('drag-id') : void 0;

                    // Get properties names which will be changed during the drag and drop
                    var elements = attr.dragDrop ? attr.dragDrop.trim().split(",") : void 0;

                    // If user dropped element into it's boundary and on another source not himself
                    if (sourceIndex !== targetIndex && targetParent === sourceParent) {

                        // If user provide element list by ','
                        typeof elements !== "undefined" ? elements.forEach(function(element) {
                            element = element.trim();
                            typeof itemList[targetIndex][element] !== "undefined" ?
                                itemList[targetIndex][element] = [itemList[sourceIndex][element], itemList[sourceIndex][element] = itemList[targetIndex][element]][0] : void 0;
                        }) : void 0;
                        // Visual row change
                        itemList[targetIndex] = [itemList[sourceIndex], itemList[sourceIndex] = itemList[targetIndex]][0];
                        // After completing the task directive send changes to the controller
                        $scope.$apply(function() {
                            typeof attr.afterDrop != "undefined" ?
                                $parse(attr.afterDrop)($scope)({
                                    sourceIndex: sourceIndex,
                                    sourceItem: itemList[sourceIndex],
                                    targetIndex: targetIndex,
                                    targetItem: itemList[targetIndex]
                                }) : void 0;

                        });
                    }
                }
                // This will trigger after drag and drop complete
                function onDragEnd(e) {

                    //clearing the source
                    sourceParent = "";
                    sourceIndex = -1;

                    $scope.changeOrder($scope);
                }

            }
        }
    }
]);
