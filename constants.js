app.constant('constants', {
    serverUrl: "http://localhost:3000",
    // serverUrl: "https://app-wushu.herokuapp.com",
    regex:{
        regexOnlyNumbers : new RegExp("^(\\d)*$"),
        regexOnlyDouble: new RegExp("\d{1,5}"),
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
        {id : 2, name : 'סנדא' },
        {id :3 ,name : 'משולב'}
    ],
    compStatus: [
        {id : 1, name : 'תחרות פתוחה'},
        {id : 2, name : 'תחרות סגורה'},
        {id : 3, name : 'רישום סגור'},
        {id : 4, name : 'תחרות בתהליך'}
    ],
    compStatusType: {
        OPEN: 0,
        CLOSE: 1,
        REGCLOSE: 2,
        COMPETITIONPROGRESS: 3
    },
    fileName :{
      coachAsJudge :'שיוך מאמנים כשופטים במערכת'
    }
});
