/*
 * Internal member variables
 */
var di = undefined;

/**
 * This function runs the genetic algorithm with given arguments
 * @param {data: {String: Number}, groups: Number} input 
 * @param {String: any} settings
 * @return {combination: Array<number>, score: Number, options: {String: any}}
 */
var run = (input, settings = {}) => {

    // Check prerequisities
    if(di === undefined) {
        throw new Error("You need to run 'register' method first");
    }
    // Validate input arguments
    if(input.data === undefined) {
        throw new Error("Given input arguments are not valid: 'data' is missing.");
    }
    if(input.groups === undefined) {
        throw new Error("Given input arguments are not valid: 'groups' is missing.");
    }

    // Require genetic algorithm library
    const Genetics = require('@petsinho/geneticjs').Genetics;

    // Get dependencies
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

    // We need to pass input as context to fitness function
    fitnessModule.context(input);

    // Generate an initial population
    var population = seedModule.population(keys, input.groups, settings.populationStartSize)

    // Configure genetic algorithm
    var gaConfig = {
        mutationFunction: mutationFunction,
        crossoverFunction: crossoverFunction,
        fitnessFunction: fitnessModule.calc,
        // Customize with settings
        population: population,  // Create an initial population
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
 * Constructor method for this module
 * @param {Bottle} bottle BottleJS instance
 * @returns Genetic Algorithm object
 */
module.exports = (bottle) => {

    // Cache bottle instance
    di = bottle;

    // Load genetic algorithm functions
    bottle.constant('seed', require('./seed'));
    bottle.constant('fitness', require('./fitness'));
    bottle.constant('mutation', require('./mutation'));
    bottle.constant('crossover', require('./crossover'));

    // Put reference to this module in di container
    bottle.constant('ga', module.exports);

    return {
        run
    }
}