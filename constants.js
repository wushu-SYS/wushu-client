app.constant('constants', {
    serverUrl: "http://10.0.0.6:3000",
    // serverUrl: "https://app-wushu.herokuapp.com",
    regex:{
        regexOnlyNumbers : new RegExp("^(\\d)*$"),
        regexForCompetitionGrade: new RegExp("^[0-9]\\.[0-9][0-9]?$|^10$|^[1-9]$"),
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
    sportStyleType:{
      TAULLO: 0,
      SANDA: 1,
      BOTH: 2
    },
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
