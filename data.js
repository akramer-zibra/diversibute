const inputXS = require('./examples/data/input-xs.json');   // Best known score is: 4.438407168565259
const inputS = require('./examples/data/input-s.json');     // Best known score is: 42.46570983903612

/**
 * This function is a facade for reading input data 
 */
module.exports = () => {
    return inputS;
}