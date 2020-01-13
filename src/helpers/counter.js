/**
 * This function counts group members from given chromosome
 */
module.exports = (chromosome) => {

    // Cast chromosome to value array 
    // NOTICE: genetics framework does magic casting to objects...
    if(!Array.isArray(chromosome)) {
        chromosome = Object.values(chromosome);
    }

    var counts = {};
    for (var i = 0; i < chromosome.length; i++) {
        var num = chromosome[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}