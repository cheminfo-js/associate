'use strict';

module.exports = associate;

var combinate = require('./combinate.js')


/**
 * 
 * @type {Map}
 */

var DEBUG=0;


function associate(links, options) {

    var result={
        stat:{
            numberOperation:0,
            numberHits:0
        }
    };
    
    var options=options || {};
    var minTarget=options.minTarget || 0;
    var maxTarget=options.maxTarget || 2;
    var maxCounts=options.maxCounts;
    var sizeCounts=maxTarget-minTarget+1;
    if (options.maxCounts && options.maxCounts.length!==sizeCounts) {
        throw new Error('The maxCounts parameter must have exactly the length '+sizeCounts);
    }
    var scoreFunction=options.scoreFunction;
    var currentBestScore=0;

    var currentCounts=new Array(sizeCounts).fill(0);

    var sources=[];
    links.forEach(function(value, key) {
        console.log(key);
        sources.push(
            {
                key: key,
                possibleLinks: value,
                possibleTargets: combinate(value, minTarget, maxTarget),
                currentTargetPosition: 0,
                currentTotalTargetsAssigned: 0,
                currentTotalScore: 1
            }
        );
    });


    // console.log(JSON.stringify(sources,"   "));
    
    var targets = new Map();
    sources.map(function(source) {
        source.possibleLinks.map(function(targetID) {
            if (! targets.has(targetID)) {
                targets.set(targetID,{
                    isUsed: false
                });
            }
        });
    });
    var numberOfTargets=targets.size;
    
    
    console.log(targets);
    return;
    
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
            result.stat.numberOperation++;
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
                if (targetsNotAssigned(targets, source.possibleTargets[source.currentTargetPosition].targets)) {
                    source.currentTotalTargetsAssigned=(currentSource>0) ? sources[currentSource-1].currentTotalTargetsAssigned:0;
                    source.currentTotalTargetsAssigned+=source.possibleTargets[source.currentTargetPosition].targets.length;

                    // we could check if we used the quota
                    var targetLength=source.possibleTargets[source.currentTargetPosition].targets.length;
                    if (maxCounts && currentCounts[targetLength]>=maxCounts[targetLength]) {
                        badCandidate=true;
                    } else if ((source.currentTotalTargetsAssigned + (sources.length-currentSource-1) * maxTarget) < numberOfTargets) { // can we still assign all the targets ?
                        badCandidate=true;
                    } else {
                        // CALCULATE SCORE
                        if (scoreFunction) {
                            source.currentTotalScore=(currentSource>0) ? sources[currentSource-1].currentTotalScore:1;
                            var score=source.currentTotalScore*=source.possibleTargets[source.currentTargetPosition].score;
                            if (score<currentBestScore) {
                                badCandidate=true;
                            }
                        }
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
            result.stat.numberHits++;
            if (scoreFunction) {
                var score=sources[currentSource].currentTotalScore;
                if (score > currentBestScore) {
                    currentBestScore = score;
                }
                if (DEBUG>1) console.log("Current best score: "+currentBestScore);
            }
            if (DEBUG>1) debugCurrentTargets(sources, targets);
        }
    } while (limit-- > 0 && currentSource >= 0);

    function targetsNotAssigned(targets, array) {
        for (var id of array) {
            if (targets[id].isUsed) return false;
        }
        return true;
    }
    
    function unsetTargetAssignment() {
        var source=sources[currentSource];
        if (! source || ! source.possibleTargets[source.currentTargetPosition]) return;
        var currentTargets=source.possibleTargets[source.currentTargetPosition].targets;
        currentCounts[currentTargets.length]--;
        currentTargets.forEach(function(id) {
            if (DEBUG>4) console.log('unset: ',id);
            targets[id].isUsed=false;
        });
    }

    function setTargetAssignment() {
        var source=sources[currentSource];
        if (! source || ! source.possibleTargets[source.currentTargetPosition]) return;
        var currentTargets=source.possibleTargets[source.currentTargetPosition].targets;
        currentCounts[currentTargets.length]++;
        currentTargets.forEach(function(id) {
            if (DEBUG>4) console.log('set: ',id);
            targets[id].isUsed=true;
        });
    }
    
    function debugCurrentTargets(sources, targets) {
        console.log('----------- Source current association ----------')
        for (var i=0; i<sources.length; i++) {
            var source=sources[i];
            console.log(
                source.currentTargetPosition,
                source.possibleTargets[source.currentTargetPosition].targets,
                'Total targets assigned:'+source.currentTotalTargetsAssigned);
        }
        var usedTargets=[];
        for (var key in targets) {
            if (targets[key].isUsed) usedTargets.push(key);
        }
        console.log("Used targets: ", usedTargets);
        console.log("Current counts: ", currentCounts);
    }

    if (DEBUG>0) console.log("Number of operation", result.stat.numberOperation);
    if (DEBUG>0) console.log("Total: ", result.stat.numberHits)
    return result;

}




function getScore() {
    return 1;
}

