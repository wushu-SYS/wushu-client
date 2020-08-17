/**
 * confirmDialogService - provides building of pop ups for errors, questions, warnings etc
 */
app.service('confirmDialogService', function ($ngConfirm, $location, $route, $rootScope) {
    this.notSavedItems = function (event, next, saveFunction, isValidForm, modalOpen) {
        if (event)
            event.preventDefault();
        $ngConfirm({
            title: 'השינויים לא נשמרו',
            content: 'האם לשמור את השינויים שבוצעו?',
            type: 'red',
            typeAnimated: true,
            buttons: {
                save: {
                    text: 'שמור',
                    btnClass: 'btn-red',
                    action: function () {
                        if (isValidForm === false)
                            $rootScope.isChangingLocationFirstTime = true;
                        else {
                            isValidForm ? saveFunction(isValidForm) : saveFunction();
                            $rootScope.isChangingLocationFirstTime = false;
                            $route.reload();
                            $location.path(next);
                        }
                    }
                },
                continueWithoutSaving: {
                    text: 'המשך ללא שמירה',
                    action: function () {
                        $rootScope.isChangingLocationFirstTime = false;
                        if(modalOpen) modalOpen.close();
                        $route.reload();
                        $location.path(next);
                    }
                },
                cancel: {
                    text: 'בטל',
                    action: function () {
                        $rootScope.isChangingLocationFirstTime = true;
                    }
                }
            }
        });
    }

    this.askQuestion = function (question, functionIfYes) {
        $ngConfirm({
            title: '',
            type: 'orange',
            content: question,
            buttons: {
                כן: function () {
                    functionIfYes();
                },
                לא: function () {
                }
            }
        })
    }

    this.showErrors = function (errors) {
        $ngConfirm({
            title: 'שגיאות בעת ביצוע הפעולה',
            type: 'red',
            content: errors.join('<br>'),
            buttons: {
                הבנתי: function () {
                }
            }
        })
    }

    this.showMessage = function (message, callbackFunction, messageTitle = '') {
        $ngConfirm({
            title: messageTitle,
            type: 'blue',
            content: message,
            buttons: {
                המשך: function () {
                    if(callbackFunction)
                        callbackFunction();
                }
            }
        })
    }

    this.chooseUserType = function (buttonValues, collbackfunc) {
        if(buttonValues.length == 1){
            collbackfunc(buttonValues[0]);
            return;
        }
        $ngConfirm({
            title: "המערכת מצאה מספר הרשאות לת.ז. שהוזנה",
            content: "אם איזה הרשאה תרצה להתחבר?",
            columnClass: 'col-md-4',
            type: 'blue',
            typeAnimated: true,
            buttons: {
                sportsmanType: {
                    show: buttonValues.includes($rootScope.userTypes.SPORTSMAN),
                    text: 'ספורטאי',
                    action: function(){
                        collbackfunc($rootScope.userTypes.SPORTSMAN);
                        return;
                    }
                },
                coachType: {
                    show: buttonValues.includes($rootScope.userTypes.COACH),
                    text: 'מאמן',
                    action: function(){
                        collbackfunc($rootScope.userTypes.COACH);
                        return;
                    }
                },
                adminType: {
                    show: buttonValues.includes($rootScope.userTypes.MANAGER),
                    text: 'מנהל',
                    action: function(){
                        collbackfunc($rootScope.userTypes.MANAGER);
                        return;
                    }
                },
                judgeType: {
                    show: buttonValues.includes($rootScope.userTypes.Judge),
                    text: 'שופט',
                    action: function(){
                        collbackfunc($rootScope.userTypes.Judge);
                        return;
                    }
                },
            }
        });
    }
});
