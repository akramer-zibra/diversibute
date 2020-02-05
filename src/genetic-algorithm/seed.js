const constraint = require('../constraints/chromosome');
const shuffle = require('../helpers/shuffle');

// Array Remove - By John Resig (MIT Licensed)
// @see https://stackoverflow.com/a/9815010
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/**
 * This function is a deprecated legacy seeding algorithm v1
 * @param {*} keys 
 * @param {*} groupAmount 
 */
var seedingV1 = (keys, groupAmount) => {

    // Configure constraint limits
    var minGroupSize = 2;
    var maxGroupSize = Math.ceil(keys.length / groupAmount);

    // Check if it is possible to create a reasonable seed with given combination
    // Minimum Group size is 2
    if(Math.floor(keys.length / groupAmount) < minGroupSize) {
        throw new Error('It is not possible to create a reasonable Chromosome seed with these given parameters: '+keys.length+' Items; '+groupAmount+' Groups');
    }

    // Initialize chromosome
    // NOTE: Chromosomes must be object, other structures cause problems with the ga framework
    var chromosome = {seq: []};

    // Initialize Group counter for constraint check
    counter = {};

    var pointer = 0;
    while(pointer < keys.length) {

        // Create random number between 1 and "groupAmount"
        randomGroupNr = Math.ceil(Math.random() * groupAmount);

        // Skip this selected group if it is already full
        if(counter[randomGroupNr] == undefined || counter[randomGroupNr] <= maxGroupSize) {

            // Assign a random groupNr to current pointed chromosome item
            chromosome.seq[pointer] = randomGroupNr;

            // Increase group counter
            counter[randomGroupNr] = counter[randomGroupNr] ? counter[randomGroupNr] + 1 : 1;

            // Move chromosome pointer
            pointer++;
        }

        // Do a constraint check when pointer reached final chromosome position
        if(pointer == (keys.length -1)) {

            // If constraint fails
            if(!constraint(chromosome, {groups: groupAmount})) {

                // ENHANCEMENT: This is not an efficient seeding algorthm for this kind of problem!
                // Reset this generation
                counter = {};    // Reset counter
                pointer = 0;     // and start at the chromosome beginning
            }
        }
    }

    // e.g.: {seq: [1, 1, 1, 3, 2, 2, 3, 3, 2, 2]}
    return chromosome; 
}

/**
 * This function creates one seed chromosome
 */
var seedFunc = (keys, groups, options = {minShuffle: 5, maxShuffle: 20}) => {

    // Configure constraint limits
    var minGroupSize = 2;
    var maxGroupSize = Math.ceil(keys.length / groups);

    // Check if it is possible to create a reasonable seed with given combination
    // Minimum Group size is 2
    if(Math.floor(keys.length / groups) < minGroupSize) {
        throw new Error('It is not possible to create a reasonable Chromosome seed with these given parameters: '+keys.length+' Items; '+groups+' Groups');
    }

    // Generate an equal distributed list of available group numbers
    // e.g. [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...]
    var elementSet = [];
    for(let idx = 0; idx < keys.length; idx++) {

        // idx % groups 
        // 0 % 5 = 0 -> 1
        // 1 % 5 = 1 -> 2
        // 2 % 5 = 2 -> 3
        // 3 % 5 = 3 -> 4
        // 4 % 5 = 4 -> 5
        // 5 % 5 = 0 -> 1
        // ...
        // 25 % 5 = 0 -> 1
        var groupNumber = (idx % groups) + 1;
        elementSet.push(groupNumber);
    }

    // Shuffle the equal distributed element set with a random number of loops
    // Math.floor(Math.random() * (max - min + 1)) + min;
    // @see https://stackoverflow.com/a/1527820
    var shuffleLoops = Math.floor(Math.random() * (options.maxShuffle - options.minShuffle + 1)) + options.minShuffle;
    for(let s = 0; s < shuffleLoops; s++) {
        shuffle(elementSet);
    }

    // Initialize result chromosome
    var chromosome = {seq: []};

    // Random number picking
    while(elementSet.length > 0) {

        // Pick a random group number
        // Math.floor(Math.random() * (max - min + 1)) + min;
        var randomGroupNumberPtr = Math.floor(Math.random() * ((elementSet.length - 1) - 0 + 1)) + 0;

        // Assign it to chromosom sequence
        chromosome.seq.push(elementSet[randomGroupNumberPtr]);

        // Remove picked group number from element set
        // and reindex the array
        elementSet.remove(randomGroupNumberPtr);   
    }

    // Return generated chromosome
    return chromosome;
}

/**
 * This function creates a population from given params
 */
var populationFunc = (keys, groups, amount = 100) => {

    // Generate a population set with given params
    var population = [];
    for(let n = 0; n < amount; n++) {
        population.push(seedFunc(keys, groups));
    }
    return population;
}

/**
 * This module function creates a chromosome seed
 * 
 * @param {Array<string>} keys Array collection with strings
 * @param {number} groups Number of groups
 * @param {*} options An indexed object with options parameters
 * @returns Array<{seq: Array}> A list with objects, which contain a list of groups ids in a seq-property
 */
module.exports = {
    seed: seedFunc,
    population: populationFunc
}