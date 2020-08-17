app.filter('fromMap', function() {
    return function (input) {
        if(input) {
            var out = [];
            input.forEach((v, k) => out.push(v));
            return out;
        }
    };
})
