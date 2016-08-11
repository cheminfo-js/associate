'use strict';

module.exports = {
    process: process
};

var split=require('./util/split.js');


var associate=require('./associate.js');


function process(sources, targets, options) {

    // we create the globalHierarchy
    var globalHierarchy = {};
    for (var i=0; i<sources.length; i++) {
        var source=sources[i];
        globalHierarchy[i]=[];
        for (var j=0; j<targets.length; j++) {
            var target=targets[j];
            if (! options.candidateFunction || options.candidateFunction(source, target)) {
                globalHierarchy[i].push(j);
            }
        }
    }
    
    // we can split it into independant hierarchies
    var hierarchies=split(globalHierarchy);
    
    var results=[];
    // now we need to calculate the tree
    for (var hierarchy of hierarchies) {
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


