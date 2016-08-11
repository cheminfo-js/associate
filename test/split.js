'use strict';

var split = require('../src/util/split.js');

describe('Split unconnected graphs', function () {

    it('Basic tree', function () {
        // could only work with some scoring problem
        var results=split(
            {
                a:[1,2],
                b:[2,3],
                c:[4]
            });

        results.length.should.equal(2);
        results[0].should.eql( { a: [ 1, 2 ], b: [ 2, 3 ] });
        results[1].should.eql( { c: [ 4 ] } );
    });
    
    it('Large tree not separable', function () {
        // could only work with some scoring problem
        var results=split(
            {
                a:[1],
                b:[2,3],
                c:[6,7],
                d:[4,5,6],
                e:[5],
                f:[1,2,3,6],
                g:[7,8],
                h:[8],
                i:[9,10,8],
            });

        results.length.should.equal(1);
    });

    it('Large tree', function () {
        // could only work with some scoring problem
        var results=split(
            {
                a:[1],
                b:[2,3],
                c:[6,7],
                d:[4,5],
                e:[5],
                f:[1,2,3],
                g:[7,8],
                h:[8],
                i:[9,10,8],
            });
        results.length.should.equal(3);
    });
});
