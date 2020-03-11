/* eslint-env mocha */
var expect = require('chai').expect
var mockery = require('mockery')

/**
 * Help function reduces given array to a hash
 * @param {*} arr
 * @returns String hash
 */
var utilArrayHash = (arr) => {
  mockery.registerAllowable('crypto')
  var crypto = require('crypto')

  const hash = crypto.createHash('sha256')
  hash.update(arr.toString())

  return hash.digest('hex')
}

beforeEach(function () {
  mockery.enable({
    warnOnReplace: true,
    warnOnUnregistered: true,
    useCleanCache: true
  })

  // Allow source under test
  mockery.registerAllowable('../../src/genetic-algorithm/seed')
})

afterEach(function () {
  mockery.disable()
})

describe('Seed module', function () {
  describe('seed function', function () {
    // Define unit under test
    var seed

    beforeEach(() => {
      seed = require('../../src/genetic-algorithm/seed').seed // Renitialize
    })

    it('Seed has correct number of members', function () {
      // Dummy input data
      var input = {
        data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
        groups: 4
      }

      //
      expect(seed(input).seq).to.have.lengthOf(Object.keys(input.data).length)
    })

    it('Seed has given number of groups', function () {
      // Dummy input data
      var input = {
        data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
        groups: 4
      }

      // Count group
      var counter = {}
      seed(input).seq.forEach(group => {
        if (!counter[group]) {
          counter[group] = 1
        }
        counter[group]++
      })

      //
      expect(Object.keys(counter)).to.have.lengthOf(input.groups)
    })

    it('Number of groupmembers do not differ by more than 1', function () {
      // Dummy input data
      var input = {
        data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
        groups: 4
      }

      // Count group
      var counter = {}
      seed(input).seq.forEach(group => {
        if (!counter[group]) {
          counter[group] = 1
        }
        counter[group]++
      })

      //
      var minGroupCount = Math.min(...Object.values(counter))
      var maxGroupCount = Math.max(...Object.values(counter))

      //
      expect(maxGroupCount - minGroupCount).to.be.at.most(1)
    })
  })

  describe('population function', function () {
    // Define unit under test
    var population

    beforeEach(() => {
      population = require('../../src/genetic-algorithm/seed').population
    })

    it('Population method creates given number of seeds', function () {
      // Dummy input data
      var input = {
        data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
        groups: 4
      }

      var amount = 11

      //
      expect(population(input, amount)).to.have.lengthOf(amount)
    })

    it('Population method creates unique seeds', function () {
      // Dummy input data
      var input = {
        data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
        groups: 4
      }

      // Use a collection of hashes
      var resultHashes = []

      // Check each population
      population(input, 11).forEach(result => {
        var hash = utilArrayHash(result.seq)

        // Check if hash already exists
        expect([hash]).to.not.have.members(resultHashes)

        // Remember hash for next check
        resultHashes.push(hash)
      })
    })
  })
})
