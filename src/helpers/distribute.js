module.exports = (amount, keys) => {

    // Use simple round robin distribution
//    var result = roundRobin(amount, keys);
    var result = randomDistribution(amount, keys);

    return result;
}

/**
 * Round robin distribution
 * @param {*} amount 
 * @param {*} keys 
 */
var roundRobin = (amount, keys) => {

    // Initialize result set
    result = [];
    for(let k = 0; k < amount; k++) {
        result.push([]);
    }

    var i = 0;
    while(i < keys.length) {

        // Calculate pocket index
        var pocket = (i % amount);

        result[pocket].push(keys[i]);

        // Increase counter
        i++;
    }

    return result;
}

/**
 * Method does a random disribution
 * @param {*} amount 
 * @param {*} keys 
 */
var randomDistribution = (amount, keys) => {

    // Calculate max group size
    var maxElements = Math.ceil(keys.length / amount);

    // Initialize result set
    var pids = [];      // ...pocket indices
    var result = [];
    for(let k = 0; k < amount; k++) {
        result.push([]);
        pids.push(k);   // e.g.: 0, 1, 2, 3...
    }

    var i = 0;
    while(i < keys.length) {

        // Get random pocket number
        var randomPocket = Math.floor(Math.random() * pids.length);  

        // Random Pocket index
        var rpidx = pids[randomPocket];

        // Check if pocket is already full
        if(result[rpidx].length < maxElements) {

            // Push key into random pocket
            result[rpidx].push(keys[i]);

            i++;
        } else {

            // Remove full pocket from random selection
            pids.splice(randomPocket, 1);
        }
    }

    return result;
}