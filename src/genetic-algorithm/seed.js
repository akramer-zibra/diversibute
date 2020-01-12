/**
 * This module function creates a chromosome seed
 * 
 * @returns A list. Values are Group-IDs and keys are index of given keys
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
    var chromosome = [];

    // Initialize Group counter for constraint check
    counter = initGroupCounter(groupAmount);

    var pointer = 0;
    while(pointer < keys.length) {

        // Create random number
        randomGroupNr = Math.ceil(Math.random() * groupAmount);

        // Skip this selected group if it is already full
        if(counter[randomGroupNr] <= maxGroupSize) {

            // Assign a random groupNr to current pointed chromosome item
            chromosome[pointer] = randomGroupNr;

            // Increase group counter
            counter[randomGroupNr]++;

            // Move chromosome pointer
            pointer++;
        }

        // Do a constraint check in final round
        if(pointer == (keys.length -1)) {

            // Check if there aren't groups with just one member
            Object.keys(counter).forEach((groupNr) => {
                if(counter[groupNr] < minGroupSize) {
                    // Resize group counter
                    counter = initGroupCounter(groupAmount);

                    // and start at the chromosome beginning
                    pointer = 0;
                }
            });
        }
    }

    // e.g.: [1, 1, 1, 3, 2, 2, 3, 3, 2, 2]
    return chromosome; 
}

/**
 * This function initializes a fresh indexed group counter
 */
var initGroupCounter = (groupAmount) => {
    var counter = {};
    for(let groupNr = 1; groupNr <= groupAmount; groupNr++) {
        counter[groupNr] = 0;
    }
    return counter;
}