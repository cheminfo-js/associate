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

var DEBUG=0;


function associator(links, options) {

    var result={
        stat:{
            numberOperation:0,
            numberHits:0
        }};
    

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
            result.stat.numberHits++;
            if (DEBUG>1) debugCurrentTargets(sources, targets);
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
            if (DEBUG>4) console.log('unset: ',id);
            targets[id].isUsed=false;
        });
    }

    function setTargetAssignment(sources, targets, currentSource) {
        var source=sources[currentSource];
        if (! source || ! source.possibleTargets[source.currentTargetPosition]) return;
        source.possibleTargets[source.currentTargetPosition].forEach(function(id) {
            if (DEBUG>4) console.log('set: ',id);
            targets[id].isUsed=true;
        });
    }
    
    function debugCurrentTargets(sources, targets) {
        if (DEBUG>2) console.log('----------- Source current association ----------')
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
        if (DEBUG>1) console.log("Used targets: ", usedTargets);
    }

    if (DEBUG>0) console.log("Number of operation", numberOperation);
    if (DEBUG>0) console.log("Total: ",counter)
    return result;

}




function getScore() {
    return 1;
}

