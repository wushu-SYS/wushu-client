/**
 * this service is a wrapper for $cacheFactory
 */
app.service('cacheService', function($cacheFactory) {
    let cache = $cacheFactory('cacheId');

    this.put = function(key, value) {
        cache.put(key, angular.isUndefined(value) ? null : value);

    }

    this.get = function (key){
        return cache.get(key);
    }
});
