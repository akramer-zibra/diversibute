var Combinatorics = require('js-combinatorics');
var distance = require('euclidean-distance');

// Load input data
const input = require("./input.json");

// Confguration
const POCKET_NR = 3;


// Initialize chromosome with k groups 
chromosome = [];
for(let k = 0; k < POCKET_NR; k++) {
    chromosome.push([]);
}

// Get element keys
var keys = Object.keys(input);

// TODO: randomize array elements

// Seperate keys into k groups
var i = 0;
while(i < keys.length) {

    // Calculate chromosome pocket
    var pocket = (i % POCKET_NR);

    chromosome[pocket].push(keys[i]);

    // Increase counter
    i++;
}

// Calculate combinations of the pocket elements
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

    console.log(dSum);
});

