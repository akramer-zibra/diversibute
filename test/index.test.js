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

  // Allow source dependencies
  mockery.registerAllowables(['bottlejs',
    'geneticalgorithm',
    'lodash',
    'util',
    '../helpers/shuffle',
    './src/genetic-algorithm',
    './seed',
    './fitness',
    './mutation',
    './crossover'])
})

afterEach(function () {
  mockery.disable()
})

// module API test
describe('Module API', function () {
  describe('Monte Carlo function', function () {
    it('Works with medium sized example', function (done) {
      // Allow source dependencies
      mockery.registerAllowables(['bottlejs',
        './src/genetic-algorithm',
        './src/monte-carlo'])

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Run api
      api.monteCarlo(input, 5).then(result => {
        // Check response object
        expect(result).to.be.an('object').has.all.keys('combination', 'score')
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

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Run api
      api.genetic(input, 5).then(result => {
        // Check response object
        expect(result).to.be.an('object').has.all.keys('combination', 'score', 'settings')
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Works with custom options', function (done) {
      // Increase timeout
      this.timeout(20000)

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Source under test
      var api = require('../index')

      // Define some custom options
      var settings = {
        populationStartSize: 40,
        populationMaxSize: 200,
        evolutions: 300,
        elitism: 1,
        bunches: 1,
        interceptor: undefined
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

    it('Works with interceptor', function (done) {
      // Increase timeout
      this.timeout(60000)

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
        evolutions: 200,
        bunches: 4,
        interceptor: interceptorFake
      }

      // Run api
      api.genetic(input, 5, settings).then(() => {
        // Check if interceptor is called x times
        expect(interceptorFake.callCount).to.be.equal(4)
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })
})
