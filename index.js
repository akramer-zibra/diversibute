const config = require('./config');
const Genetics = require('@petsinho/geneticjs').Genetics;

// Load genetic algorithm functions
const seedFunc = require('./src/genetic-algorithm/seed');
const fitnessFunc = require('./src/genetic-algorithm/fitness');
const mutationFunc = require('./src/genetic-algorithm/mutation');
const crossoverFunc = require('./src/genetic-algorithm/crossover');

// Load input data
const input = require("./input.json");

// Get group member keys
var keys = Object.keys(input);

// Create initial population with seed function
var population = [];
for(let n = 0; n < config.initialSeeds; n++) {
    population.push(seedFunc(keys, 3));
}
//console.log(population[0])

/*
// Test mutation method
var mutated = mutationFunc(population[0]);
console.log(mutated);

// Calculate fitness score
var fitness = fitnessFunc(mutated);
console.log(fitness);

// Create a crossover
var crossover = crossoverFunc(population[0], population[1]);
console.log(crossover);
*/

// Use genetic algorithm object here 
// with custom configuration
const geneticAlgorithm = Genetics({
    mutationFunction: mutationFunc,
    crossoverFunction: crossoverFunc,
    fitnessFunction: fitnessFunc,
//    doesABeatBFunction: yourCompetitionFunction,
    population: population,
    populationSize: config.initialPopulationSize 	// defaults to 100
});

var result = await geneticAlgorithm.evolve(100).best();

// Evolve results
console.log(geneticAlgorithm.best());
