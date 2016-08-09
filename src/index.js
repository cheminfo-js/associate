'use strict';

module.exports = {
    process
};

var simpleClustering=require('./util/simpleClustering.js');


var associate=require('./associate.js');
var createHierarchy=require('./util/createHierarchy.js');

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
    // TODO : Waiting for working project
    var submatrices=simpleClustering(associationMatrix, {threshold:0,out:"values"});
    var submatrices=[associationMatrix];

    
    var results=[];
    // now we need to calculate the tree
    for (var matrix of submatrices) {
        var hierarchy = createHierarchy(matrix);
        var result=associate(hierarchy, sources, targets, options);
        results.push(result);
    }
    
    // if we just want to flatten the best matches
    var best=[];
    results.forEach(function(result) {
        for (var key in result.best) {
            best[key>>0]=result.best[key];
        }
    })
    
    return best;
}


