/* eslint-env mocha */
var expect = require('chai').expect
var mockery = require('mockery')

beforeEach(function () {
  mockery.enable({
    warnOnReplace: true,
    warnOnUnregistered: true,
    useCleanCache: true
  })

  // Allow source under test module
  mockery.registerAllowable('../../src/monte-carlo/index')
})

afterEach(function () {
  mockery.deregisterAll()
  mockery.disable()
})

describe('Monte-Carlo Algorithm', function () {
  // Define unit under test
  var mc

  beforeEach(() => {
    // Allow source modules
    mockery.registerAllowables(['./src/genetic-algorithm',
      './src/monte-carlo'])

    // Allow source dependencies
    mockery.registerAllowables(['./seed', './fitness', './mutation', './crossover',
      '../genetic-algorithm/seed', '../genetic-algorithm/fitness',
      './mapper/result'])

    // Reinitialize unit under test
    mc = require('../../src/monte-carlo/index')()
  })

  it('Works with medium sized example', function (done) {
    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Run monte-carlo algorithm
    mc.run({ data: input, groups: 5 }).then(result => {
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
    mockery.registerAllowable('../_fixtures/data/3features/input-m.json')
    var input = require('../_fixtures/data/3features/input-m.json')

    // Run monte carlo algorithm
    mc.run({ data: input, groups: 5 }, { results: 11 }).then(result => {
      expect(result.results).to.be.lengthOf(11)
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('Replies with given input', function (done) {
    // Load input data
    mockery.registerAllowable('../_fixtures/data/3features/input-s.json')
    var input = require('../_fixtures/data/3features/input-s.json')

    // Run monte carlo algorithm
    mc.run({ data: input, groups: 5 }).then(result => {
      expect(result.input.data).to.be.deep.equal(input)
      expect(result.input.groups).to.equal(5)
      done()
    }).catch(err => {
      done(err)
    })
  })
})
