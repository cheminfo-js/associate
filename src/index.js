'use strict';

module.exports = associator;
/**
 * @param source = {a:[], b:[], c:[], ...}
 * @param target = [1,2,3,4,5,6]
 * @param maxTarget integer of max association
 * @param minTarget integer of min association
 * @returns {*} return the top 3 best association
 */




function associator(source, target, maxTarget, minTarget) {
    var targ = new Map();
    target.map(function(key) {
       targ.set(key, false);
    });
    target = targ;
    var sourcePos = new Map();
    for(var key in source) {
        sourcePos.set(source[key], 0);
    }

    var finished = false;

    while(!finished) {










        for(key in source) {
            if(sourcePos[key] < source[key].length) {
                finished = true;
            }
        }


        finished = true;
    }






    /*
    var target = new Map();
    for (var i = 0; i < child.length; i++) {
        target.set(child[i], false);

    }
    var nTarget = child.length;
    var ast = {source: [], target: []};

    var sourcePos = {};
    var counter = {};
    var sourceIter = {};
    for (key in links) {
        sourcePos[key] = 0;
        sourceIter[key] = new Array(links[key].length).fill(false);
        counter[key] = 0;
    };
    var loop = 0;
    var bool = false;
    while(ast.target.length < nTarget && loop < 8) {
        console.log("__________________")

        bool = false;
        for (var key in links) {
            while (target.get(links[key][sourcePos[key]])) {
                sourcePos[key]++;
            }

            if (sourcePos[key] < links[key].length && counter[key] < maxTarget && !sourceIter[key][sourcePos[key]]) {
                target.set(links[key][sourcePos[key]], true);
                sourceIter[key][sourcePos[key]] = true;
                ast.source.push(key);
                ast.target.push(links[key][sourcePos[key]]);

                counter[key]++;
            }

        }
        console.log("Assignement Source : ", ast.source);
        console.log("Assignement Target : ", ast.target);
        console.log("Target: ", target)
        console.log("Source Iteration: ", sourceIter)

        loop ++; // JUST TO STOP INFINITE LOOP
    }
    */

    return



}




function getScore() {
    return 100;
}

console.log(associator({a:[1,2], b:[1, 2, 3, 4, 5, 6], c:[5, 6]}, [1, 2, 3, 4, 5, 6], 0, 2));