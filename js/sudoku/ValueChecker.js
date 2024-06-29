/**
 * A small helper utility class that tracks (value, location) pairs and will report duplicates.
 */
class ValueChecker {

    constructor() {
        this.checker = {}
        for(var i = 0; i < 9; i++) {
            checker[i + 1] = [];
        }
    }

    add(value, location) {
        if(!checker[value]) {
            // TODO: better error handling here
            return;
        }
        checker[value] = checker[value].concat(location);
    }

    getErrors() {
        var errors = [];
        for(var key in checker) {
            var val = checker[key];
            if(val.length > 1) {
                errors = errors.concat(val);
            }
        }
        return errors;
    }
}

export { ValueChecker };