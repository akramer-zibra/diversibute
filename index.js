// Load genetic algorithm functions
const seedFunc = require('./src/genetic-algorithm/seed');
const fitnessFunc = require('./src/genetic-algorithm/fitness');

// Load input data
const input = require("./input.json");

// Get element keys
var keys = Object.keys(input);

// Create an initial seed chromosome
var chromosome = seedFunc(keys, 3);

console.log(chromosome);

// Calculate fitness of this given chromosome
var fitnessScore = fitnessFunc(chromosome, input);
console.log(fitnessScore);

/*
// Shuffle array elements for randomization
keys = shuffle(keys);

// Seperate keys into k groups
var k = 3;
var chromosome = distribute(k, keys);

// Calculate combinations of the pocket elements and their internal distances
internalPocketDistances = distances(input, chromosome);

// Calculate a linear regression func 
regression(internalPocketDistances);
*/