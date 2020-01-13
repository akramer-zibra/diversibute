// Dependencies
var Combinatorics = require('js-combinatorics');
var distance = require('euclidean-distance');

// Functions
/**
 * This function calculates the internal difference sum from given groups
 * @param {*} groups 
 */
var differencesGroups = (groups) => {
    
    // Initialize result collection
    var internalGroupDifferences = [];

    // Calculate difference sum for each group
    Object.keys(groups).forEach((element, index) => {

        // Create distance combinations 
        var combinations = [];
        var cmb = Combinatorics.combination(groups[element], 2);
        while(a = cmb.next()) combinations.push(a);

        // Sum up euclidean distance
        var dSum = 0.0;
        combinations.forEach(combination => {
            dSum += distance(combination[0], combination[1]);  // Calculate euclidean distance
        });
        
        console.log(groups[element]);

        // Collect this difference in result collection
        internalGroupDifferences[index] = dSum;        
    });
    return internalGroupDifferences;
};

/**
 * This function calculates the sum of differences of the given list values
 * @param {*} values 
 */
var differencesSum = (values) => {

    // Create distance combinations 
    var combinations = [];
    var cmb = Combinatorics.combination(values, 2);
    while(a = cmb.next()) combinations.push(a);

    // Sum up euclidean distance
    var dSum = 0.0;
    combinations.forEach(combination => {
        dSum += distance(combination[0], combination[1]);  // Calculate euclidean distance
    });

    return dSum;
};

/**
 * This function calculates a difference sum of given list of numbers
 * @param {*} values 
 */
var differences1Dimensional = (values) => {

    // Create combinations
    var combinations = [];
    var cmb = Combinatorics.combination(values, 2);
    while(a = cmb.next()) combinations.push(a);

    // Sum up simple distance
    var dSum = 0.0;
    combinations.forEach(combination => {
        dSum += Math.abs(combination[0] - combination[1]);
    });

    return dSum;
}

/**
 * This module contains function to calculate euclidean differences
 */
module.exports = {
    differencesGroups,
    differences1Dimensional
};