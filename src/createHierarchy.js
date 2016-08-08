module.exports = function createHierarchy(matrix, sources, targets) {
    var results=new Map();
    for (var i=0; i<matrix.length; i++) {
        for (var j=0; j<matrix[0].length; j++) {
            if (matrix[i][j]>0) {
                var row=(matrix[i][j] >> 16) - 1;
                var column=(matrix[i][j] & 0b1111111111111111) - 1;
                if (! results.has(sources[row])) {
                    results.set(sources[row],[]);
                }
                results.get(sources[row]).push(targets[column]);
            }
        }
    }
    return results;
}