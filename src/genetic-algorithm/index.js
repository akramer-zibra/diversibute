/*
 * Internal member variables
 */
var di

/** Default settings for genetic algorithm */
var defaults = {
  populationStartSize: 40,
  populationMaxSize: 100,
  evolutions: 100,
  elitism: 1, // Every chroosome is elite
  steps: 1,
  interceptor: undefined
}

/**
 * This internal function runs prepared genetic algorithm as
 * an intercepted chain
 */
var interceptedEvolve = (ga, settings) => {
  // Validate given settings
  if (settings.steps < 1) {
    throw new Error('Number of configured steps must be a number and at least 1')
  }

  return new Promise((resolve, reject) => {
    // Calculate evolution steps for interception
    var evolutionStep = Math.floor(settings.evolutions / settings.steps)

    // Run calculation as evolution steps
    for (let run = 0; run < settings.evolutions; run++) {
      // Process evolution
      ga.evolve({ evolutions: evolutionStep })

      // Integrate interceptor function
      // when iteration is a plural of a evolution step
      if (settings.interceptor !== undefined && (run % evolutionStep === 0)) {
        settings.interceptor(ga)
      }
    }

    // Return ga object with its scored population
    resolve(ga)
  })
}

/**
 * This function runs the genetic algorithm with given arguments
 * @param {data: {String: Number}, groups: Number} input
 * @param {String: any} settings
 * @return {combination: Array<number>, score: Number, options: {String: any}}
 */
var run = (input, settings = {}) => {
  // Check prerequisities
  if (di === undefined) {
    throw new Error("You need to run 'register' method first")
  }
  // Validate input arguments
  if (input.data === undefined) {
    throw new Error("Given input arguments are not valid: 'data' is missing.")
  }
  if (input.groups === undefined) {
    throw new Error("Given input arguments are not valid: 'groups' is missing.")
  }

  // Require genetic algorithm library
  const Genetics = require('geneticalgorithm')

  // Get dependencies
  var fitnessModule = di.container.fitness
  var seedModule = di.container.seed
  var mutationFunction = di.container.mutation
  var crossoverFunction = di.container.crossover

  // Merge given settings with defaults
  settings = Object.assign(defaults, settings) // Use given options and merge with default values

  // Load keys from input data
  var keys = Object.keys(input.data)

  // We need to pass input as context to fitness function
  fitnessModule.context(input)

  // Generate an initial population
  var population = seedModule.population(keys, input.groups, settings.populationStartSize)

  // Configure genetic algorithm
  var configuration = {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessModule.score,
    /* Customize with settings */
    population: population, // Create an initial population
    populationSize: settings.populationMaxSize,
    elitism: settings.elitism, // Configure quota of elite population members
    groupSize: input.groups
  }

  // Create a fresh algorithm object here
  const genetic = Genetics(configuration)

  // Genetic evolution is async!
  return new Promise((resolve, reject) => {
    // Run evolution with optional interception
    interceptedEvolve(genetic, settings).then(result => {
      // Resolve winning chromosome with its score
      var winnerPheno = result.best()
      var winnerScore = result.bestScore()

      resolve({
        combination: winnerPheno.seq,
        score: winnerScore,
        settings
      })
    })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * Constructor method for this module
 * @param {Bottle} bottle BottleJS instance
 * @returns Genetic Algorithm object
 */
module.exports = (bottle) => {
  // Cache bottle instance
  di = bottle

  // Load genetic algorithm functions
  bottle.constant('seed', require('./seed'))
  bottle.constant('fitness', require('./fitness'))
  bottle.constant('mutation', require('./mutation'))
  bottle.constant('crossover', require('./crossover'))

  // Put reference to this module in di container
  bottle.constant('ga', module.exports)

  return {
    run
  }
}
