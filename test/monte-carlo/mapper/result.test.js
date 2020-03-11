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
  mockery.registerAllowable('../../../src/monte-carlo/mapper/result')
})

afterEach(function () {
  mockery.deregisterAll()
  mockery.disable()
})

//
describe('Result mapper (Monte Carlo)', function () {
  // Source under test
  var mapper = require('../../../src/monte-carlo/mapper/result')

  it('maps input, settings and chromosomes to result structure', function () {
    // Dummy input
    var input = {
      data: {
        A: [1],
        B: [1],
        C: [1],
        D: [1],
        E: [1],
        F: [1],
        G: [1]
      },
      groups: 2
    }

    // Dummy settings
    var settings = {
      results: 5
    }

    // Dummy chromosome results
    var chromosomes = [
      { seq: [1, 1, 1, 2, 2, 2, 2], score: 11.11 },
      { seq: [1, 1, 1, 2, 2, 2, 2], score: 11.11 },
      { seq: [1, 1, 1, 2, 2, 2, 2], score: 11.11 },
      { seq: [1, 1, 1, 2, 2, 2, 2], score: 11.11 },
      { seq: [1, 1, 1, 2, 2, 2, 2], score: 11.11 }
    ]

    // Run map function
    var result = mapper.result(input, settings, chromosomes)

    // Check result structure
    expect(result).to.be.an('object').has.all.keys('input', 'settings', 'results')
    expect(result.input).to.be.an('object').has.all.keys('data', 'groups')
    expect(result.results).to.be.an('array')
    expect(result.results[0]).to.be.an('object').has.all.keys('groups', 'seq', 'score')
    expect(result.results[0].groups).to.be.lengthOf(2)
    expect(result.results[0].seq).to.be.lengthOf(chromosomes[0].seq.length)
    expect(result.results[0].score).to.be.a('number')
  })
})
