const counter = require('../helpers/counter')

/**
 * This function checks if given chromosome is valid
 * @param chromosome Type of {seq: Array}
 * @param {{String: any}} options Object with rule params
 * @returns FALSE in case of failing and TRUE in case of validness
 */
module.exports = (chromosome, options) => {
  // Count group occurences
  var counts = counter(chromosome)

  //
  var groupSizes = Object.values(counts)
  var minSize = Math.min(...groupSizes)
  var maxSize = Math.max(...groupSizes)

  // 1. Check if min group size is 2
  if (minSize < 2) {
    return false
  }

  // 2. Check if group size is still balanced
  if (maxSize - minSize > 1) {
    return false
  }

  // 3. Check given group size
  if (Object.keys(counts).length !== options.groups) {
    return false
  }

  // [Feature] Check if every group has "edge" members

  // ...else this chromosome is OK!
  return true
}
