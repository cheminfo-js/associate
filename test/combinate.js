'use strict';

var combinate = require('../src/util/combinate.js');

describe('Test combination', function () {
    
    it('Test [1,2,3,4,5] and min, max = 0', function () {
        var results=combinate([1,2,3,4,5], 0, 0);
        results.length.should.equal(1);
    });

    it('Test [1,2,3,4,5] and min, max = 1', function () {
        var results=combinate([1,2,3,4,5], 1, 1);
        results.length.should.equal(5);
    });

    it('Test [1,2,3,4,5] and min, max = 2', function () {
        var results=combinate([1,2,3,4,5], 2, 2);
        results.length.should.equal(10);
    });

    it('Test [1,2,3,4,5] and min = 0, max = 2', function () {
        var results=combinate([1,2,3,4,5], 0, 2);
        results.length.should.equal(16);
    });

    it('Test [1,2] and min = 3, max = 3', function () {
        var results=combinate([1,2], 3, 3);
        results.length.should.equal(0);
    });

    it('Test [] and min = 0, max = 3', function () {
        var results=combinate([], 0, 3);
        results.length.should.equal(1);
    });
});
