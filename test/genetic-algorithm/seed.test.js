/* eslint-env mocha */
var expect = require('chai').expect
var mockery = require('mockery')

/**
 * Help function reduces given array to a hash
 * @param {*} arr
 * @returns String hash
 */
var arrayHash = (arr) => {
  mockery.registerAllowable('crypto')
  var crypto = require('crypto')

  var arrString = arr.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.toString()
  }, '')

  const hash = crypto.createHash('sha256')
  hash.update(arrString)

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
  it('Seed has correct number of members', function () {
    // Dummy input data
    var input = {
      data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
      groups: 4
    }

    // Source under test
    var seedFunc = require('../../src/genetic-algorithm/seed').seed

    // Use seed function
    var seed = seedFunc(input)

    //
    expect(seed.seq).to.have.lengthOf(Object.keys(input.data).length)
  })

  it('Seed has given number of groups', function () {
    // Dummy input data
    var input = {
      data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
      groups: 4
    }

    // Source under test
    var seedFunc = require('../../src/genetic-algorithm/seed').seed

    // Use seed function
    var seed = seedFunc(input)

    // Count group
    var counter = {}
    seed.seq.forEach(group => {
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

    // Source under test
    var seedFunc = require('../../src/genetic-algorithm/seed').seed

    // Use seed function
    var seed = seedFunc(input)

    // Count group
    var counter = {}
    seed.seq.forEach(group => {
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

  it('Population method creates given number of seeds', function () {
    // Dummy input data
    var input = {
      data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
      groups: 4
    }

    // Source under test
    var poulationFunc = require('../../src/genetic-algorithm/seed').population

    var amount = 11

    // Use population function
    var population = poulationFunc(input, amount)

    //
    expect(population).to.have.lengthOf(amount)
  })

  it('Population method creates unique seeds', function () {
    // Dummy input data
    var input = {
      data: { A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [] },
      groups: 4
    }

    // Source under test
    var poulationFunc = require('../../src/genetic-algorithm/seed').population

    // Use population function
    var population = poulationFunc(input, 11)

    // Use a collection of hashes
    var resultHashes = []

    // Check each population
    population.forEach(result => {
      var hash = arrayHash(result.seq)

      // Check if hash already exists
      expect([hash]).to.not.have.members(resultHashes)

      // Remember hash for next check
      resultHashes.push(hash)
    })
  })
})
