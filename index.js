/** Default settings */
const defaults = {
  algorithm: 'genetic'
}

/**
 * Module definition of this kreatives-feld package
 */
module.exports = {
  /**
   * This function creates a group combination from given input
   * and returns combination with its fitness score
   * @param {{String: Array<Number>}} input
   * @param {Number} groups Number of groups
   * @param {String: any} settings Object with option properties
   * @returns {Promise<{combination: Array<Number>, score: Number}>}
   */
  diverse: (data, groups, settings = {}) => {
    // Validate input arguments
    validate(data, groups)

    // Merge given settings with defaults
    settings = Object.assign(defaults, settings)

    // Wrap data- and groups-input into one input object
    var input = { data, groups }

    // Decide which algorithm to use
    var algorithm = (settings.algorithm === 'monte-carlo')
      ? require('./src/monte-carlo')()
      : require('./src/genetic-algorithm')()

    // Run algorithm and return a promise
    return algorithm.run(input, settings)
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
