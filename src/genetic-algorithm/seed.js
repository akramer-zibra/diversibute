const constraint = require('../constraints/chromosome');


/**
 * This module function creates a chromosome seed
 * 
 * @returns Array<{seq: Array}> A list with objects, which contain a list of groups ids in a seq-property
 */
module.exports = (keys, groupAmount) => {

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