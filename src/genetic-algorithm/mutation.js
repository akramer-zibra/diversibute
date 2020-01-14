const counter = require('../helpers/counter');

/**
 * Internal method mutates given chromosome
 * @param {seq: Array} chromosome 
 * @returns {seq: Array}
 */
var mutate = (chromosome) => {

    // Clone chromosome's sequence
    var clone = {seq: []};
    clone.seq = chromosome.seq.slice(0);

    // Count group members
    var counts = counter(clone);
    var numberGroups = Object.keys(counts).length;

    // Select a random chromosome bit
    var randomPtr = Math.floor(Math.random() * (chromosome.seq.length - 1 - 0 + 1)) + 0; // @see https://stackoverflow.com/a/1527820
    
    /* Increase one bit and prevent "zero" value */
    clone.seq[randomPtr] = (clone.seq[randomPtr] % numberGroups) + 1; 
        
    return clone;
}

/**
 * This function creates a valid mutation of given chromosome
 * @param {seq: Array} chromosome 
 */
module.exports = (chromosome) => {

    // Mutate given chromosome
    return mutate(chromosome);
}