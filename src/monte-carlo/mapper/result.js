module.exports = {

  /**
   * Maps given parameters into ine result json structure
   * @param {*} input
   * @param {*} settings
   * @param {*} chromosomes
   */
  result: (input, settings, chromosomes) => {
    // Define empty result
    var result = {
      input,
      settings,
      results: []
    }

    // Push configured results in elements collection
    chromosomes.slice(0, settings.results).forEach(chromosome => {
      // Define result entry structure
      var resultEntry = {
        groups: [],
        seq: [],
        score: undefined
      }

      // Set chromosome properties
      resultEntry.seq = chromosome.seq
      resultEntry.score = chromosome.score

      // Initialize collection for subgroups
      var groups = []
      var memberKeys = Object.keys(input.data) // Load input keys

      // ..and create a grouped collection
      chromosome.seq.forEach((element, idx) => {
        // Initialize subgroup collection if it does not exist yet
        if (!groups[element - 1]) { groups[element - 1] = [] } // NOTICE: element starts with number 1, not 0

        // And then push the memberKey from sequence index into the subgroup collection
        groups[element - 1].push(memberKeys[idx])
      })
      resultEntry.groups = groups

      //
      result.results.push(resultEntry)
    })

    return result
  }
}
