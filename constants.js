app.constant('constants', {
    serverUrl: "http://localhost:3000",
    // serverUrl: "https://app-wushu.herokuapp.com",
    regex:{
        regexOnlyNumbers : new RegExp("^(\\d)*$"),
        regexEmail : new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+$"),
        regexHeb : new RegExp("^[\u0590-\u05FF ,.'-]+$"),
        regexHebrewAndNumbers : new RegExp("^[\u0590-\u05FF\0-9 ,.'-]+$")
    },
    sexEnum: [
        {id : 1, name : 'זכר' },
        {id : 2, name : 'נקבה' }
    ],
    sportStyleEnum: [
        {id : 1, name : 'טאולו' },
        {id : 2, name : 'סנדא' }
    ],
    compStatus: [
        {id : 1, name : 'פתוח'},
        {id : 2, name : 'סגור'},
        {id : 3, name : 'רישום סגור'}
    ],
    compStatusType: {
        OPEN: 0,
        CLOSE: 1,
        REGCLOSE: 2
    },
    fileName :{
      coachAsJudge :'שיוך מאמנים כשופטים במערכת'
    }
    //'someElseSetting': 'settingValue'
});
