/**
 * This function checks if given chromosome is valid
 * 
 * @returns FALSE in case of failing and TRUE in case of validness
 */
module.exports = (chromosome) => {

    // Calculate elements
    var length = chromosome.length;

    // Calculate number of groups
    var groupAmount = Math.max(...chromosome);

    // Count group occurences
    var counts = {};
    for (var i = 0; i < chromosome.length; i++) {
        var num = chromosome[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    // 
    var groupSizes = Object.values(counts);
    var minSize = Math.min(...groupSizes);
    var maxSize = Math.max(...groupSizes);

    // 1. Check if min group size is 2
    if(minSize < 2) {
        return false;
    }

    // 2. Check if group size is still balanced
    if(maxSize - minSize > 1) {
        return false;
    }

    // ...else this chromosome is OK!
    return true;
}