// Collects values and tells you whether it's state is valid when asked
var ValueChecker = function () {

    var checker = {}
    for(var i = 0; i < 9; i++) {
        checker[i + 1] = []
    }

    var add = function (value, location) {
        if(!checker[value]) return;
        checker[value] = checker[value].concat(location);
    }

    var getErrors = function () {
        var errors = [];
        for(var key in checker) {
            var val = checker[key];
            if(val.length > 1) {
                errors = errors.concat(val);
            }
        }
        return errors;
    }

    return {
        add: add,
        getErrors: getErrors
    }
}