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
  bunches: 1,
  interceptor: undefined,
  results: 1
}

/**
 * This internal function runs prepared genetic algorithm as
 * an intercepted chain
 * @param {*} ga
 * @param {String: any} settings
 * @returns Genetic algorithm obejct
 */
var interceptedEvolve = (ga, settings) => {
  // Validate given settings
  if (settings.bunches < 1) {
    throw new Error('Number of configured bunches must be a number and at least 1')
  }

  // Calculate evolution bunches for interception
  var evolutionStep = Math.floor(settings.evolutions / settings.bunches)

  // Run calculation as evolution bunches
  for (let run = 0; run < settings.evolutions; run++) {
    ga.evolve() // Process evolution

    // Integrate interceptor function
    // when iteration is a plural of a evolution step
    if (settings.interceptor !== undefined && (run % evolutionStep === 0)) {
      settings.interceptor(ga)
    }
  }

  // Resolve the matured ga population
  return ga
}

/**
 * This function creates a configuration object
 * @param {*} input
 * @param {*} settings
 * @param {*} population
 */
var configuration = (input, settings, population) => {
  // Get dependencies
  var fitnessModule = di.container.fitness
  var mutationFunction = di.container.mutation
  var crossoverFunction = di.container.crossover

  // We need to pass input as context to fitness function
  fitnessModule.context(input)

  return {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessModule.score,
    /* Customize with settings */
    population: population, // Create an initial population
    populationSize: settings.populationMaxSize,
    elitism: settings.elitism, // Configure quota of elite population members
    groupSize: input.groups
  }
}

/**
 * This function transforms given results into one final result structure
 * @param {*} results
 * @param {*} settings
 * @returns {settings: {String: any}, elements: Array<{combination: Array<Number>, score: Number}>}
 */
var finalize = (results, settings) => {
  // Define result object structure
  var result = {
    settings, elements: []
  }

  // Slice configured amount of results
  // ...and transform it for response
  Object.keys(results).slice(0, settings.results).forEach(score => {
    var combination = results[score]
    result.elements.push({ combination: combination.phenotype.seq, score: combination.score })
  })

  return result
}

/**
 * This function runs the genetic algorithm with given arguments
 * @param {data: {String: Number}, groups: Number} input
 * @param {String: any} settings
 * @return {Array<combination: Array<number>, score: Number, options: {String: any}>}
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

  // Merge given settings with defaults
  settings = Object.assign(defaults, settings) // Use given options and merge with default values

  // Generate an initial population seed
  var population = di.container.seed.population(input, settings.populationStartSize)

  // Configure genetic algorithm
  var config = configuration(input, settings, population)

  // Create a fresh algorithm object here
  var Genetics = require('geneticalgorithm')
  var genetic = Genetics(config)

  // Genetic evolution is async!
  return new Promise((resolve, reject) => {
    // Run evolution with optional interception
    var evolvedGa = interceptedEvolve(genetic, settings)

    /* Order population by their scores */
    var scoredPopulation = evolvedGa.scoredPopulation()
    var rankedPopulation = scoredPopulation.sort((a, b) => { return (a.score < b.score) ? 1 : -1 })

    /* Remove duplicates */
    // Create a hashmap with unique results
    var uniquePopulationIndex = {}
    rankedPopulation.forEach(element => {
      uniquePopulationIndex[element.score] = element
    })

    // Transform ga results into one result structure
    var result = finalize(uniquePopulationIndex, settings)

    resolve(result)
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
