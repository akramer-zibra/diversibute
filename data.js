const inputXS = require('./examples/data/input-xs.json');   // Best known score is: 4.438407168565259
const inputS = require('./examples/data/input-s.json');     // Best known score is: 42.46570983903612
const inputM = require('./examples/data/input-m.json');     // Best known score is: 233.4154995819719

/**
 * This function is a facade for reading input data 
 */
module.exports = () => {
    return inputM;
}