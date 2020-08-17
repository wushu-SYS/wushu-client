describe('common functions service test', function () {
    var commonFunctionsService, constants;
    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function (_commonFunctionsService_, _constants_) {
        commonFunctionsService = _commonFunctionsService_;
        constants = _constants_;
    }));

    describe('array remove', function () {
        let collection;
        beforeEach(inject(function () {
            collection = [...Array(5).keys()];
        }));

        it('should remove existed item from array', function () {
            collection = commonFunctionsService.arrayRemove(collection, 2);
            expect(collection.length).toEqual(4);
            expect(collection.includes(2)).toEqual(false);
            expect(collection).toEqual([0,1, 3, 4]);
        });
        it('should not fail whem removing not existed item from array', function () {
            collection = commonFunctionsService.arrayRemove(collection, 8);
            expect(collection.length).toEqual(5);
            expect(collection.includes(8)).toEqual(false);
            expect(collection).toEqual([0,1, 2, 3, 4]);
        })
    });

    describe('get month names', function () {
        it('should return json of months', function () {
            let res = commonFunctionsService.getMonthNames();
            expect(res.length).toEqual(12);
            expect(res[0]).toEqual({id:0, name:'ינואר'});
        })
    });

    describe('convert num to month', function () {
        it('should return the correct month name', function () {
            let res = commonFunctionsService.convertNumToMonth(1);
            expect(res).toEqual('פברואר');
        })

        it('should check correction for upper bound', function () {
            let res = commonFunctionsService.convertNumToMonth(11);
            expect(res).toEqual('דצמבר');
        })

        it('should check illegal upper bound', function () {
            let res = commonFunctionsService.convertNumToMonth(12);
            expect(res).toEqual('');
        })

        it('should check correction for lower bound', function () {
            let res = commonFunctionsService.convertNumToMonth(0);
            expect(res).toEqual('ינואר');
        })

        it('should check illegal lower bound', function () {
            let res = commonFunctionsService.convertNumToMonth(-1);
            expect(res).toEqual('');
        })

        it('should return empty string for non numeric input', function () {
            let res = commonFunctionsService.convertNumToMonth("0");
            expect(res).toEqual('');
        })

        it('should return empty string for illegal number for month', function () {
            let res = commonFunctionsService.convertNumToMonth(15);
            expect(res).toEqual('');
        })
    });
});
