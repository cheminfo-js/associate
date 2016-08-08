'use strict';

module.exports = {
    process
};


var associate=require('./associate.js');
var createHierarchy=require('./createHierarchy.js');

function process(sources, targets, options) {
    
    // we will construct a matrix with the valud sources / targerts
    var associationMatrix=new Array();
    for (var i=0; i<sources.length; i++) {
        associationMatrix.push(new Array(targets.length).fill(0))
    };
    
    for (var i=0; i<sources.length; i++) {
        var source=sources[i];
        for (var j=0; j<targets.length; j++) {
            var target=targets[j];
            if (! options.candidateFunction || options.candidateFunction(source, target)) {
                associationMatrix[i][j]=((i+1)<<16)+(j+1);
            }
        }
    }

    // we need now to split in sub matrices in order to accelerate the process


    var submatrices=[associationMatrix];

    // now we need to calculate the tree
    for (var matrix of submatrices) {
        var hierarchy = createHierarchy(matrix, sources, targets);
        associate(hierarchy, options);
    }
}


