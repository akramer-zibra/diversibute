const config = require('./config');
const Genetics = require('@petsinho/geneticjs').Genetics;

// Load genetic algorithm functions
const seedFunc = require('./src/genetic-algorithm/seed');
const fitnessFunc = require('./src/genetic-algorithm/fitness');
const mutationFunc = require('./src/genetic-algorithm/mutation');
const crossoverFunc = require('./src/genetic-algorithm/crossover');

/**
 * This function searches for best combination by a bunch of random combinations
 * @param {*} input 
 * @param {*} groups 
 */
var randomAlgorithm = (input, groups) => {

    // Get group member keys
    var keys = Object.keys(input);

    // Check constraints
    if(groups > keys.length) {
        throw new Error("Error: We can't distribute given numbers of members to a higher number of groups");
    }
    if(groups < 1) {
        throw new Error("Error: Number of groups must be at least 1. Given: "+groups);
    }

    // Create initial population with seed function
    // NOTICE: We use a population 10 times bigger than the given set of members
    var scores = [];
    var scoredPopulation = {};
    for(let n = 0; n < keys.length*10; n++) {

        // Create a seed
        var seed = seedFunc(keys, groups)
        
        // Calculate Score for each population
        var score = fitnessFunc(seed);
        
        // 
        scoredPopulation[score] = seed; // Use this as an index
        scores.push(score);
    }

    // Sort scores
    var ranking = scores.sort((a, b) => {
        return a-b;
    });

    // Use highest ranking fpr result
    var highestScore = ranking.pop();

    // Return result
    return {combination: scoredPopulation[highestScore].seq, score: highestScore};
};

/**
 * 
 * @param {*} input 
 * @param {*} groups 
 */
var geneticAlgorithm = (input, groups) => {

    throw new Error('TODO...');

    /*
    // Configure genetic algorithm
    var gaConfig = {
        mutationFunction: mutationFunc,
        crossoverFunction: crossoverFunc,
        fitnessFunction: fitnessFunc,
        population: population,
        populationSize: config.populationSize 	// defaults to 100
    }

    // Create a fresh algorithm object here
    const geneticAlgorithm = Genetics(gaConfig);
    console.log(geneticAlgorithm.scoredPopulation().slice(0,5));
    */

    /*
    // Start genetic algorithm
    for(let c = 0; c <= 56; c++) {
        geneticAlgorithm.evolve(10).then((result) => {
    //        console.log('Evolution: '+ c*10);
    //        console.log(result.best()[0].score);

            // Print final population in last round
            if(c == 10) {
                console.log(result.scoredPopulation().slice(0,5));
            }
        });
    }
    */

    // TODO
    return {combination: [], score: 0};
}

/**
 * Module definition of this kreatives-feld package
 */
module.exports = {
    /** This function creates groups from given input 
     * @param {{String: Array<Number>}} input 
     * @param {Number} groups Number of groups
     */
    random: (input, groups) => {
        return randomAlgorithm(input, groups);
    },
    genetic: (input, groups) => {
        return {combination: [], score: 0};
    }
}

// Test run
const input = require("./data")();      // Load input data
console.log(randomAlgorithm(input, 3));

/* Test competition run */
/*const fs = require('fs');
var scores = [];

// Do 1000 times a random seed batch generation with scoring
for(let i = 0; i < 1000; i++) {

    // We use 10times seed population size
    var popSize = keys.length * 10;

    // Generate pupulation
    var population = [];
    for(let n = 0; n < popSize; n++) {
        population.push(seedFunc(keys, config.amountGroups));
    }

    // Default ga config
    var gaConfig = {
        mutationFunction: mutationFunc,
        crossoverFunction: crossoverFunc,
        fitnessFunction: fitnessFunc,
        population: population,
        populationSize: config.populationSize 	// defaults to 100
    }

    const geneticAlgorithm = Genetics(gaConfig);

    scores.push(geneticAlgorithm.scoredPopulation()[0].score);
}

let data = JSON.stringify(scores);
fs.writeFileSync('./test/results/3feat-L-1000x/random.json', data);
*/


/*
console.log(population[0]);
console.log(population[1]);

// Test mutation
console.log('Mutation...');
var mutated = mutationFunc(population[0])
console.log(mutated);

// Test Crossover
console.log('Crossover...');
var crossed = crossoverFunc(population[0], population[1]);
console.log(crossed);

// Test fintess
console.log('Fitness...');
console.log(population[0]);
console.log(fitnessFunc(population[0]));
console.log(population[1]);
console.log(fitnessFunc(population[1]));
console.log(crossed[0]);
console.log(fitnessFunc(crossed[0]));
console.log(crossed[1]);
console.log(fitnessFunc(crossed[1]));
console.log(mutated);
console.log(fitnessFunc(mutated));
*/

/*
// Create initial population with seed function
var population = [];
for(let n = 0; n < config.initialSeeds; n++) {
    population.push(seedFunc(keys, config.amountGroups));
}
*/
