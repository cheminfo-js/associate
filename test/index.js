'use strict';

var process = require('..').process;

describe('Test the process', function () {
    
    var sources=[
        {x:1, y:1},
        {x:10, y:10},
    ];
    var targets=[
        {x:1, y:1},
        {x:1, y:2},
        {x:10, y:10},
        {x:10, y:11},
    ];



    it.only('La small set', function () {
        // could only work with some scoring problem
        var result=process(
            sources,
            targets,
            {
                minTarget: 0,
                maxTarget: 2,
                maxCounts: [2,12,2],
                candidateFunction: function(source,target) {
                    var distance=Math.sqrt(Math.pow(Math.abs(source.x-target.x),2) + Math.pow(Math.abs(source.y-target.y),2));
                    console.log(distance);
                    return distance<2;
                },
                scoreFunction: function(source,targets) {
                    console.log(source, targets);
                    return Math.pow(0.99, Math.pow(2,targets.length));
                }
            }
        );
        console.log(result);
    });

    
});
