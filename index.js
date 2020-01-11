var Combinatorics = require('js-combinatorics');
var distance = require('euclidean-distance');

// Load helpers
const shuffle = require('./src/helpers/shuffle');
const distribute = require('./src/helpers/distribute');

// Load input data
const input = require("./input.json");

// Confguration
const POCKET_NR = 3;

// Get element keys
var keys = Object.keys(input);

// Shuffle array elements for randomization
keys = shuffle(keys);

// Seperate keys into k groups
var chromosome = distribute(POCKET_NR, keys);

// Calculate combinations of the pocket elements
var internalPocketDistances = [];
chromosome.forEach((pocket) => {

    console.log(pocket);
    console.log('------------');

    // Initialize empty combination result array
    var combinations = [];

    var cmb = Combinatorics.combination(pocket, 2);
    while(a = cmb.next()) combinations.push(a);

    // Sum up euclidean distance
    var dSum = 0.0;

    combinations.forEach(combination => {

        // Calculate euclidean distance
        dSum += distance(input[combination[0]], input[combination[1]]);
    });

    internalPocketDistances.push(dSum);
    console.log(dSum);
});
console.log(internalPocketDistances);

// Calculate the average of the internal pocket distances
var internalDistanceSum = internalPocketDistances.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;  
}, 0.0);
var internalDistanceAverage = internalDistanceSum / internalPocketDistances.length;

console.log(internalDistanceAverage);
