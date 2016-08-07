'use strict';

var associator = require('..');

describe('Test the associator', function () {
    
    it('no overlapping target', function () {
        var result=associator({a:[1,2,3], b:[4,5,6], c:[7,8]}, {
            minTarget: 2,
            maxTarget: 2
        }); 
        result.stat.numberHits.should.equal(0);
    });

    it('with overlapping targets', function () {
        var result=associator({a:[1,2,3], b:[2,5,6], c:[7,8]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(0);
    });

    it('with no overlapping and one result', function () {
        var result=associator({a:[1,2], b:[3,4], c:[5,6]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(1);
    });

    it('with no overlapping and one result but couple of branches', function () {
        var result=associator({a:[1,2], b:[3,4]}, {
            minTarget: 1,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(1);
    });

    it('with no overlapping and one result but many branches', function () {
        var result=associator({a:[1,2], b:[3,4], c:[5,6], d:[7,8]}, {
            minTarget: 0,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(1);
    });

    it('with one overlapping and impossible result', function () {
        var result=associator({a:[1,2], b:[2,3]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(0);
    });

    it('with 2 overlapping and possible results', function () {
        var result=associator({a:[1,2], b:[2,3,4]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(1);
    });


    it('Large test 5544 possibilities but impossible result', function () {
        var result=associator({a:[1,2,3,4,5,6,7,8], b:[9,10,11], c:[12,13], d:[14,15,16,17,18,19,20,21,22,23,24,25]}, {
            minTarget: 2,
            maxTarget: 2
        });
        result.stat.numberHits.should.equal(0);
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
        result.stat.numberHits.should.equal(6);
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
        result.stat.numberHits.should.equal(6);
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
        result.stat.numberHits.should.equal(20);
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
        result.stat.numberHits.should.equal(113400);
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
        result.stat.numberHits.should.equal(113400);
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
        result.stat.numberHits.should.equal(90);
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
        result.stat.numberHits.should.equal(1);
    });

    it('Large (10) sequential set with only 10 targets', function () {
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3],
                c:[2,3,4],
                d:[3,4,5],
                e:[4,5,6],
                f:[5,6,7],
                g:[6,7,8],
                h:[7,8,9],
                i:[8,9,10],
                j:[9,10]
            }, {
                minTarget: 0,
                maxTarget: 2
            });
        result.stat.numberHits.should.equal(18215); // TODO not sure if correct
    });

    it('Large (12) sequential set with only 10 targets', function () {
        // could only work with some scoring problem
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3],
                c:[2,3,4],
                d:[3,4,5],
                e:[4,5,6],
                f:[5,6,7],
                g:[6,7,8],
                h:[7,8,9],
                i:[8,9,10],
                j:[9,10,11],
                k:[10,11,12],
                l:[11,12]
            }, {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [2,12,2]
            });
        result.stat.numberHits.should.equal(37017); // TODO not sure if correct
    });

    it('Basic example of maxCounts', function () {
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3],
                c:[2,3]
            }, {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [0,3,0]
            });
        result.stat.numberHits.should.equal(3);
    });

    it('Basic example of maxCounts with 2 possibilities', function () {
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3],
                c:[]
            }, {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [1,100,1]
            });
        result.stat.numberHits.should.equal(3);
    });
    
    it('Large (20) sequential set with 20 targets', function () {
        // could only work with some scoring problem
        var result=associator(
            {
                a:[1],
                b:[2,3],
                c:[3,4],
                d:[4,5],
                e:[5],
                f:[6,7],
                g:[7,8],
                h:[8],
                i:[9,10],
                j:[10,11],
                k:[10,11,12],
                l:[11,12,13],
                m:[12,13,14],
                n:[13,14,15],
                o:[14,15,16],
                p:[15,16,17],
                q:[16,17,18],
                r:[17,18,19],
                s:[18,19,20],
                t:[19,20],
            }, {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [2,100,100]
            });
        result.stat.numberHits.should.equal(53392);
    });

    it.skip('Basic example of scoreFunction', function () {
        var result=associator(
            {
                a:[1,2],
                b:[1,2,3],
                c:[2,3]
            }, {
                minTarget: 0,
                maxTarget: 2,
                scoreFunction: function(source,targets) {
                    console.log(source, targets);
                    return Math.pow(0.99, Math.pow(2,targets.length));
                }
            });
    //    result.stat.numberHits.should.equal(3);
    });
    
    
});
