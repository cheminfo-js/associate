'use strict';

var process = require('..').process;

describe('Global test', function () {
    


    it('on very small set without hierarchy splitting', function () {
        var sources=[
            {x:1, y:1},
            {x:10, y:10}
        ];
        var targets=[
            {x:1, y:1},
            {x:1, y:2},
            {x:10, y:10},
            {x:10, y:11}
        ];

        // could only work with some scoring problem

        var getDistance=function(source, target) {
            return Math.sqrt(Math.pow(Math.abs(source.x-target.x),2) + Math.pow(Math.abs(source.y-target.y),2));
        };

        var result=process(
            sources,
            targets,
            {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [2,12,2],
                candidateFunction: function(source,target) {
                    var distance=getDistance(source, target);
                    return distance<100;
                },
                scoreFunction: function(source,targets) {
                    var score=1;
                    for (var target of targets) {
                        score*=1/(getDistance(source, target)+1);
                    }
                    return score;
                }
            }
        );
        result.length.should.equal(2);
        result[0].targets.should.eql([0,1]);
        result[1].score.should.equal(0.5);
        // console.log(JSON.stringify(result, null, "  "));
    });

    it('on very small set with hierarchy splitting', function () {
        // could only work with some scoring problem

        var sources=[
            {x:1, y:1},
            {x:10, y:10}
        ];
        var targets=[
            {x:1, y:1},
            {x:1, y:2},
            {x:10, y:10},
            {x:10, y:11}
        ];
        
        var getDistance=function(source, target) {
            return Math.sqrt(Math.pow(Math.abs(source.x-target.x),2) + Math.pow(Math.abs(source.y-target.y),2));
        };
        
        var result=process(
            sources,
            targets,
            {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [2,12,2],
                candidateFunction: function(source,target) {
                    var distance=getDistance(source, target);
                    return distance<3;
                },
                scoreFunction: function(source,targets) {
                    var score=1;
                    for (var target of targets) {
                        score*=1/(getDistance(source, target)+1);
                    }
                    return score;
                }
            }
        );
        result.length.should.equal(2);
        result[0].targets.should.eql([0,1]);
        result[1].score.should.equal(0.5);
        // console.log(JSON.stringify(result, null, "  "));
    });

    it('on very small set with not all associated', function () {
        // could only work with some scoring problem

        var sources=[
            {x:1, y:1},
            {x:10, y:10}
        ];
        var targets=[
            {x:1, y:1},
            {x:1, y:2}
        ];

        var getDistance=function(source, target) {
            return Math.sqrt(Math.pow(Math.abs(source.x-target.x),2) + Math.pow(Math.abs(source.y-target.y),2));
        };

        var result=process(
            sources,
            targets,
            {
                minTarget: 0,
                maxTarget: 2,
                candidateFunction: function(source,target) {
                    var distance=getDistance(source, target);
                    return distance<3;
                },
                scoreFunction: function(source,targets) {
                    var score=1;
                    for (var target of targets) {
                        score*=1/(getDistance(source, target)+1);
                    }
                    return score;
                }
            }
        );
        result.length.should.equal(2);
        result[0].targets.should.eql([0,1]);
        result[1].targets.should.eql([]);
        result[1].score.should.equal(1);
    });
    
});
