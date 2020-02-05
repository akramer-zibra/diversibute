const shuffle = require('../helpers/shuffle');

// Possible mutations:
// - increase bit
// - decrease bit
// - twist two bits
// - shuffle

/**
 * This function mutates given chromosome by twisting bits
 * @param {seq: Array} clone Already cloned chromosome
 */
var twistTwoRandomBit = (clone) => {
    
    var ptr1 = 0;
    var ptr2 = 0;

    // Twist with random pointer
    // - which must be different
    // - and twisted bit values must be different
    while(ptr1 == ptr2 || clone.seq[ptr1] == clone.seq[ptr2]) {

        // Get two random pointer
        // Math.floor(Math.random() * (max - min +1)) + min
        ptr1 = Math.floor(Math.random() * (clone.seq.length - 1 - 0 + 1)) + 0;
        ptr2 = Math.floor(Math.random() * (clone.seq.length - 1 - 0 + 1)) + 0;

        // Twist both bits
        var v1 = clone.seq[ptr1];
        var v2 = clone.seq[ptr2];
        //
        clone.seq[ptr1] = v2;
        clone.seq[ptr2] = v1;
    }
    // Afterwards pointer should be random and different

    return clone;
};

/**
 * This function create a mutation function which 
 * shuffles all 
 * @param {seq: Array} clone Already cloned chromosome
 */
var shuffleAll = (clone) => {

    // Use complete shuffle
    clone.seq = shuffle(clone.seq);

    // Return mutated object
    return clone;
};

/**
 * This function creates a valid mutation of given chromosome
 * @param {seq: Array} chromosome 
 */
module.exports = (chromosome) => {

    // Clone chromosome's sequence
    var clone = {seq: []};
    clone.seq = chromosome.seq.slice(0);

    // Use with a 50% chance different mutations
    if(Math.random() < 0.7) {
        clone = shuffleAll(clone);
    } else {
        clone = twistTwoRandomBit(clone);
    }
    // Deprecated mutations
    //    clone = increaseRandomBit(clone);     // Increases one bit

    // Mutate given chromosome
    return clone;
}
