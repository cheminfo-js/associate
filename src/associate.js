'use strict';

module.exports = associate;

var combinate = require('./util/combinate.js')


/**
 * @param source = {a:[], b:[], c:[], ...}
 * @param target = [1,2,3,4,5,6]
 * @param maxTarget integer of max association
 * @param minTarget integer of min association
 * @returns {*} return the top 3 best association
 */

var DEBUG=0;


function associate(links, dataSources, dataTargets, options) {
    if (!dataTargets) options=dataSources;
    
    var options=options || {};
    var minTarget=options.minTarget || 0;
    var maxTarget=options.maxTarget || 2;
    var maxCounts=options.maxCounts;
    var sizeCounts=maxTarget-minTarget+1;
    if (options.maxCounts && options.maxCounts.length!==sizeCounts) {
        throw new Error('The maxCounts parameter must have exactly the length '+sizeCounts);
    }
    var scoreFunction=options.scoreFunction;

    var result={
        stat:{
            numberOperation:0,
            numberHits:0
        }
    };
    
    var currentBestScore=0;
    var currentAssociation;
    var currentCounts=new Array(sizeCounts).fill(0);
    var sources=[];
    
    for (var key in links) {
        sources.push(
            {
                id: key,
                possibleLinks: links[key],
                possibleTargets: combinate(links[key], minTarget, maxTarget),
                currentTargetPosition: 0,
                currentTotalTargetsAssigned: 0,
                currentTotalScore: 1
            }
        );
    }

    // we will calculate the scores for each targets
    if (scoreFunction) {
        if (DEBUG>1) console.log("Calculating scores");
        sources.forEach(function(source) {
            source.possibleTargets.forEach(function(target) {
                var s = (dataSources!==undefined) ? dataSources[source.id] : source.id;
                var t = target.targets.map(function(target) {
                    return dataTargets ? dataTargets[target] : target;
                });
                target.score = scoreFunction(s, t);
            });
            source.possibleTargets.sort((a,b) => b.score-a.score);
        });
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
                    // it is not because all the targets are assigned that the problem is finished !
                    // only if the minTarget>0
                    // TODO and optimize : if (minTarget>0) 
                    badCandidate=true;
                }
                if (! badCandidate) {
                    setTargetAssignment(sources, targets, currentSource);
                }
            }
            // console.log('badCandidate: '+badCandidate, 'goingBack: '+goingBack, currentSource);
        } while ((badCandidate || goingBack) && currentSource>=0);
        
        if (! badCandidate && currentSource === (sources.length-1)) {
            // we have a candidate !
            result.stat.numberHits++;
            if (scoreFunction) {
                var score=sources[currentSource].currentTotalScore;
                if (score > currentBestScore) {
                    currentBestScore = score;
                    currentAssociation = {};
                    sources.forEach(function(source) {
                        currentAssociation[source.id]=source.possibleTargets[source.currentTargetPosition];
                    })
                }
                if (DEBUG>1) console.log("Current best score: "+currentBestScore);
            }
            if (DEBUG>1) debugCurrentTargets(sources, targets);
        }
    } while (limit-- > 0 && currentSource >= 0);
    result.stat.score=currentBestScore;
    result.best=currentAssociation;

    if (DEBUG>0) console.log("Number of operation", result.stat.numberOperation);
    if (DEBUG>0) console.log("Total: ", result.stat.numberHits);
    
    return result;
    
    
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
}



