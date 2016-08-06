'use strict';

module.exports = associator;

var combinate = require('./combinate.js')


/**
 * @param source = {a:[], b:[], c:[], ...}
 * @param target = [1,2,3,4,5,6]
 * @param maxTarget integer of max association
 * @param minTarget integer of min association
 * @returns {*} return the top 3 best association
 */

var DEBUG=true;


function associator(links, options) {
    var options=options || {};
    var minTarget=options.minTarget || 0;
    var maxTarget=options.maxTarget || 2;
    
    
    var sources=[];
    for (var key in links) {
        sources.push(
            {
                sourceID: key,
                possibleTargets: combinate(links[key], minTarget, maxTarget),
                currentTargetPosition: 0,
                currentTotalTargetsAssigned: new Array(sources.length),
                currentTotalScore:  new Array(sources.length)
            }
        );
    }
    
    console.log(JSON.stringify(sources,"   "));
    
    var targets = {};
    sources.map(function(source) {
        source.possibleTargets.map(function(targetID) {
            if (! targets[targetID]) {
                targets[targetID]={
                    isUsed: false
                };
            }
        });
    });
    

    
    var currentSource=0;
    var currentTotalAssignedTargets=0;
    
    var limit=50;
    var counter=0;
    while (limit-- > 0 && currentSource>=0) {
        // can we for the current source that we are evaluating still add a child ?
        while(currentSource<(sources.length-1)) {
            currentSource++;
            sources[currentSource].currentTargetPosition=0;
        }
        // we should now deal with this possibility ...
        //if (DEBUG) debugCurrentTargets(sources);

        // currentTotalTargetsAssigned: new Array(sources.length),
        // currentTotalScore:  new Array(sources.length)

        counter++;
        // need to increment the position and go back if we reach the end
        do {
            sources[currentSource].currentTargetPosition++;
        } while (
            sources[currentSource].currentTargetPosition===sources[currentSource].possibleTargets.length &&
                --currentSource>=0
            )
    }
    
    console.log("Total: ",counter)
    
    function debugCurrentTargets(sources) {
        console.log('----------- Source current association ----------')
        for (var i=0; i<sources.length; i++) {
            var source=sources[i];
            console.log(source.currentTargetPosition, source.possibleTargets[source.currentTargetPosition]);
        }
    }

    
    return;
    

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

