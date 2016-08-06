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
            results.push([]);
        } else {
            var indexes=new Array(i).fill(0);
            var position=0;
            do {
                while(position<(i-1)) {
                    position++;
                    indexes[position]=indexes[position-1]+1;
                }
                // we append the result
                results.push(indexes.map(function(index) {return array[index]}));
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
