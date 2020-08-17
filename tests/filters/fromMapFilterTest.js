describe('from map filter test', function () {
    var $filter;
    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('should convert map to array', function () {
        let filtered = $filter('fromMap')({ 'a': 1, 'b': 2, 'c': 3 });
        expect(filtered.length).toEqual(3);
        expect(filtered).toEqual([1, 2, 3]);
    });
    it('should convert undefined map to empty array', function () {
        let filtered = $filter('fromMap')(undefined);
        expect(filtered).toEqual(undefined);
    });
    it('should convert empty map to empty array', function () {
        let filtered = $filter('fromMap')({});
        expect(filtered.length).toEqual(0);
        expect(filtered).toEqual([]);
    });
});
