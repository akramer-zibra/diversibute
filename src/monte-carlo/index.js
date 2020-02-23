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

        // Calculate Score for this population
        var score = fitnessModule.score(seed)

        //
        scoredPopulation[score] = seed // Use this seed's score as an index
        scores.push(score)
      }

      // Sort scores
      var ranking = scores.sort((a, b) => { return b - a })

      // Create a sorted list population. HIghest scores first
      var sortedPopulations = []
      ranking.forEach(score => {
        var element = {
          seq: scoredPopulation[score].seq,
          score
        }
        sortedPopulations.push(element)
      })

      // Map everything into a result object structure
      var result = require('./mapper/result').result(input, settings, sortedPopulations)

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
