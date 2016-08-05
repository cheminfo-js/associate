'use strict';

module.exports = associator;
/**
 * @param source = {a:[], b:[], c:[], ...}
 * @param target = [1,2,3,4,5,6]
 * @param maxTarget integer of max association
 * @param minTarget integer of min association
 * @returns {*} return the top 3 best association
 */




function associator(source, target, minTarget,  maxTarget) {
    var t = new Map();
    target.map(function(key) {
       t.set(key, false);
    });
    target = t;
    var sourcePos = {};
    for(var key in source) {
        sourcePos[key] = 0;
    }
    var finished = false;
    var looping = 0;
    var level = [];

    var assign = {source:[], target:[]};
    while(!finished) {
        while(!newAssoc && looping < 10) {
            level.push(assign.source.length);
            var newAssign = 0;
            for(key in source) {
                while(target.get(source[key][sourcePos[key]]) && sourcePos[key] < source[key].length) {
                        sourcePos[key]++;
                }
                var count = assign.source.reduce((prev, val) => val === key ? prev + 1 : prev, 0);
                if(sourcePos[key] < source[key].length && count < maxTarget) {
                    assign.source.push(key);
                    assign.target.push(source[key][sourcePos[key]]);
                    target.set(source[key][sourcePos[key]], true);
                    newAssign ++;
                }
            }


            var newAssoc = true;


            target.forEach(function(bool){
                if(!bool) {
                    newAssoc = false;
                }
            });

            console.log("___________________________");
            console.log("Source: " + assign.source);
            console.log("target: " + assign.target);
            console.log("Level: " + level);
            console.log("SourcePos: ", sourcePos);
            if(newAssign === 0 && newAssoc == false){
                console.log("*********")
                level.pop();
                for(var i = level[level.length-1]; i < assign.source.length; i++) {
                    if(sourcePos[assign.source[i]] == source[assign.source[i]].length) {
                        sourcePos[assign.source[i]] = 0;
                    }
                    target.set(assign.target[i], false);
                }
                assign.target.splice(level[level.length-1], assign.target.length);
                assign.source.splice(level[level.length-1], assign.source.length);
                var bool = true
                console.log("SourcePos: ", sourcePos);
            }


            looping ++;

        }



        // while(!newAssoc && looping < 8) {
        //
        //
        //
        //
        //
        //
        //     newAssoc = true;
        //
        //     target.forEach(function(bool){
        //         if(!bool) {
        //             newAssoc = false;
        //         }
        //     });
        // }
        getScore(assign);







        for(key in source) {
            if(sourcePos[key] < source[key].length) {
                finished = false;
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

associator({a:[1,2], b:[1, 2, 3, 4, 5, 6], c:[5, 6]}, [1, 2, 3, 4, 5, 6], 0, 2);