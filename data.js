const inputXS = require('./examples/data/3features/input-xs.json');   // Best known score is: 4.438407168565259
const inputS = require('./examples/data/3features/input-s.json');     // Best known score is: 42.46570983903612
const inputM = require('./examples/data/3features/input-m.json');     // Best known score is: 233.4154995819719
const inputL = require('./examples/data/3features/input-l.json');     // Best known score is: 604.3560387144068

/**
 * This function is a facade for reading input data 
 */
module.exports = () => {
    return inputL;
}