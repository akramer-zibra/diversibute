/*
 * Internal member variable
 */
var di = undefined

/**
 * This function searches for best combination by a bunch of random combinations
 * @param {data: {String: Number}, groups: Number} input
 * @return Promise with a result
 */
var run = (input) => {
  /* Validate input arguments */
  // Check necessary arguments
  if (input.data === undefined) {
    throw new Error("Given input arguments are not valid: 'data' is missing.")
  }
  if (input.groups === undefined) {
    throw new Error("Given input arguments are not valid: 'groups' is missing.")
  }
  // Check group argument plausibility
  if (input.groups < 1) {
    throw new Error('Error: Number of groups must be at least 1. Given: ' + input.groups)
  }
  // Check given arguments distribution plausibility
  var keys = Object.keys(input.data) // Get group member keys
  if (input.groups > keys.length) {
    throw new Error("Error: We can't distribute given numbers of members to a higher number of groups")
  }

  return new Promise((resolve, reject) => {
    try {
      // Dependencies
      var fitnessModule = di.container.fitness
      var seedModule = di.container.seed

      // We need to pass input as context to fitness function
      fitnessModule.context(input)

      // Create initial population with seed function
      // NOTICE: We use a population 10 times bigger than the given set of members
      var scores = []
      var scoredPopulation = {}
      for (let n = 0; n < keys.length * 10; n++) {
        // Create a seed
        var seed = seedModule.seed(keys, input.groups)

        // Calculate Score for each population
        var score = fitnessModule.score(seed)

        //
        scoredPopulation[score] = seed // Use this as an index
        scores.push(score)
      }

      // Sort scores
      var ranking = scores.sort((a, b) => { return a - b })

      // Use highest ranking fpr result
      var highestScore = ranking.pop()

      // Return result
      resolve({ combination: scoredPopulation[highestScore].seq, score: highestScore })
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
