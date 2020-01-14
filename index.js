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

// Configure  
var gaConfig = {
    mutationFunction: mutationFunc,
    crossoverFunction: crossoverFunc,
    fitnessFunction: fitnessFunc,
    population: population,
    populationSize: config.initialPopulationSize 	// defaults to 100
}

// Use genetic algorithm object here 
const geneticAlgorithm = Genetics(gaConfig);
console.log(geneticAlgorithm.scoredPopulation());

// Use algorithm
geneticAlgorithm.evolve(250).then((result) => {

    console.log(geneticAlgorithm.scoredPopulation());

    console.log(result.best());
});


