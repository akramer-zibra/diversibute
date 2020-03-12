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
    // Increase timeout
    this.timeout(3000)

    // Load input data
    mockery.registerAllowable('./_fixtures/data/3features/input-m.json')
    var input = require('./_fixtures/data/3features/input-m.json')

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

    it('Throws error if given groups are too little', function (done) {
      // Run api
      try {
        api.diverse({
          A: [1],
          B: [1],
          C: [2],
          D: [2],
          E: [2],
          F: [2]
        }, 1).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
    })

    it('Throws error with too less input data', function (done) {
      // Run function under test
      try {
        api.diverse({
          A: [1],
          B: [1],
          C: [1]
        }, 2).then((result) => {
          expect.fail()
          done()
        })
      } catch (err) {
        expect(err).to.be.an('error')
        done()
      }
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
      mockery.registerAllowable('./_fixtures/data/3features/input-m.json')
      var input = require('./_fixtures/data/3features/input-m.json')

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
      mockery.registerAllowable('./_fixtures/data/3features/input-m.json')
      var input = require('./_fixtures/data/3features/input-m.json')

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
      mockery.registerAllowable('./_fixtures/data/3features/input-s.json')
      var input = require('./_fixtures/data/3features/input-s.json')

      // Run monte carlo through api
      api.diverse(input, 5, { algorithm: 'monte-carlo' }).then(result => {
        expect(result.input.data).to.be.deep.equal(input)
        expect(result.input.groups).to.equal(5)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })
})
