// Require dependency functions
const constraints = require('../constraints/chromosome')
const differencesGroups = require('../helpers/difference').differencesGroups
const differences1Dimensional = require('../helpers/difference').differences1Dimensional

// Internal module context collection
var context = {}

/**
 * Fitness function module with customizeable context
 */
module.exports = {
  /**
     * This function caches given parameters within a context object
     */
  context: (input) => {
    context = Object.assign(context, input)
  },

  /**
     * This function calculates a fitness value for given chromosome
     * It uses data input with module require
     * @param {seq: Array} chromosome
     * @returns Number
     */
  score: (chromosome) => {
    // Check if necessary context is set
    if (context.data === undefined || context.groups === undefined) {
      throw new Error('Error: context is missing!')
    }

    // FIXME: Something is here wrong
    // ...Drop "undefined" chromosomes
    if (chromosome === undefined) {
      return Number.NEGATIVE_INFINITY
    }

    // First check if chromosome matches base constraints
    if (!constraints(chromosome, { groups: context.groups })) {
      return Number.NEGATIVE_INFINITY
    }

    // Get array with data keys
    // NOTICE: key ordering must be deterministic!
    var dataKeys = Object.keys(context.data)

    // Create a group Index with its data
    var groups = {}
    chromosome.seq.forEach((element, index) => {
      // Initialize element index
      if (groups[element] === undefined) { groups[element] = [] }

      // Resolve chromosome index to data key and its data entry
      var dataEntry = context.data[dataKeys[index]]

      // Push Data key into indexed group collection
      groups[element].push(dataEntry)
    })

    // Calculate internal group difference
    var internalGroupDifferences = differencesGroups(groups)

    // Calculate euclidean differences between internal group differences
    var outerGroupDifference = differences1Dimensional(internalGroupDifferences)

    // Fitness is Max(heterogenity) - Difference between groups
    var maxGroupHeterogenity = Math.max(...internalGroupDifferences)
    var fitness = maxGroupHeterogenity - outerGroupDifference

    // FInal fitness score
    return fitness
  }
}
