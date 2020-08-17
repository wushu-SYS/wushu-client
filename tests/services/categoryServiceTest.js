describe('category service test', function () {
    var categoryService, constants;
    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function (_categoryService_, _constants_) {
        categoryService = _categoryService_;
        constants = _constants_;
    }));

    describe('get age range', function () {
        it('should get category object with max and min age', function () {
            let range = categoryService.getAgeRange(
                {
                    minAge: 6,
                    maxAge: 10
                }
            );
            expect(range).toEqual("6-10");
        });
        it('should support category object with only min age', function () {
            let range = categoryService.getAgeRange(
                {
                    minAge: 10
                }
            );
            expect(range).toEqual("10+");
        });
        it('should support category object with min age equal to zero and no max age', function () {
            let range = categoryService.getAgeRange(
                {
                    minAge: 0
                }
            );
            expect(range).toEqual("");
        });
        it('should support category object with max and min age when min age equal to zero', function () {
            let range = categoryService.getAgeRange(
                {
                    minAge: 0,
                    maxAge: 5
                }
            );
            expect(range).toEqual("0-5");
        });
    });
});
