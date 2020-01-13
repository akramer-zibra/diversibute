const constraint = require('../constraints/chromosome');
const counter = require('../helpers/counter');

/**
 * Internal method mutates given chromosome
 * @param {*} chromosome 
 */
var mutate = (chromosome) => {

    // Cast chromosome to value array 
    if(!Array.isArray(chromosome)) {
        chromosome = Object.values(chromosome);
    }

    // Count group members
    var counts = counter(chromosome);
    var numberGroups = Object.keys(counts).length;

    // Select a random chromosome bit
    var randomPtr = Math.floor(Math.random() * (chromosome.length - 1 - 0 + 1)) + 0; // @see https://stackoverflow.com/a/1527820
    
    /* Increase one bit and prevent "zero" value */
    chromosome[randomPtr] = ((chromosome[randomPtr] + 1) % numberGroups) + 1; 
    
    return chromosome;
}

/**
 * This function creates a valid mutation of given chromosome
 */
module.exports = (chromosome) => {

    // Cast chromosome to value array 
    if(!Array.isArray(chromosome)) {
        chromosome = Object.values(chromosome);
    }

    // Clone chromosome
    var clone = chromosome.splice(0);

    // Mutate given chromosome
    return mutate(clone);
}