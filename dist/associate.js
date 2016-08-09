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

	var simpleClustering=__webpack_require__(2);


	var associate=__webpack_require__(3);
	var createHierarchy=__webpack_require__(5);

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
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
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

	/**
	 * Created by acastillo on 8/8/16.
	 */

	// should use directly from the web : https://github.com/mljs/simple-clustering/blob/6ac43e180024e1efc6a5edfdace6a53d06513afd/src/index.js



	'use strict';

	const defOptions = {
	    threshold:0,
	    out:"assignment"
	};
	//TODO Consider a matrix of distances too
	module.exports = function fullClusterGenerator(conMat, opt) {
	    const options = Object.assign({}, defOptions, opt);
	    var clList, i, j, k;
	    if(typeof conMat[0] === "number"){
	        clList = fullClusterGeneratorVector(conMat);
	    }
	    else{
	        if(typeof conMat[0] === "object"){
	            var nRows = conMat.length;
	            var conn = new Array(nRows*(nRows+1)/2);
	            var index = 0;
	            for(var i=0;i<nRows;i++){
	                for(var j=i;j<nRows;j++){
	                    if(conMat[i][j]>options.threshold)
	                        conn[index++]= 1;
	                    else
	                        conn[index++]= 0;
	                }
	            }
	            clList = fullClusterGeneratorVector(conn);
	        }
	    }
	    if (options.out === "indexes" || options.out === "values") {
	        var result = new Array(clList.length);
	        for(i=0;i<clList.length;i++){
	            result[i] = [];
	            for(j=0;j<clList[i].length;j++){
	                if(clList[i][j] != 0){
	                    result[i].push(j);
	                }
	            }
	        }
	        if (options.out === "values") {
	            var resultAsMatrix = new Array(result.length);
	            for (i = 0; i<result.length;i++){
	                resultAsMatrix[i]=new Array(result[i].length);
	                for(j = 0; j < result[i].length; j++){
	                    resultAsMatrix[i][j]=new Array(result[i].length);
	                    for(k = 0; k < result[i].length; k++){
	                        resultAsMatrix[i][j][k]=conMat[result[i][j]][result[i][k]];
	                    }
	                }
	            }
	            return resultAsMatrix;
	        }
	        else{
	            return result;
	        }
	    }

	    return clList;

	}

	function fullClusterGeneratorVector(conn){
	    var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
	    var clusterList = [];
	    var available = new Array(nRows);
	    var remaining = nRows, i=0;
	    var cluster = [];
	    //Mark all the elements as available
	    for(i=nRows-1;i>=0;i--){
	        available[i]=1;
	    }
	    var nextAv=-1;
	    var toInclude = [];
	    while(remaining>0){
	        if(toInclude.length===0){
	            //If there is no more elements to include. Start a new cluster
	            cluster = new Array(nRows);
	            for(i = 0;i < nRows ;i++)
	                cluster[i]=0;
	            clusterList.push(cluster);
	            for(nextAv = 0;available[nextAv]==0;nextAv++){};
	        }
	        else{
	            nextAv=toInclude.splice(0,1);
	        }
	        cluster[nextAv]=1;
	        available[nextAv]=0;
	        remaining--;
	        //Copy the next available row
	        var row = new Array(nRows);
	        for( i = 0;i < nRows;i++){
	            var c=Math.max(nextAv,i);
	            var r=Math.min(nextAv,i);
	            //The element in the conn matrix
	            //console.log("index: "+r*(2*nRows-r-1)/2+c)
	            row[i]=conn[r*(2*nRows-r-1)/2+c];
	            //There is new elements to include in this row?
	            //Then, include it to the current cluster
	            if(row[i]==1&&available[i]==1&&cluster[i]==0){
	                toInclude.push(i);
	                cluster[i]=1;
	            }
	        }
	    }
	    return clusterList;
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function createHierarchy(matrix) {
	    var results={};
	    for (var i=0; i<matrix.length; i++) {
	        for (var j=0; j<matrix[0].length; j++) {
	            if (matrix[i][j]>0) {
	                var row=(matrix[i][j] >> 16) - 1;
	                var column=(matrix[i][j] & 0b1111111111111111) - 1;
	                if (! results[row]) {
	                    results[row]=[];
	                }
	                results[row].push(column);
	            }
	        }
	    }
	    return results;
	}

/***/ }
/******/ ])
});
;