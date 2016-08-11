(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["associate"] = factory();
	else
		root["associate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	module.exports = {
	    process: process
	};

	var split=__webpack_require__(2);


	var associate=__webpack_require__(3);


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



	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        return setTimeout(fun, 0);
	    } else {
	        return cachedSetTimeout.call(null, fun, 0);
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        clearTimeout(marker);
	    } else {
	        cachedClearTimeout.call(null, marker);
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	module.exports = function split(originalSources) {

	    var targetToSources=new Map();
	    // we create an inverted graph
	    for (var key in originalSources) {
	        originalSources[key].forEach(function(target) {
	            if (! targetToSources.has(target)) {
	                targetToSources.set(target, []);
	            }
	            targetToSources.get(target).push(key);
	        })
	    }

	    var trees=[];
	    var queue=[];
	    var queuePointer=0;
	    // console.log('targetsToSource', targetToSources);

	    while (targetToSources.size>0) {
	        var tree={};
	        trees.push(tree);
	        queue.push(targetToSources.keys().next().value);
	        do {
	            var currentTarget=queue[queuePointer++];
	            // console.log('Queue', queue, queuePointer);
	            // console.log('Current target', currentTarget);
	            var currentSources=targetToSources.get(currentTarget);
	            targetToSources.delete(currentTarget);
	            currentSources.forEach(function(source) {
	                tree[source]=originalSources[source];
	                originalSources[source].forEach(function(target) {
	                    if (targetToSources.has(target)) {
	                        // add to queue
	                        if (queue.indexOf(target)===-1) {
	                            queue.push(target);
	                        }
	                    }
	                });
	            });

	        } while (queue.length>queuePointer)
	    }
	    
	    return trees;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = associate;

	var combinate = __webpack_require__(4)


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





/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * This method will create all possible combination starting from an array of values
	 * Having between min and max elements
	 * @param array
	 * @param min
	 * @param max
	 */

	module.exports=function(array, min, max) {
	    var results=[];
	    for (var i=min; i<=Math.min(max, array.length); i++) {
	        if (i===0) {
	            results.push({targets:[], score: 1});
	        } else {
	            var indexes=new Array(i).fill(0);
	            var position=0;
	            do {
	                while(position<(i-1)) {
	                    position++;
	                    indexes[position]=indexes[position-1]+1;
	                }
	                // we append the result
	                results.push({targets: indexes.map(function(index) {return array[index]}), score: 1});
	                // we increment the current position and go back in case we reached the maximum
	                do {
	                    indexes[position]++;
	                    if (indexes[position]!==(array.length-i+position+1)) break; // didn't reach maximum
	                    position--;
	                } while (position>=0);
	            } while (position>=0);
	        }
	    }
	    return results;
	};


/***/ }
/******/ ])
});
;