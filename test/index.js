'use strict';

var associator = require('..');

describe('Test the associator', function () {
    
    it('no overlapping target', function () {
        var result=associator({a:[1,2,3], b:[4,5,6], c:[7,8]}, {
            minTarget: 2,
            maxTarget: 2
        }); 
        result.should.equal(0);
    });

    it('with overlapping targets', function () {
        var result=associator({a:[1,2,3], b:[2,5,6], c:[7,8]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(0);
    });

    it('with no overlapping and one result', function () {
        var result=associator({a:[1,2], b:[3,4], c:[5,6]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(1);
    });

    it('with no overlapping and one result but couple of branches', function () {
        var result=associator({a:[1,2], b:[3,4]}, {
            minTarget: 1,
            maxTarget: 2
        });
        result.should.equal(1);
    });

    it('with no overlapping and one result but many branches', function () {
        var result=associator({a:[1,2], b:[3,4], c:[5,6], d:[7,8]}, {
            minTarget: 0,
            maxTarget: 2
        });
        result.should.equal(1);
    });

    it('with one overlapping and impossible result', function () {
        var result=associator({a:[1,2], b:[2,3]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(0);
    });

    it('with 2 overlapping and possible results', function () {
        var result=associator({a:[1,2], b:[2,3,4]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(1);
    });


    it('Large test 5544 possibilities but impossible result', function () {
        var result=associator({a:[1,2,3,4,5,6,7,8], b:[9,10,11], c:[12,13], d:[14,15,16,17,18,19,20,21,22,23,24,25]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(0);
    });

    it('Small test with many assignment', function () {
        var result=associator(
            {
                a:[1,2,3,4],
                b:[1,2,3,4]
            }, {
            minTarget: 2,
            maxTarget: 2
        });
        result.should.equal(6);
    });

    it('Small test with many assignment and minTarget=0', function () {
        var result=associator(
            {
                a:[1,2,3,4],
                b:[1,2,3,4]
            }, {
                minTarget: 0,
                maxTarget: 2
            });
        result.should.equal(6);
    });

    it('Small test with many assignment and 3 min / max', function () {
        var result=associator(
            {
                a:[1,2,3,4,5,6],
                b:[1,2,3,4,5,6]
            }, {
                minTarget: 3,
                maxTarget: 3
            });
        result.should.equal(20);
    });

    it('Large test with many assignment and 2 min / max - 45*28*15*6 possibilities', function () {
        var result=associator(
            {
                a:[1,2,3,4,5,6,7,8,9,10],
                b:[1,2,3,4,5,6,7,8,9,10],
                c:[1,2,3,4,5,6,7,8,9,10],
                d:[1,2,3,4,5,6,7,8,9,10],
                e:[1,2,3,4,5,6,7,8,9,10]

            }, {
                minTarget: 2,
                maxTarget: 2
            });
        result.should.equal(113400);
    });

    it('Large test with many assignment and 0 min / 2 max - 45*28*15*6 possibilities', function () {
        var result=associator(
            {
                a:[1,2,3,4,5,6,7,8,9,10],
                b:[1,2,3,4,5,6,7,8,9,10],
                c:[1,2,3,4,5,6,7,8,9,10],
                d:[1,2,3,4,5,6,7,8,9,10],
                e:[1,2,3,4,5,6,7,8,9,10]

            }, {
                minTarget: 0,
                maxTarget: 2
            });
        result.should.equal(113400);
    });
    

    it('Small test with 90 assignments and 2 min / max', function () {
        var result=associator(
            {
                a:[1,2,3,4,5,6],
                b:[1,2,3,4,5,6],
                c:[1,2,3,4,5,6]
            }, {
                minTarget: 0,
                maxTarget: 2
            });
        result.should.equal(90);
    });

    it('Large (10) sequential set', function () {
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3,4],
                c:[3,4,5,6],
                d:[5,6,7,8],
                e:[7,8,9,10],
                f:[9,10,11,12],
                g:[11,12,13,14],
                h:[13,14,15,16],
                i:[15,16,17,18],
                j:[17,18,19,20]
            }, {
                minTarget: 0,
                maxTarget: 2
            });
        result.should.equal(1);
    });
    
    
});
