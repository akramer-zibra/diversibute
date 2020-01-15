const counter = require('../helpers/counter');
const shuffle = require('../helpers/shuffle');

// Possible mutations:
// - increase bit
// - decrease bit
// - twist two bits
// - shuffle

/**
 * Internal method mutates given chromosome
 * @param {seq: Array} chromosome 
 * @returns {seq: Array}
 */
var increaseRandomBit = (chromosome) => {

    // Count group members
    var counts = counter(clone);
    var numberGroups = Object.keys(counts).length;

    // Select a random chromosome bit
    var randomPtr = Math.floor(Math.random() * (chromosome.seq.length - 1 - 0 + 1)) + 0; // @see https://stackoverflow.com/a/1527820
    
    /* Increase one bit and prevent "zero" value */
    clone.seq[randomPtr] = (clone.seq[randomPtr] % numberGroups) + 1; 
        
    return clone;
}

var decreaseRandomBit = () => {};

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

    // Mutate (increase bit)
//    clone = increaseRandomBit(clone);

    // Use with a 50% chance different mutations
    if(Math.random() < 0.7) {
        clone = shuffleAll(clone);
    } else {
        clone = twistTwoRandomBit(clone);
    }

    // Mutate given chromosome
    return clone;
}
