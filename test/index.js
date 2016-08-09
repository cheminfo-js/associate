'use strict';

var process = require('..').process;

describe.only('Test the process', function () {
    
    var sources=[
        {x:1, y:1},
        {x:10, y:10},
    ];
    var targets=[
        {x:1, y:1},
        {x:1, y:2},
        {x:10, y:10},
        {x:10, y:12},
    ];



    it('La small set', function () {
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
        console.log(JSON.stringify(result, null, "  "));
    });

    
});
