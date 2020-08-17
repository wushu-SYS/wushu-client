describe('sportsman service test', function () {
    var sportsmanService, constants;
    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function (_sportsmanService_, _constants_) {
        sportsmanService = _sportsmanService_;
        constants = _constants_;
    }));
    describe('build conditions', function () {
        it('should build empty condition', function () {
            let conditions = sportsmanService.buildConditionds();
            expect(conditions).toEqual('');
        });
        it('should build condition only with search text', function () {
            let conditions = sportsmanService.buildConditionds('אביב');
            expect(conditions).toEqual('?value=אביב');
        });
        it('should build condition with sport style and sex', function () {
            let conditions = sportsmanService.buildConditionds(undefined, constants.sportStyleEnum[0], undefined, constants.sexEnum[0]);
            expect(conditions).toEqual('?sportStyle=טאולו&sex=זכר');
        });
        it('should build condition with empty search string', function () {
            let conditions = sportsmanService.buildConditionds('');
            expect(conditions).toEqual('');
        })
    });

    describe('formatSportsmanCategoriesList', function () {
    })
});
