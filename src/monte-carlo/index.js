/*
 * Internal member variable
 */
var di

/** Default settings for monte carlo */
var defaults = {
  results: 1
}

/**
 * This function searches for best combination by a bunch of random combinations
 * @param {data: {String: Number}, groups: Number} input
 * @return Promise with a result
 */
var run = (input, settings = {}) => {
  // Merge given settings with defaults
  settings = Object.assign(defaults, settings)

  return new Promise((resolve, reject) => {
    try {
      // Dependencies
      var fitnessModule = di.container.fitness
      var seedModule = di.container.seed

      // We need to pass input as context to fitness function
      fitnessModule.context(input)

      // Get group member keys
      var keys = Object.keys(input.data)

      // Create initial population with seed function
      // NOTICE: We use a population 10 times bigger than the given set of members
      var scores = []
      var scoredPopulation = {}
      for (let n = 0; n < keys.length * 10; n++) {
        // Create a seed
        var seed = seedModule.seed(input)

        // Calculate Score for each population
        var score = fitnessModule.score(seed)

        //
        scoredPopulation[score] = seed // Use this as an index
        scores.push(score)
      }

      // Sort scores
      var ranking = scores.sort((a, b) => { return b - a })

      // Define empty result
      var result = {
        input,
        settings,
        elements: []
      }

      // Push configured results in elements collection
      ranking.slice(0, settings.results).forEach(score => {
        result.elements.push({ combination: scoredPopulation[score].seq, score })
      })

      resolve(result) // Return result structure
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Constructor methode
 */
module.exports = (bottle) => {
  // Pust reference to ioc container into internal variable
  di = bottle

  // Register some special methods?!...

  return {
    run
  }
}
