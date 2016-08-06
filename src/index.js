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

var DEBUG=false;
var numberOperation=0;

function associator(links, options) {

    

    var options=options || {};
    var minTarget=options.minTarget || 0;
    var maxTarget=options.maxTarget || 2;
    
    
    
    var sources=[];
    for (var key in links) {
        sources.push(
            {
                sourceID: key,
                possibleLinks: links[key],
                possibleTargets: combinate(links[key], minTarget, maxTarget),
                currentTargetPosition: 0,
                currentTotalTargetsAssigned: 0,
                currentTotalScore: 1
            }
        );
    }
    
    // console.log(JSON.stringify(sources,"   "));
    
    var targets = {};
    sources.map(function(source) {
        source.possibleLinks.map(function(targetID) {
            if (! targets[targetID]) {
                targets[targetID]={
                    isUsed: false
                };
            }
        });
    });
    var numberOfTargets=Object.keys(targets).length;
    
    var currentSource=-1;
    
    var limit=5000000;
    var counter=0;
    do {
        if (currentSource < (sources.length-1)) {
            currentSource++;
            sources[currentSource].currentTargetPosition=-1;
        }

        var badCandidate=false;
        do {
            numberOperation++;
            var goingBack=false;
            // before changing anything we need to unset targets assignment;
            if (! badCandidate) unsetTargetAssignment(sources, targets, currentSource);
            badCandidate=false;
            sources[currentSource].currentTargetPosition++;
            // need to recalculate the information for this new hypothesis
            if (sources[currentSource].currentTargetPosition===sources[currentSource].possibleTargets.length) {
                // we tried all the possibilities, we need to go back
                currentSource--;
                goingBack=true;
            } else {
                var source=sources[currentSource];
                if (targetsNotAssigned(targets, source.possibleTargets[source.currentTargetPosition])) {
                    
                    
                    source.currentTotalTargetsAssigned=(currentSource>0) ? sources[currentSource-1].currentTotalTargetsAssigned:0;
                    source.currentTotalTargetsAssigned+=source.possibleTargets[source.currentTargetPosition].length;

                 //   console.log(currentSource, source.currentTotalTargetsAssigned, (sources.length-currentSource) * maxTarget, numberOfTargets)
                    
                    if ((source.currentTotalTargetsAssigned + (sources.length-currentSource-1) * maxTarget) < numberOfTargets) { // can we still assign all the targets ?
                 //       console.log("Don't check");
                        badCandidate=true;
                    } else {
                        // CALCULATE SCORE
                        source.currentTotalScore=(currentSource>0) ? sources[currentSource-1].currentTotalScore:1;
                        source.currentTotalScore*=0.9;
                        
                        // we could still specify it is a bad candidate based on the score for example
                        badCandidate=false;
                    }
                } else {
                    badCandidate=true;
                }
                if (! badCandidate) {
                    setTargetAssignment(sources, targets, currentSource);
                }
            }
            // console.log('badCandidate: '+badCandidate, 'goingBack: '+goingBack, currentSource);
        } while ((badCandidate || goingBack) && currentSource>=0);


        if (!badCandidate && currentSource === (sources.length-1)) {
            // we have a candidate !
            counter++;
            if (DEBUG) debugCurrentTargets(sources, targets);
        }
    } while (limit-- > 0 && currentSource >= 0);

    function targetsNotAssigned(targets, array) {
        for (var id of array) {
            if (targets[id].isUsed) return false;
        }
        return true;
    }
    
    function unsetTargetAssignment(sources, targets, currentSource) {
        var source=sources[currentSource];
        if (! source || ! source.possibleTargets[source.currentTargetPosition]) return;
        source.possibleTargets[source.currentTargetPosition].forEach(function(id) {
            if (DEBUG) console.log('unset: ',id);
            targets[id].isUsed=false;
        });
    }

    function setTargetAssignment(sources, targets, currentSource) {
        var source=sources[currentSource];
        if (! source || ! source.possibleTargets[source.currentTargetPosition]) return;
        source.possibleTargets[source.currentTargetPosition].forEach(function(id) {
            if (DEBUG) console.log('set: ',id);
            targets[id].isUsed=true;
        });
    }
    
    function debugCurrentTargets(sources, targets) {
        console.log('----------- Source current association ----------')
        for (var i=0; i<sources.length; i++) {
            var source=sources[i];
            console.log(
                source.currentTargetPosition,
                source.possibleTargets[source.currentTargetPosition],
                'Total targets assigned:'+source.currentTotalTargetsAssigned);
        }
        var usedTargets=[];
        for (var key in targets) {
            if (targets[key].isUsed) usedTargets.push(key);
        }
        console.log("Used targets: ", usedTargets);
    }

    console.log("Number of operation", numberOperation);
    console.log("Total: ",counter)
    return counter;
    

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
    return 1;
}

