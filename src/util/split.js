
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