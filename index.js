// Start with an initial Inverion of Control container
const Bottle = require('bottlejs');
const di = new Bottle();

// Build genetic-algorithm module
const ga = require('./src/genetic-algorithm')(di);

// Build montecarlo algorithm module
const mc = require('./src/monte-carlo')(di);

/**
 * This function uses kmeans algorithm to generate heterogenous groups
 * @param {data: {String: Number}, groups: Number} input 
 */
var kmeansAlgorithm = (input) => {
    
    // k-means does not care about same size groups
    // There is one approach to post process k-means clusters and
    // Push elements from oversized clusters to underfilled clusters...
    // @see https://stackoverflow.com/questions/8796682/group-n-points-in-k-clusters-of-equal-size
    throw new Error('This is not running well yet!');

    /* eslint-disable no-unreachable */

    // Require library package
    // @see https://www.npmjs.com/package/skmeans
    var skmeans = require("skmeans");

    // Search for clusters for the number of groupmembers
    var clusters = Math.floor(Object.keys(input).length / groups);

    // Use skmeans to calculate clusters
//    var data = [1,12,13,4,25,21,22,3,14,5,11,2,23,24,15];
    var data = Object.values(input);
    var result = skmeans(data, clusters, "kmpp");

    // 
    var sequence = result.idxs.map(i => i+1);    // NOTICE: this algorithm starts with 0 first, not with smallest number 1

    // Construct fitness module 
    // We need to pass input and options as context to fitness function
    fitnessModule.context(input, groups);

    // Calculate fitness score
    var score = fitnessModule.calc({seq: sequence});

    // 
    return {combination: sequence, score: score};

    /* eslint-enable no-unreachable */
}

/**
 * Module definition of this kreatives-feld package
 */
module.exports = {
    /** 
     * This function creates groups from given input
     * with a simple monte carlo algorithm
     * @param {{String: Array<Number>}} data 
     * @param {Number} groups Number of groups
     * @returns {Promise<{combination: Array<Number>, score: Number}>}
     */
    monteCarlo: (data, groups) => {

        // Wrap data- and groups-input into one input group 
        var input = {data, groups};

        // Run monte-carlo algorithm
        return mc.run(input);
    },
    /**
     * This function creates a group combination from given input
     * and returns combination with its fitness score
     * @param {{String: Array<Number>}} input
     * @param {Number} groups Number of groups
     * @param {String: any} settings Object with option properties 
     * @returns {Promise<{combination: Array<Number>, score: Number}>}
     */
    genetic: (data, groups, settings = {}) => {

        // Wrap data- and groups-input into one input object
        var input = {data, groups};

        // Run algorithm with arguments
        return ga.run(input, settings);
    },
    /**
     * @bleedingendge
     * This funtion is work in progress
     */
    kmeans: (data, groups) => {

        // Wrap data- and groups-input into one input group 
        var input = {data, groups};

        return kmeansAlgorithm(input);
    }
}
