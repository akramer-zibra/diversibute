var Combinatorics = require('js-combinatorics');
var distance = require('euclidean-distance');

module.exports = (data, chromosome) => {

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