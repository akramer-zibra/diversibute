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
  describe('diverse() Function', function () {
    // Load input data
    mockery.registerAllowable('../examples/data/3features/input-m.json')
    var input = require('../examples/data/3features/input-m.json')

    // Define unit under test
    var api

    // Prepare
    beforeEach(() => {
      // Allow source modules
      mockery.registerAllowables(['geneticalgorithm', './src/genetic-algorithm', './src/monte-carlo'])

      // Allow source dependencies
      mockery.registerAllowables(['./seed', './fitness', './mutation', './crossover', '../genetic-algorithm/seed', '../genetic-algorithm/fitness', './mapper/result'])

      // Reinitialize unit under test
      api = require('../index')
    })

    it('Works with defaults', function (done) {
      // Run api
      api.diverse(input, 5).then(result => {
        // Check response object structure
        expect(result.settings).to.be.an('object')
        expect(result.results.length).to.be.at.least(1)
        expect(result.results[0]).to.be.an('object').has.all.keys('groups', 'seq', 'score')
        expect(result.settings.algorithm).to.be.equal('genetic')
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('Monte-Carlo Algorithm', function () {
    // Define unit under test
    var api

    beforeEach(() => {
      // Allow source modules
      mockery.registerAllowables(['./src/genetic-algorithm',
        './src/monte-carlo'])

      // Allow source dependencies
      mockery.registerAllowables(['./seed', './fitness', './mutation', './crossover',
        '../genetic-algorithm/seed', '../genetic-algorithm/fitness',
        './mapper/result'])

      // Reinitialize unit under test
      api = require('../index')
    })

    it('Works with medium sized example', function (done) {
      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Run monte-carlo algorithm through api
      api.diverse(input, 5, { algorithm: 'monte-carlo' }).then(result => {
        // Check response object structure
        expect(result.settings).to.be.an('object')
        expect(result.results.length).to.be.at.least(1)
        expect(result.results[0]).to.be.an('object').has.all.keys('groups', 'seq', 'score')
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Returns number of specified results', function (done) {
      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Run monte carlo thourgh api
      api.diverse(input, 5, { algorithm: 'monte-carlo', results: 11 }).then(result => {
        expect(result.results).to.be.lengthOf(11)
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Replies with given input', function (done) {
      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-s.json')
      var input = require('../examples/data/3features/input-s.json')

      // Run monte carlo through api
      api.diverse(input, 5, { algorithm: 'monte-carlo' }).then(result => {
        expect(result.input.data).to.be.deep.equal(input)
        expect(result.input.groups).to.equal(5)
        done()
      }).catch(err => {
        done(err)
      })
    })

    it('Throws error with too less input data', function (done) {
      // Run api
      try {
        api.diverse({
          A: [1],
          B: [1]
        }, 3, { algorithm: 'monte-carlo' }).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
    })

    it('Throws error with too small groups number', function (done) {
      // Run api
      try {
        api.diverse({
          A: [1],
          B: [1]
        }, 1, { algorithm: 'monte-carlo' }).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
    })
  })

  describe('Genetic Algorithm', function () {
    // Define unit under test
    var api

    beforeEach(() => {
      // Allow source dependencies
      mockery.registerAllowables(['geneticalgorithm',
        './src/genetic-algorithm', './src/monte-carlo',
        './seed', './fitness', './mutation', './crossover',
        '../genetic-algorithm/seed', '../genetic-algorithm/fitness',
        './mapper/result'])

      // Reinitialize source under test
      api = require('../index')
    })

    it('Works with medium sized example and default options', function (done) {
      // Increase timeout
      this.timeout(20000)

      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Run api
      api.diverse(input, 5, { algorithm: 'genetic' }).then(results => {
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
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Define default settings
      var settings = {
        algorithm: 'genetic',
        populationStartSize: 40,
        populationMaxSize: 200,
        evolutions: 30,
        elitism: 1,
        bunches: 1,
        interceptor: undefined,
        results: 1
      }

      // Run api
      api.diverse(input, 5, settings).then(result => {
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
      mockery.registerAllowable('../examples/data/3features/input-s.json')
      var data = require('../examples/data/3features/input-s.json')

      var groups = 4

      // Run api
      api.diverse(data, groups, { algorithm: 'genetic', evolutions: 1 }).then(result => { // we run it with 1 evolution for faster response
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
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Configure amount of results
      var settings = {
        algorithm: 'genetic',
        results: 13,
        evolutions: 5 // We run this with a small number of evolutions for faster response
      }

      // Run genetic function
      api.diverse(input, 5, settings).then((result) => {
        // Check if result set contains given amount of results
        expect(result.results.length).to.be.equal(settings.results)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('Results does not have duplicates', function (done) {
      // Load input data
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Configure amount of results
      var settings = {
        algorithm: 'genetic',
        results: 13,
        evolutions: 10 // We run this with a small number of evolutions for faster response
      }

      // Run function under test
      api.diverse(input, 5, settings).then((result) => {
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
      mockery.registerAllowable('../examples/data/3features/input-m.json')
      var input = require('../examples/data/3features/input-m.json')

      // Create an interceptor fake with sinon
      var interceptorFake = sinon.fake()

      // Define some custom options
      // WITH interception
      var settings = {
        algorithm: 'genetic',
        populationStartSize: 40,
        populationMaxSize: 200,
        evolutions: 50,
        bunches: 5,
        interceptor: interceptorFake
      }

      // Run api
      api.diverse(input, 5, settings).then(() => {
        // Check if interceptor is called x times
        expect(interceptorFake.callCount).to.be.equal(settings.bunches)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('Throws error with too less input data', function (done) {
      // Run function under test
      try {
        api.diverse({
          A: [1],
          B: [1],
          C: [1]
        }, 2, { algorithm: 'genetic' }).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
    })

    it('Throws error with too small groups number', function (done) {
      // Run function under test
      try {
        api.diverse({
          A: [1],
          B: [1],
          C: [1],
          D: [1]
        }, 1, { algorithm: 'genetic' }).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
    })
  })
})
