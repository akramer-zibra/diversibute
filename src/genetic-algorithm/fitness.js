const difference = require('../helpers/difference');
const regression = require('../helpers/regression');

/**
 * This function calculates a fitness value for given chromosome 
 * It needs access to the input data
 */
module.exports = (chromosome, data) => {

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
    var groupDifferences = difference(groups, data);
    console.log(groupDifferences);

    // Calculate a linear regression function
    var linearFunction = regression(groupDifferences);
    console.log(linearFunction);

    // Calculate a fitness score from linear regression 
    var fitnessScore = (Math.abs(linearFunction['equation'][0]) > 1) ? 0 : linearFunction['equation'][1];

    return fitnessScore;
}