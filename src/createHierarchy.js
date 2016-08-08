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