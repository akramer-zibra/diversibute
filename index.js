const Genetics = require('@petsinho/geneticjs').Genetics;

// Load genetic algorithm functions
const seedFunc = require('./src/genetic-algorithm/seed');
const fitnessModule = require('./src/genetic-algorithm/fitness');
const mutationFunc = require('./src/genetic-algorithm/mutation');
const crossoverFunc = require('./src/genetic-algorithm/crossover');

/**
 * This function searches for best combination by a bunch of random combinations
 * @param {*} input 
 * @param {*} groups 
 */
var monteCarloAlgorithm = (input, groups) => {

    // Get group member keys
    var keys = Object.keys(input);

    // Check constraints
    if(groups > keys.length) {
        throw new Error("Error: We can't distribute given numbers of members to a higher number of groups");
    }
    if(groups < 1) {
        throw new Error("Error: Number of groups must be at least 1. Given: "+groups);
    }

    return new Promise((resolve, reject) => {
        try {

            // We need to pass input and options as context to fitness function
            fitnessModule.context(input, groups);

            // Create initial population with seed function
            // NOTICE: We use a population 10 times bigger than the given set of members
            var scores = [];
            var scoredPopulation = {};
            for(let n = 0; n < keys.length*10; n++) {

                // Create a seed
                var seed = seedFunc(keys, groups)
                
                // Calculate Score for each population
                var score = fitnessModule.calc(seed);
                
                // 
                scoredPopulation[score] = seed; // Use this as an index
                scores.push(score);
            }

            // Sort scores
            var ranking = scores.sort((a, b) => {return a-b;});

            // Use highest ranking fpr result
            var highestScore = ranking.pop();

            // Return result
            resolve({combination: scoredPopulation[highestScore].seq, score: highestScore});

        } catch(err) {
            reject(err);
        }
    });
};

/**
 * This function searches for best scored combination 
 * with a genetic algorithm
 * @param {{String: Array<Number>}} input 
 * @param {Number} groups 
 * @param {String: any} settings
 * @return {combination: Array<number>, score: Number, options: {String: any}}
 */
var geneticAlgorithm = (input, groups, settings = {}) => {

    // Defaults
    var defaults = {
        populationStartSize: 40,
        populationMaxSize: 100,
        evolutions: 100
    }

    // Use given options and merge with default values
    settings = Object.assign(defaults, settings);

    // Load keys from input data
    var keys = Object.keys(input);

    // Create an initial population
    var population = [];
    for(let n = 0; n < settings.populationStartSize; n++) {
        population.push(seedFunc(keys, groups));
    }

    // We need to pass input and options as context to fitness function
    fitnessModule.context(input, groups);

    // Configure genetic algorithm
    var gaConfig = {
        mutationFunction: mutationFunc,
        crossoverFunction: crossoverFunc,
        fitnessFunction: fitnessModule.calc,
        population: population,
        populationSize: settings.populationMaxSize, 	// defaults to 100
        groupSize: groups
    }

    // Create a fresh algorithm object here
    const geneticAlgorithm = Genetics(gaConfig);

    // Genetic evolution is async!
    return new Promise((resolve, reject) => {

        // Use genetic algorithm 
        geneticAlgorithm.evolve(settings.evolutions).then((result) => {
            // Resolve winning chromosome with its score
            var winner = result.scoredPopulation()[0];
            resolve({
                combination: winner.phenotype.seq, 
                score: winner.score,
                settings});
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * This function uses kmeans algorithm to generate heterogenous groups
 * @param {{String: Array<Number>}} input 
 * @param {Number} groups 
 */
var kmeansAlgorithm = (input, groups) => {
    
    // k-means does not care about same size groups
    // There is one approach to post process k-means clusters and
    // Push elements from oversized clusters to underfilled clusters...
    // @see https://stackoverflow.com/questions/8796682/group-n-points-in-k-clusters-of-equal-size
    throw new Error('This is not running well yet!');

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
}

/**
 * Module definition of this kreatives-feld package
 */
module.exports = {
    /** 
     * This function creates groups from given input
     * with a simple monte carlo algorithm
     * @param {{String: Array<Number>}} input 
     * @param {Number} groups Number of groups
     * @returns {Promise<{combination: Array<Number>, score: Number}>}
     */
    monteCarlo: (input, groups) => {
        return monteCarloAlgorithm(input, groups);
    },
    /**
     * This function creates a group combination from given input
     * and returns combination with its fitness score
     * @param {{String: Array<Number>}} input
     * @param {Number} groups Number of groups
     * @param {String: any} settings Object with option properties 
     * @returns {Promise<{combination: Array<Number>, score: Number}>}
     */
    genetic: (input, groups, settings = {}) => {
        return geneticAlgorithm(input, groups, settings);
    },
    /**
     * This funtion is work in progress
     */
    kmeans: (input, groups) => {
        return kmeansAlgorithm(input, groups);
    }
}
