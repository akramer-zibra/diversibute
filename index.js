// Load helpers
const shuffle = require('./src/helpers/shuffle');
const distribute = require('./src/helpers/distribute');
const distances = require('./src/helpers/distances');
const regression = require('./src/helpers/regression');

// Load input data
const input = require("./input.json");

// Get element keys
var keys = Object.keys(input);

// Shuffle array elements for randomization
keys = shuffle(keys);

// Seperate keys into k groups
var k = 3;
var chromosome = distribute(k, keys);

// Calculate combinations of the pocket elements and their internal distances
internalPocketDistances = distances(input, chromosome);

// Calculate a linear regression func 
regression(internalPocketDistances);