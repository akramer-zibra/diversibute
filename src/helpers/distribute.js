module.exports = (amount, keys) => {

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