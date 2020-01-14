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
for(let c = 0; c <= 200; c++) {
    geneticAlgorithm.evolve(1).then((result) => {
        console.log('Evolution: '+ c);
        console.log(result.best()[0].score);
    });
}



