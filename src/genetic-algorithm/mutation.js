const constraint = require('../constraints/chromosome');
const counter = require('../helpers/counter');

/**
 * Internal method mutates given chromosome
 * @param {*} chromosome 
 */
var mutate = (chromosome) => {

    // Count group members
    var counts = counter(chromosome);
    var numberGroups = Object.keys(counts).length;

    // Select a random chromosome bit
    var randomPointer = Math.floor(Math.random() * (chromosome.length - 1 - 0 + 1)) + 0; // @see https://stackoverflow.com/a/1527820
    console.log(randomPointer);
    
    /* Increase one bit and prevent "zero" value */
    chromosome[randomPointer] = ((chromosome[randomPointer] + 1) % numberGroups) + 1; 
    
    return chromosome;
}

/**
 * This function creates a valid mutation of given chromosome
 */
module.exports = (chromosome) => {

    // Clone chromosome
    var clone = chromosome.slice(0);
    console.log(clone);

    // Mutate given chromosome
    clone = mutate(clone);

    // FIXME.. move constraint test into fitness function!!!
    // Mutate until constraints are valid
    /*while(!constraint(clone)) {
        clone = mutate(clone);
    }*/

    return clone;
}