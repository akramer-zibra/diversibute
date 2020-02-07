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
  monteCarlo: (data, groups) => {
    // Wrap data- and groups-input into one input group
    var input = { data, groups }

    // Run monte-carlo algorithm
    return mc.run(input)
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
    // Wrap data- and groups-input into one input object
    var input = { data, groups }

    // Run algorithm with arguments
    return ga.run(input, settings)
  }
}
