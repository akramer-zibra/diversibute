/**
 * This function counts group members from given chromosome
 * @param {seq: Array} chromosome 
 */
module.exports = (chromosome) => {

    var counts = {};
    for (var i = 0; i < chromosome.seq.length; i++) {
        var num = chromosome.seq[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}