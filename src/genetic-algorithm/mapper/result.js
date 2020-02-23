module.exports = {
  /**
   * Maps given params to a result object
   * @param {*} input
   * @param {*} settings
   * @param {*} chromosomes
   */
  result: (input, settings, chromosomes) => {
    // Initialize result object
    var result = {
      input,
      settings,
      results: []
    }

    // Slice configured amount of results
    // ...and transform it for response
    Object.keys(chromosomes).slice(0, settings.results).forEach(score => {
      // Initialize result element structure
      var resultElement = {
        groups: [],
        seq: [],
        score: undefined
      }

      // Pick chromosome with score index
      var combination = chromosomes[score]

      // Map chromosome proteries to result properties
      resultElement.seq = combination.phenotype.seq
      resultElement.score = combination.score

      // Initialize collection for subgroups
      var groups = []
      var memberKeys = Object.keys(input.data) // Load input keys

      // ..and create a grouped collection
      combination.phenotype.seq.forEach((element, idx) => {
        // Initialize subgroup collection if it does not exist yet
        if (!groups[element - 1]) { groups[element - 1] = [] } // NOTICE: element starts with number 1, not 0

        // And then push the memberKey from sequence index into the subgroup collection
        groups[element - 1].push(memberKeys[idx])
      })
      resultElement.groups = groups

      //
      result.results.push(resultElement)
    })

    //
    return result
  }
}
