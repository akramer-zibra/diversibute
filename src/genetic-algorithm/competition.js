const fitnessFunc = require('./fitness');

/**
 * This function compares a and b chromosome and does a competition between
 * 
 * @returns TRUE if a beats b, else FALSE
 */
module.exports = (a, b) => {

    // Calculate fitness a
    var fitnessA = fitnessFunc(a);
    if(fitnessA == undefined) {
        return false;
    }

    // Calculate fitness b
    var fitnessB = fitnessFunc(b);
    if(fitnessB == undefined) {
        return true
    }

    // ..else chromosome with higher score wins
    return (fitnessA >= fitnessB);
}