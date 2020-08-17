describe('competitionService service test', function () {
    var competitionService, constants;
    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function (_competitionService_, _constants_) {
        competitionService = _competitionService_;
        constants = _constants_;
    }));

    describe('build conditions', function () {
        it('should build empty condition', function () {
            let conditions = competitionService.buildConditions();
            expect(conditions).toEqual('');
        });
        it('should build condition with location and sport style', function () {
            let conditions = competitionService.buildConditions("ראשון", constants.sportStyleEnum[0]);
            expect(conditions).toEqual('?location=ראשון&sportStyle=טאולו');
        });
        it('should build condition with close status', function () {
            let conditions = competitionService.buildConditions("", undefined, [constants.compStatus[constants.compStatusType.CLOSE]]);
            expect(conditions).toEqual('?status=תחרות סגורה');
        });
        it('should build condition with open and reg close status', function () {
            let conditions = competitionService.buildConditions(undefined, undefined, [constants.compStatus[constants.compStatusType.OPEN], constants.compStatus[constants.compStatusType.REGCLOSE]]);
            expect(conditions).toEqual('?status=תחרות פתוחה,רישום סגור');
        });
    });

    describe('calcAverageGrade', function () {
        it('should calculate the average grade of 3 judges', function () {
            let avg = competitionService.calcAverageGrade([1, 2], 5);
            expect(avg).toEqual(2.6666666666666665);
        });
        it('should calculate the average grade of 1 judge', function () {
            let avg = competitionService.calcAverageGrade([], 5);
            expect(avg).toEqual(5);
        });
        it('should return zero when parameters undefined', function () {
            let avg = competitionService.calcAverageGrade(undefined, undefined);
            expect(avg).toEqual(0);

            avg = competitionService.calcAverageGrade([], undefined);
            expect(avg).toEqual(0);

            avg = competitionService.calcAverageGrade(undefined, 2);
            expect(avg).toEqual(2);
        });
    });
});
