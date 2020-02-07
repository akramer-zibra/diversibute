// Start with an initial Inverion of Control container
const Bottle = require('bottlejs');
const di = new Bottle();

// Build genetic-algorithm functions
const ga = require('./src/genetic-algorithm')(di);

/**
 * This function searches for best combination by a bunch of random combinations
 * @param {data: {String: Number}, groups: Number} input 
 */
var monteCarloAlgorithm = (input) => {

    /* Validate input arguments */
    // Check necessary arguments
    if(input.data === undefined) {
        throw new Error("Given input arguments are not valid: 'data' is missing.");
    }
    if(input.groups === undefined) {
        throw new Error("Given input arguments are not valid: 'groups' is missing.");
    }
    // Check group argument plausibility
    if(input.groups < 1) {
        throw new Error("Error: Number of groups must be at least 1. Given: "+input.groups);
    }
    // Check given arguments distribution plausibility
    var keys = Object.keys(input.data);      // Get group member keys
    if(input.groups > keys.length) {
        throw new Error("Error: We can't distribute given numbers of members to a higher number of groups");
    }    

    return new Promise((resolve, reject) => {
        try {

            // Dependencies
            var fitnessModule = di.container.fitness;
            var seedModule = di.container.seed;

            // We need to pass input and options as context to fitness function
            fitnessModule.context(input.data, input.groups);

            // Create initial population with seed function
            // NOTICE: We use a population 10 times bigger than the given set of members
            var scores = [];
            var scoredPopulation = {};
            for(let n = 0; n < keys.length*10; n++) {

                // Create a seed
                var seed = seedModule.seed(keys, input.groups)
                
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
 * @deprecated
 * This function searches for best scored combination 
 * with a genetic algorithm 
 * @param {data: {String: Number}, groups: Number} input 
 * @param {String: any} settings
 * @return {combination: Array<number>, score: Number, options: {String: any}}
 */
var geneticAlgorithm = (input, settings = {}) => {

    throw new Error('deprecated');

    // Validate input arguments
    if(input.data === undefined) {
        throw new Error("Given input arguments are not valid: 'data' is missing.");
    }
    if(input.groups === undefined) {
        throw new Error("Given input arguments are not valid: 'groups' is missing.");
    }

    // Require genetic algorithm library
    const Genetics = require('@petsinho/geneticjs').Genetics;

    // Dependencies
    var fitnessModule = di.container.fitness;
    var seedModule = di.container.seed;
    var mutationFunction = di.container.mutation;
    var crossoverFunction = di.container.crossover;

    // Defaults
    var defaults = {
        populationStartSize: 40,
        populationMaxSize: 100,
        evolutions: 100
    }
    settings = Object.assign(defaults, settings);   // Use given options and merge with default values

    // Load keys from input data
    var keys = Object.keys(input.data);

    // We need to pass input and options as context to fitness function
    fitnessModule.context(input.data, input.groups);

    // Configure genetic algorithm
    var gaConfig = {
        mutationFunction: mutationFunction,
        crossoverFunction: crossoverFunction,
        fitnessFunction: fitnessModule.calc,
        // 
        population: seedModule.population(keys, input.groups, settings.populationStartSize),  // Create an initial population
        populationSize: settings.populationMaxSize, 	
        groupSize: input.groups
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

        return monteCarloAlgorithm(input);
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
     * @deprecated
     * This funtion is work in progress
     */
    kmeans: (data, groups) => {

        // Wrap data- and groups-input into one input group 
        var input = {data, groups};

        return kmeansAlgorithm(input);
    }
}
