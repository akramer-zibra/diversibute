/* eslint-env mocha */
var expect = require('chai').expect
var mockery = require('mockery')

beforeEach(function () {
  mockery.enable({
    warnOnReplace: true,
    warnOnUnregistered: true,
    useCleanCache: true
  })

  mockery.registerAllowable('../../src/constraints/chromosome')
})

afterEach(function () {
  mockery.disable()
})

describe('Constraints function', function () {
  describe('Check failures', function () {
    // Define unit under test
    var constraints

    beforeEach(() => {
      // Reinitialize source under test
      constraints = require('../../src/constraints/chromosome')
    })

    it('Returns FALSE if min group size is not reached', function () {
      expect(constraints({ seq: [4, 4, 4, 4, 4, 1] })).to.be.false    // eslint-disable-line
    })

    it('Returns FALSE if group sizes differ by more than 1 in their size', function () {
      expect(constraints({ seq: [1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3] })).to.be.false    // eslint-disable-line
    })

    it('Returns FALSE if result fullfills not given number of groups', function () {
      expect(constraints({ seq: [1, 1, 1, 2, 2, 2] }, { groups: 3 })).to.be.false   // eslint-disable-line
    })

    it('Returns TRUE in case of one positive example', function () {
      expect(constraints({ seq: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4] }, { groups: 4 })).to.be.true   // eslint-disable-line
    })
  })
})
