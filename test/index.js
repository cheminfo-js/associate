'use strict';

var associator = require('..');

describe.only('Test the associator', function () {

    var result=associator({a:[1,2,3], b:[1, 2, 3], c:[5, 6,2]}, {
        minTarget: 2,
        maxTarget: 2
    });

    it('should be tested', function () {
        
    });
});
