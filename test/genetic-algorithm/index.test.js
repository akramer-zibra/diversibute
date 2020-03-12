/* eslint-env mocha */
var expect = require('chai').expect
var mockery = require('mockery')
var sinon = require('sinon')

beforeEach(function () {
  mockery.enable({
    warnOnReplace: true,
    warnOnUnregistered: true,
    useCleanCache: true
  })

  // Allow source under test module
  mockery.registerAllowable('../../src/genetic-algorithm/index')
})

afterEach(function () {
  mockery.deregisterAll()
  mockery.disable()
})

describe('Genetic Algorithm', function () {
  // Define unit under test
  var ga

  beforeEach(() => {
    // Allow source dependencies
    mockery.registerAllowables(['geneticalgorithm',
      './src/genetic-algorithm', './src/monte-carlo',
      './seed', './fitness', './mutation', './crossover',
      '../genetic-algorithm/seed', '../genetic-algorithm/fitness',
      './mapper/result'])

    // Reinitialize source under test
    ga = require('../../src/genetic-algorithm/index')()
  })

  it('Works with medium sized example and default options', function (done) {
    // Increase timeout
    this.timeout(20000)

    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Run algorithm
    ga.run({ data: input, groups: 5 }).then(results => {
      // Check structure of first result object
      expect(results.results[0]).to.be.an('object').has.all.keys('groups', 'seq', 'score')
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('Works with custom options', function (done) {
    // Increase timeout
    this.timeout(20000)

    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Define default settings
    var settings = {
      populationStartSize: 40,
      populationMaxSize: 200,
      evolutions: 30,
      elitism: 1,
      bunches: 1,
      interceptor: undefined,
      results: 1
    }

    // Run algorithm
    ga.run({ data: input, groups: 5 }, settings).then(result => {
      // Check response object and returned options
      expect(result.settings).to.deep.equal(settings)
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('Replies with given input', function (done) {
    // Increase timeout
    this.timeout(20000)

    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-s.json')
    var data = require('../_fixtures/data/3features/input-s.json')

    var groups = 4

    // Run algorithm
    ga.run({ data, groups }, { evolutions: 1 }).then(result => { // we run it with 1 evolution for faster response
      // Check if result object containts input
      expect(result.input.data).to.deep.equal(data)
      expect(result.input.groups).to.equal(groups)
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('Result setting specifies amount of results', function (done) {
    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Configure amount of results
    var settings = {
      algorithm: 'genetic',
      results: 13,
      evolutions: 5 // We run this with a small number of evolutions for faster response
    }

    // Run algorithm
    ga.run({ data: input, groups: 5 }, settings).then((result) => {
      // Check if result set contains given amount of results
      expect(result.results.length).to.be.equal(settings.results)
      done()
    }).catch((err) => {
      done(err)
    })
  })

  it('Results does not have duplicates', function (done) {
    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Configure amount of results
    var settings = {
      algorithm: 'genetic',
      results: 13,
      evolutions: 10 // We run this with a small number of evolutions for faster response
    }

    // Run function under test
    ga.run({ data: input, groups: 5 }, settings).then((result) => {
      // Count scores in a counter object
      var counter = {}
      result.results.forEach(resultEntry => {
        if (!counter[resultEntry.score]) {
          counter[resultEntry.score] = 1
          return
        }
        expect.fail('Score already exists. Must be duplicate')
      })
      done()
    }).catch((err) => done(err))
  })

  it('Works with interceptor', function (done) {
    // Increase timeout
    this.timeout(60000)

    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Create an interceptor fake with sinon
    var interceptorFake = sinon.fake()

    // Define some custom options
    // WITH interception
    var settings = {
      populationStartSize: 40,
      populationMaxSize: 200,
      evolutions: 50,
      bunches: 5,
      interceptor: interceptorFake
    }

    // Run algorithm
    ga.run({ data: input, groups: 5 }, settings).then(() => {
      // Check if interceptor is called x times
      expect(interceptorFake.callCount).to.be.equal(settings.bunches)
      done()
    }).catch((err) => {
      done(err)
    })
  })
})
