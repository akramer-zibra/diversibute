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
  mockery.registerAllowable('../index')
})

afterEach(function () {
  mockery.deregisterAll()
  mockery.disable()
})

// module API test
describe('Module API', function () {
  describe('Monte Carlo function', function () {
    it('Works with medium sized example', function (done) {
      // Allow source modules
      mockery.registerAllowables(['bottlejs',
        './src/genetic-algorithm',
        './src/monte-carlo'])

      // Allow source dependencies
      mockery.registerAllowables(['./seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Run api
      api.monteCarlo(input, 5).then(result => {
        // Check response object structure
        expect(result.settings).to.be.an('object')
        expect(result.elements.length).to.be.at.least(1)
        expect(result.elements[0]).to.be.an('object').has.all.keys('combination', 'score')
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Returns number of specified results', function (done) {
      // Allow source modules
      mockery.registerAllowables(['bottlejs',
        './src/genetic-algorithm',
        './src/monte-carlo'])

      // Allow source dependencies
      mockery.registerAllowables(['./seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Run api
      api.monteCarlo(input, 5, { results: 11 }).then(result => {
        expect(result.elements).to.be.lengthOf(11)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('Genetic Algorithm function', function () {
    it('Works with medium sized example and default options', function (done) {
      // Increase timeout
      this.timeout(20000)

      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        'geneticalgorithm',
        './src/genetic-algorithm',
        './src/monte-carlo',
        './seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Run api
      api.genetic(input, 5).then(results => {
        // Check structure of first result object
        expect(results.elements[0]).to.be.an('object').has.all.keys('combination', 'score')
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Works with custom options', function (done) {
      // Increase timeout
      this.timeout(20000)

      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        'geneticalgorithm',
        './src/genetic-algorithm',
        './src/monte-carlo',
        './seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

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

      // Run api
      api.genetic(input, 5, settings).then(result => {
        // Check response object and returned options
        expect(result.settings).to.deep.equal(settings)
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Result setting specifies amount of results', function (done) {
      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        'geneticalgorithm',
        './src/genetic-algorithm',
        './src/monte-carlo',
        './seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Configure amount of results
      var settings = {
        results: 13
      }

      // Run genetic function
      api.genetic(input, 5, settings).then((result) => {
        // Check if result set contains given amount of results
        expect(result.elements.length).to.be.equal(settings.results)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('Results does not have duplicates', function (done) {
      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        'geneticalgorithm',
        './src/genetic-algorithm',
        './src/monte-carlo',
        './seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Configure amount of results
      var settings = {
        results: 13
      }

      // Run function under test
      api.genetic(input, 5, settings).then((result) => {
        // Count scores in a counter object
        var counter = {}
        result.elements.forEach(combination => {
          if (!counter[combination.score]) {
            counter[combination.score] = 1
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

      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        'geneticalgorithm',
        './src/genetic-algorithm',
        './src/monte-carlo',
        './seed',
        './fitness',
        './mutation',
        './crossover'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

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

      // Run api
      api.genetic(input, 5, settings).then(() => {
        // Check if interceptor is called x times
        expect(interceptorFake.callCount).to.be.equal(settings.bunches)
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })
})
