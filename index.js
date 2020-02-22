// Start with an initial Inverion of Control container
const Bottle = require('bottlejs')
const di = new Bottle()

// Build genetic-algorithm module
const ga = require('./src/genetic-algorithm')(di)

// Build montecarlo algorithm module
const mc = require('./src/monte-carlo')(di)

/**
 * Module definition of this kreatives-feld package
 */
module.exports = {
  /**
   * This function creates groups from given input
   * with a simple monte carlo algorithm
   * @param {{String: Array<Number>}} data
   * @param {Number} groups Number of groups
   * @returns {Promise<{combination: Array<Number>, score: Number}>}
   */
  monteCarlo: (data, groups, settings = {}) => {
    // Validate input arguments
    validate(data, groups)

    // Wrap data- and groups-input into one input group
    var input = { data, groups }

    // Run monte-carlo algorithm
    return mc.run(input, settings)
  },
  /**
   * This function creates a group combination from given input
   * and returns combination with its fitness score
   * @param {{String: Array<Number>}} input
   * @param {Number} groups Number of groups
   * @param {String: any} settings Object with option properties
   * @returns {Promise<{combination: Array<Number>, score: Number}>}
   */
  genetic: (data, groups, settings = {}) => {
    // Validate input arguments
    validate(data, groups)

    // Wrap data- and groups-input into one input object
    var input = { data, groups }

    // Run algorithm with arguments
    return ga.run(input, settings)
  }
}

/**
 * Validates given input arguments
 * @param {*} data
 * @param {*} groups
 */
var validate = (data, groups) => {
  //
  if (groups < 2) {
    throw new Error('Error: Number of groups must be at least 2. Given ' + groups)
  }

  // We need at least two elements for each group
  if (Object.keys(data).length < (2 * groups)) {
    throw new Error('Error: We need at least 2 x groups input elements. Given ' + Object.keys(data).length)
  }
}

/*
// Debug entry
var data = require('./examples/data/3features/input-m.json')
mc.run({ data, groups: 5 }, { results: 5 })
*/
