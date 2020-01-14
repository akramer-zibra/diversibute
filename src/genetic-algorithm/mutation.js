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
var twistTwoRandomBit = () => {};

/**
 * This function create a mutation function which 
 * shuffles all 
 */
var shuffleAll = (chromosome) => {

    // Use complete shuffle
    chromosome.seq = shuffle(chromosome.seq);

    // 
    return chromosome;
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

    // Mutation (shuffle all)
    clone = shuffleAll(clone);

    // Mutate given chromosome
    return clone;
}
