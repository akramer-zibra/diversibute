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
    population.push(seedFunc(keys, config.amountGroups));
}
console.log(population[0]);
console.log(population[1]);

// Test mutation
console.log('Mutation...');
console.log(mutationFunc(population[0]));

// Test Crossover
console.log('Crossover...');
console.log(population[0]);
console.log(population[1]);
console.log('+++');
console.log(crossoverFunc(population[0], population[1]));

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

// Start algorithm
for(let c = 0; c <= 20; c++) {
    geneticAlgorithm.evolve(10).then((result) => {
        console.log('Evolution: '+ c*10);
        console.log(result.best()[0].score);
    });
}
*/
