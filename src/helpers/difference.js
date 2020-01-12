var Combinatorics = require('js-combinatorics');
var distance = require('euclidean-distance');

/** 
 * This function calculates internal difference of given groups
 * and returns a 
 */
module.exports = (groups, data) => {
    


    return [];
}

/**
 * @deprecated
 */ 
var legacyDistance = (chromosome, data) => {

    var internalPocketDistances = [];
    chromosome.forEach((pocket) => {

        console.log(pocket);
        console.log('------------');

        // Initialize empty combination result array
        var combinations = [];

        var cmb = Combinatorics.combination(pocket, 2);
        while(a = cmb.next()) combinations.push(a);

        // Sum up euclidean distance
        var dSum = 0.0;

        combinations.forEach(combination => {

            // Calculate euclidean distance
            dSum += distance(data[combination[0]], data[combination[1]]);
        });

        internalPocketDistances.push(dSum);
        console.log(dSum);
    });

    console.log(internalPocketDistances);
    return internalPocketDistances;
}