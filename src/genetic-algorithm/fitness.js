// Require data
const data = require('../../input');

// Require dependency functions
const constraints = require('../constraints/chromosome');
const differencesGroups = require('../helpers/difference').differencesGroups;
const differences1Dimensional = require('../helpers/difference').differences1Dimensional;

/**
 * This function calculates a fitness value for given chromosome 
 * It uses data input with module require
 */
module.exports = (chromosome) => {

    // First check if chromosome matches base constraints
    if(!constraints(chromosome)) {
        return undefined;
    }

    // Get array with data keys
    // NOTICE: key ordering must be deterministic!
    var dataKeys = Object.keys(data);

    // Create a group Index with its data
    var groups = {};
    chromosome.forEach((element, index) => {
        
        if(groups[element] == undefined) {
            groups[element] = [];
        }

        // Resolve chromosome index to data key and its data entry
        var dataEntry = data[dataKeys[index]];

        // Push Data key into indexed group collection
        groups[element].push(dataEntry);

        console.log(element);
    });
    console.log(groups);

    // Calculate internal group difference
    var internalGroupDifferences = differencesGroups(groups);
    console.log(internalGroupDifferences);

    // Calculate euclidean differences between internal group differences
    var outerGroupDifference = differences1Dimensional(internalGroupDifferences);
    console.log(outerGroupDifference);

    // Fitness is Max(heterogenity) - Difference between groups  
    var maxGroupHeterogenity = Math.max(...internalGroupDifferences);
    var fitness = maxGroupHeterogenity - outerGroupDifference;

    // FInal fitness score
    return fitness;
}